import os
import json
import asyncio
from app.agent.llm_client import GeminiClient

async def analyze_repository(repo_info: dict, file_contents: dict) -> dict:
    """
    Uses Gemini to analyze the repository contents and extract structured project knowledge.
    Returns a dict with the classification and the generated markdown content.
    """
    client = GeminiClient()
    
    # Prepare prompt
    prompt = f"""
    You are analyzing a GitHub repository to extract project knowledge for a portfolio AI agent.
    
    Repository Name: {repo_info['name']}
    Description: {repo_info['description']}
    Topics: {', '.join(repo_info['topics'])}
    Language: {repo_info['language']}
    URL: {repo_info['html_url']}
    
    Files provided for analysis:
    """
    
    for filepath, content in file_contents.items():
        prompt += f"\n--- {filepath} ---\n{content}\n"
        
    prompt += """
    Based on the repository contents, classify the project into ONE of the following categories:
    - PORTFOLIO_PROJECT: A significant project with implementation details, experiments, models, or clear results.
    - SUPPORTING_PROJECT: A minor script, fork, or utility with limited scope.
    - IGNORE: Empty repos, trivial forks, or irrelevant repos.
    - NEEDS_REVIEW: Uncertain classification.

    Then, generate a structured Markdown document representing the project knowledge.
    
    RULES:
    1. You must use the tags VERIFIED, INFERRED, or UNKNOWN for all factual claims.
       - VERIFIED: Explicitly supported by the repository evidence provided above.
       - INFERRED: A reasonable interpretation of the evidence, but not explicitly stated.
       - UNKNOWN: Insufficient evidence.
    2. Do NOT convert an inference into VERIFIED.
    3. Keep evidence references for important facts (e.g., "VERIFIED (Source: README.md) Test accuracy was 86.8%").
    4. For PORTFOLIO_PROJECT, extract: implementation details, experiments, models, datasets, evaluation, results, challenges and solutions, and the author's contribution.
    5. For SUPPORTING_PROJECT, extract: verified purpose, technologies, implementation, and relevant result.
    6. For IGNORE, just output the classification and a brief reason.
    
    Output Format:
    Return a Markdown document. The very first lines MUST be a YAML frontmatter block containing the classification, like this:
    ---
    classification: PORTFOLIO_PROJECT
    ---
    # Project Name
    
    ...rest of the markdown content...
    """
    
    try:
        response_text = ""
        async for chunk in client.generate_stream(prompt):
            response_text += chunk
            
        response_text = response_text.strip()
        if response_text.startswith("```markdown"):
            response_text = response_text[11:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        response_text = response_text.strip()
        
        # Parse classification from frontmatter
        classification = "NEEDS_REVIEW"
        if response_text.startswith("---"):
            parts = response_text.split("---", 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                for line in frontmatter.split('\n'):
                    if line.startswith("classification:"):
                        classification = line.split(":", 1)[1].strip()
                # The rest is the markdown content
                response_text = parts[2].strip()
                
        return {
            "classification": classification,
            "markdown_content": response_text
        }
    except Exception as e:
        print(f"Error analyzing {repo_info['name']}: {e}")
        return {
            "classification": "NEEDS_REVIEW",
            "markdown_content": f"# {repo_info['name']}\n\nAnalysis failed: {e}"
        }
