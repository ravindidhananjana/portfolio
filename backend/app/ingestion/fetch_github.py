import httpx
import base64
from app.config import settings

async def fetch_github_repos() -> list[dict]:
    """
    Fetches public repositories and their README contents for GITHUB_USERNAME.
    """
    username = settings.GITHUB_USERNAME
    token = settings.GITHUB_TOKEN
    exclude_repos = [r.strip().lower() for r in settings.GITHUB_EXCLUDE_REPOS.split(",") if r.strip()]

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "FastAPI-Ravi-Agent"
    }
    if token:
        headers["Authorization"] = f"token {token}"

    repos_url = f"https://api.github.com/users/{username}/repos?type=public&per_page=100"
    
    async with httpx.AsyncClient(headers=headers, timeout=15.0) as client:
        try:
            response = await client.get(repos_url)
            if response.status_code != 200:
                print(f"Error fetching repos: {response.status_code} - {response.text}")
                return []
            
            repos_data = response.json()
        except Exception as e:
            print(f"Exception fetching repos: {e}")
            return []

        documents = []
        for repo in repos_data:
            # Filters
            if repo.get("fork", False):
                continue
            
            repo_name = repo.get("name", "")
            if repo_name.lower() in exclude_repos:
                continue

            description = repo.get("description") or "No description provided."
            topics = repo.get("topics", [])
            language = repo.get("language") or "Unknown"
            url = repo.get("html_url", "")

            # Fetch README
            readme_url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
            readme_content = ""
            try:
                readme_resp = await client.get(readme_url)
                if readme_resp.status_code == 200:
                    readme_json = readme_resp.json()
                    encoded_content = readme_json.get("content", "")
                    # GitHub base64 contains newlines sometimes, so strip and decode
                    encoded_content = encoded_content.replace("\n", "").replace("\r", "")
                    decoded_bytes = base64.b64decode(encoded_content)
                    readme_content = decoded_bytes.decode("utf-8", errors="ignore")
            except Exception as e:
                print(f"Failed to fetch/decode README for {repo_name}: {e}")

            # Prepare structured document
            # We keep formatting readable for LLM context inclusion
            structured_content = (
                f"Repository: {repo_name}\n"
                f"Description: {description}\n"
                f"Primary Language: {language}\n"
                f"Topics: {', '.join(topics) if topics else 'None'}\n"
                f"GitHub URL: {url}\n\n"
                f"--- README ---\n"
                f"{readme_content if readme_content else 'No README file found.'}"
            )

            documents.append({
                "title": repo_name,
                "content": structured_content,
                "source": f"github/{repo_name}",
                "type": "project",
                "url": url
            })
            print(f"Successfully processed repository: {repo_name}")

        return documents
