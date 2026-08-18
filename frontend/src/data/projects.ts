export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "leukemia-detection",
    title: "Multimodal Leukemia Detection",
    description: "An AI system to assist in the detection of leukemia using multimodal medical data.",
    tags: ["Computer Vision", "PyTorch", "Medical AI", "Python"],
    githubUrl: "https://github.com/ravindidhananjana/leukemia-detection",
    featured: true,
  },
  {
    id: "rsna-knee",
    title: "RSNA Knee Osteoarthritis Detection",
    description: "Predictive model for detecting knee osteoarthritis severity from X-ray images, built for a Kaggle competition.",
    tags: ["TensorFlow", "Image Classification", "Kaggle", "Healthcare"],
    githubUrl: "https://github.com/ravindidhananjana/rsna-knee-detection",
    featured: true,
  },
  {
    id: "weather-forecasting",
    title: "Predictive Weather Modeling",
    description: "Time-series forecasting models to predict severe weather patterns utilizing meteorological data.",
    tags: ["Machine Learning", "Time-Series", "Scikit-Learn"],
    githubUrl: "https://github.com/ravindidhananjana/weather-forecasting",
    featured: false,
  },
  {
    id: "lunar-ai",
    title: "Lunar Surface Analysis AI",
    description: "Computer vision application to map and analyze lunar surfaces from satellite imagery.",
    tags: ["Computer Vision", "Space Tech", "Segmentation", "OpenCV"],
    githubUrl: "https://github.com/ravindidhananjana/lunar-ai",
    featured: true,
  },
  {
    id: "tom-jerry",
    title: "Tom and Jerry Action Classifier",
    description: "A fun deep learning project that classifies and tracks characters and actions in Tom and Jerry cartoon clips.",
    tags: ["Deep Learning", "Action Recognition", "Video Processing"],
    githubUrl: "https://github.com/ravindidhananjana/tom-and-jerry-classifier",
    featured: false,
  }
];
