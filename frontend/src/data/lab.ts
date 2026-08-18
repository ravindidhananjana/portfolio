export interface LabExperiment {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: "Active" | "Completed" | "Archived";
}

export const labExperiments: LabExperiment[] = [
  {
    id: "agent-rag-pipeline",
    title: "Ravi: Personal AI Agent RAG",
    description: "Building the custom Retrieval-Augmented Generation pipeline using FAISS and Gemini for this very portfolio.",
    date: "August 2024",
    tags: ["LLM", "RAG", "FAISS", "Gemini", "FastAPI"],
    status: "Active",
  },
  {
    id: "vision-transformers",
    title: "Vision Transformers for Medical Imaging",
    description: "Experimenting with ViT architectures vs CNNs for identifying anomalies in multimodal medical datasets.",
    date: "July 2024",
    tags: ["ViT", "PyTorch", "Computer Vision"],
    status: "Completed",
  },
  {
    id: "edge-ai-tracking",
    title: "Real-time Object Tracking on Edge Devices",
    description: "Deploying quantized YOLO models on Raspberry Pi for real-time tracking with minimal latency.",
    date: "May 2024",
    tags: ["YOLO", "Edge AI", "TensorFlow Lite"],
    status: "Archived",
  }
];
