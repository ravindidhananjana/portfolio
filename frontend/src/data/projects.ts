export interface Project {
  id: string;
  title: string;
  description: string;
  keyResult?: string;
  tags: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "aml-classification",
    title: "Multimodal AML Classification",
    description:
      "Deep learning pipeline integrating 81K+ blood smear images with clinical data for Acute Myeloid Leukemia subtype classification. Combines CNN-based image features with tabular patient data for a robust multimodal diagnosis system.",
    keyResult: "86.8% test accuracy",
    tags: ["Deep Learning", "Computer Vision", "Medical AI", "Multimodal AI", "PyTorch"],
    liveUrl: "https://aml-cancer-classification.streamlit.app/",
    featured: true,
  },
  {
    id: "lunar-landing",
    title: "Lunar Landing Site Risk Analysis",
    description:
      "Computer vision hazard evaluation pipeline using NASA/LROC imagery to map terrain risks for lunar touchdowns. Segments crater fields, slope gradients, and shadowed regions to generate a composite safety score for candidate landing sites.",
    tags: ["Computer Vision", "Space AI", "Remote Sensing", "NASA/LROC", "OpenCV"],
    liveUrl: "https://lunar-landing-safety-analysis.streamlit.app/",
    featured: true,
  },
  {
    id: "ai-clinical-simulator",
    title: "AI Clinical Case Simulator",
    description:
      "Interactive medical education tool powered by Google Gemini and Streamlit. Presents dynamic MBBS-level clinical cases with multilingual voice interaction, adaptive questioning, and real-time feedback to help medical students practice clinical reasoning.",
    tags: ["Generative AI", "Google Gemini", "LLM", "Medical AI", "Streamlit", "Multimodal AI"],
    liveUrl: "https://final-mbbs-clinical-simulator.streamlit.app/",
    featured: true,
  },
  {
    id: "rsna-knee",
    title: "RSNA Knee Osteoarthritis Detection",
    description:
      "Predictive model for detecting knee osteoarthritis severity from X-ray images, built for a Kaggle competition.",
    tags: ["TensorFlow", "Image Classification", "Kaggle", "Healthcare"],
    githubUrl: "https://github.com/ravindidhananjana/rsna-knee-detection",
    featured: false,
  },
  {
    id: "weather-forecasting",
    title: "Predictive Weather Modeling",
    description:
      "Time-series forecasting models to predict severe weather patterns utilizing meteorological data.",
    tags: ["Machine Learning", "Time-Series", "Scikit-Learn"],
    githubUrl: "https://github.com/ravindidhananjana/weather-forecasting",
    featured: false,
  },
  {
    id: "tom-jerry",
    title: "Tom and Jerry Action Classifier",
    description:
      "Deep learning project that classifies and tracks characters and actions in Tom and Jerry cartoon clips.",
    tags: ["Deep Learning", "Action Recognition", "Video Processing"],
    githubUrl: "https://github.com/ravindidhananjana/tom-and-jerry-classifier",
    featured: false,
  },
];
