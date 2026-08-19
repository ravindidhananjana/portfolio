import os
import json
import httpx
import base64
from app.config import settings
from app.ingestion.analyze_project import analyze_repository

# Use absolute paths relative to backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROJECTS_DIR = os.path.join(BACKEND_DIR, "app", "knowledge", "projects")
STATE_FILE = os.path.join(PROJECTS_DIR, "github_state.json")

def load_state() -> dict:
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_state(state: dict):
    os.makedirs(PROJECTS_DIR, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

async def fetch_github_repos() -> list[dict]:
    """
    Fetches public repositories, analyzes them if changed, and writes project knowledge to disk.
    Returns an empty list because the local loader will pick up the generated markdown files.
    """
    username = settings.GITHUB_USERNAME
    token = settings.GITHUB_TOKEN
    analyze_repos = [r.strip().lower() for r in settings.GITHUB_ANALYZE_REPOS.split(",") if r.strip()]
    max_size_bytes = settings.GITHUB_MAX_FILE_SIZE_KB * 1024

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "FastAPI-Ravi-Agent"
    }
    if token:
        headers["Authorization"] = f"token {token}"
        
    state = load_state()

    repos_url = f"https://api.github.com/users/{username}/repos?type=public&per_page=100"
    
    async with httpx.AsyncClient(headers=headers, timeout=30.0) as client:
        try:
            response = await client.get(repos_url)
            if response.status_code != 200:
                print(f"Error fetching repos: {response.status_code} - {response.text}")
                return []
            repos_data = response.json()
        except Exception as e:
            print(f"Exception fetching repos: {e}")
            return []

        for repo in repos_data:
            repo_name = repo.get("name", "")
            
            if analyze_repos and repo_name.lower() not in analyze_repos:
                continue

            print(f"Checking repository: {repo_name}")
            
            # Get latest commit
            commits_url = f"https://api.github.com/repos/{username}/{repo_name}/commits?per_page=1"
            try:
                commits_resp = await client.get(commits_url)
                if commits_resp.status_code == 200:
                    latest_commit = commits_resp.json()[0]["sha"]
                else:
                    print(f"Could not fetch commits for {repo_name}")
                    continue
            except Exception as e:
                print(f"Failed to fetch commits for {repo_name}: {e}")
                continue

            md_path = os.path.join(PROJECTS_DIR, f"{repo_name}.md")
            
            if state.get(repo_name) == latest_commit and os.path.exists(md_path):
                print(f"Skipping {repo_name}: No changes since last analysis.")
                continue
                
            print(f"Analyzing {repo_name} (New or updated commit: {latest_commit})...")

            # Fetch file tree
            tree_url = f"https://api.github.com/repos/{username}/{repo_name}/git/trees/{latest_commit}?recursive=1"
            file_contents = {}
            
            try:
                tree_resp = await client.get(tree_url)
                if tree_resp.status_code == 200:
                    tree_data = tree_resp.json().get("tree", [])
                    
                    # Filter relevant files
                    for item in tree_data:
                        if item["type"] != "blob":
                            continue
                        
                        path = item["path"]
                        # Skip irrelevant dirs
                        if any(x in path.split("/") for x in ["node_modules", "venv", ".venv", "__pycache__", ".git", "build", "dist", "migrations"]):
                            continue
                        
                        # Only take specific extensions + Dockerfile, etc
                        valid_exts = (".py", ".ipynb", ".md", ".js", ".ts", ".tsx", ".jsx", ".json", ".yaml", ".yml", "Dockerfile", "requirements.txt", "setup.py", "pyproject.toml")
                        if not any(path.endswith(ext) for ext in valid_exts) and "Dockerfile" not in path:
                            continue
                            
                        # Check size
                        if item.get("size", 0) > max_size_bytes:
                            print(f"Skipping {path} (too large: {item.get('size')} bytes)")
                            continue
                            
                        # Fetch file content using raw URL to save API quota
                        file_url = f"https://raw.githubusercontent.com/{username}/{repo_name}/{latest_commit}/{path}"
                        file_resp = await client.get(file_url)
                        if file_resp.status_code == 200:
                            file_contents[path] = file_resp.text
                        else:
                            print(f"Failed to fetch {path}")
            except Exception as e:
                print(f"Error fetching tree for {repo_name}: {e}")

            # Also fetch standard repo info
            repo_info = {
                "name": repo_name,
                "description": repo.get("description") or "No description",
                "topics": repo.get("topics", []),
                "language": repo.get("language") or "Unknown",
                "html_url": repo.get("html_url", "")
            }

            # Analyze project
            analysis_result = await analyze_repository(repo_info, file_contents)
            
            classification = analysis_result.get("classification", "NEEDS_REVIEW")
            markdown_content = analysis_result.get("markdown_content", f"# {repo_name}\n\nClassification: {classification}")
            
            # Format the output markdown file
            final_md = f"""---
title: {repo_name}
type: project
classification: {classification}
last_commit: {latest_commit}
---

{markdown_content}
"""
            # Save the file
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(final_md)
                
            # Update state
            state[repo_name] = latest_commit
            save_state(state)
            
            print(f"Finished analyzing {repo_name}. Classification: {classification}")

    # Return empty list because local_loader will pick up the generated files
    return []
