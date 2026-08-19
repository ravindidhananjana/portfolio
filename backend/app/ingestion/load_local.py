import os

# Base backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_KNOWLEDGE_DIR = os.path.join(BACKEND_DIR, "app", "knowledge")

def load_local_knowledge(knowledge_dir: str = DEFAULT_KNOWLEDGE_DIR) -> list[dict]:
    """
    Recursively scans the knowledge directory for Markdown files and loads them.
    """
    documents = []
    if not os.path.exists(knowledge_dir):
        os.makedirs(knowledge_dir, exist_ok=True)
        return []

    for root, _, files in os.walk(knowledge_dir):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    # Determine source label
                    relative_path = os.path.relpath(file_path, knowledge_dir)
                    source_name = relative_path.replace("\\", "/").replace(".md", "")

                    # Determine document type
                    doc_type = "profile_detail"
                    if "projects" in root:
                        doc_type = "project_detail"
                    elif file == "profile.md":
                        doc_type = "profile"
                    elif file == "skills.md":
                        doc_type = "skills"
                    elif file == "education.md":
                        doc_type = "education"
                    elif file == "experience.md":
                        doc_type = "experience"
                    elif file == "achievements.md":
                        doc_type = "achievements"
                    elif file == "contact.md":
                        doc_type = "contact"

                    documents.append({
                        "title": file.replace(".md", "").replace("-", " ").title(),
                        "content": content,
                        "source": f"knowledge/{source_name}",
                        "type": doc_type,
                        "url": f"/about" if doc_type == "profile" else f"/{source_name}"
                    })
                    print(f"Loaded local knowledge file: {relative_path}")
                except Exception as e:
                    print(f"Error loading {file_path}: {e}")

    return documents
