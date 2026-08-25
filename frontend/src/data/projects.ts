export interface ProjectDetails {
  overview: string;
  objectives?: string[];
  dataset?: {
    source?: string;
    citation?: string;
    doiUrl?: string;
    details?: string[];
  };
  projectStructure?: {
    file: string;
    description: string;
    items?: string[];
  }[];
  methodology?: {
    title: string;
    points: string[];
  }[];
  modelsEvaluated?: string[];
  evaluationMetrics?: string[];
  technologiesUsed?: string[];
  keyFeatures?: {
    title: string;
    description?: string;
    points?: string[];
  }[];
  caseDirectory?: {
    category: string;
    systems: string;
  }[];
  simulationPhases?: {
    phase: string;
    title: string;
    description: string;
    points?: string[];
  }[];
  results?: string;
  application?: string;
  exampleOutputs?: string[];
}

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
  details?: ProjectDetails;
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
    details: {
      overview:
        "This project presents a multimodal machine learning approach for Acute Myeloid Leukemia (AML) subtype classification by combining microscopy blood smear image features with clinical laboratory and patient data. The system integrates deep learning–based image feature extraction with machine learning classification models to improve diagnostic accuracy and support automated AML subtype detection.",
      objectives: [
        "Develop an automated AML classification system",
        "Extract meaningful image features using pretrained CNN models",
        "Analyze clinical data for subtype prediction",
        "Combine image and clinical features using multimodal learning",
        "Compare multiple machine learning models and evaluate performance",
      ],
      dataset: {
        source: "The Cancer Imaging Archive (TCIA) Blood Cancer Dataset",
        citation:
          "Hehr, M., Sadafi, A., Matek, C., Lienemann, P., Pohlkamp, C., Haferlach, T., Spiekermann, K., & Marr, C. (2023). A morphological dataset of white blood cells from patients with four different genetic AML entities and non-malignant controls (AML-Cytomorphology_MLL_Helmholtz) (Version 1) [Data set]. The Cancer Imaging Archive.",
        doiUrl: "https://doi.org/10.7937/6PPE-4020",
        details: [
          "~81,000 microscopy blood smear images",
          "189 patients",
          "Multiple AML subtypes and control samples",
          "Clinical laboratory measurements and demographic data",
        ],
      },
      projectStructure: [
        {
          file: "01_clinicalBranch.ipynb",
          description: "Clinical data preprocessing, missing value handling, feature analysis, correlation analysis, and clinical model training.",
        },
        {
          file: "02_featureExtraction.ipynb",
          description: "Image preprocessing and CNN feature extraction using pretrained models (EfficientNetB0, ResNet50, MobileNetV2).",
        },
        {
          file: "03_imageBranchComparison.ipynb",
          description: "Patient-level feature aggregation and comparison of image-based classification models (Random Forest, XGBoost, MLP).",
        },
        {
          file: "04_multiModalComparison.ipynb",
          description: "Fusion of image and clinical features, multimodal feature comparison, and cross-validation evaluation.",
        },
        {
          file: "05_finalModel.ipynb",
          description: "Trains the selected final model on the full dataset, saves model and preprocessing objects, and prepares for deployment.",
        },
        {
          file: "06_prediction.ipynb",
          description: "Prediction pipeline for new patient samples with end-to-end inference workflow.",
        },
      ],
      methodology: [
        {
          title: "Image Processing",
          points: [
            "Microscopy images resized and normalized",
            "Deep feature extraction using pretrained CNN architectures (EfficientNetB0, ResNet50, MobileNetV2)",
            "Mean aggregation of image embeddings at patient level",
          ],
        },
        {
          title: "Clinical Data Processing",
          points: [
            "Missing value imputation",
            "Feature scaling and preprocessing",
            "Statistical and correlation analysis",
          ],
        },
      ],
      modelsEvaluated: ["Random Forest", "XGBoost", "Multi-Layer Perceptron (MLP)"],
      evaluationMetrics: [
        "Accuracy (86.8% Test Accuracy)",
        "Precision & Recall",
        "F1-score & Weighted F1-score",
        "Confusion Matrix",
        "Stratified Cross-Validation",
      ],
      technologiesUsed: [
        "Python",
        "TensorFlow / Keras",
        "Scikit-learn",
        "XGBoost",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Streamlit",
      ],
      results:
        "The multimodal approach achieved 86.8% test accuracy, significantly outperforming single-modality approaches by leveraging both morphological image features and clinical laboratory markers.",
      application:
        "A Streamlit-based web application was developed to allow real-time prediction of AML subtypes using uploaded microscopy images and clinical patient data. The app also includes an AI-powered chatbot assistant to provide user guidance and prediction support.",
    },
  },
  {
    id: "lunar-landing",
    title: "Lunar Landing Site Risk Analysis",
    description:
      "Computer vision hazard evaluation pipeline using NASA/LROC imagery to map terrain risks for lunar touchdowns. Segments crater fields, slope gradients, and shadowed regions to generate a composite safety score for candidate landing sites.",
    keyResult: "Continuous Risk Heatmaps",
    tags: ["Computer Vision", "Space AI", "Remote Sensing", "NASA/LROC", "OpenCV"],
    liveUrl: "https://lunar-landing-safety-analysis.streamlit.app/",
    featured: true,
    details: {
      overview:
        "This project analyzes real lunar surface images to identify safer landing regions for autonomous lunar landers using traditional computer vision and image processing techniques. The system evaluates terrain safety by analyzing surface roughness, edge density, shadow regions, and terrain risk distribution to generate a continuous risk map for landing site selection.",
      objectives: [
        "Preprocess lunar surface images for optimal feature extraction",
        "Detect hazardous terrain features (craters, boulders, steep slopes)",
        "Generate continuous terrain risk heatmaps",
        "Support autonomous lunar touchdown decision-making",
      ],
      dataset: {
        source: "NASA / Lunar Reconnaissance Orbiter Camera (LROC) lunar imagery sources",
        details: [
          "20 real lunar surface high-resolution images",
          "Craters and boulder fields",
          "Shadows and low-sun elevation angles",
          "Rough and undulating terrains alongside flat landing plains",
        ],
      },
      methodology: [
        {
          title: "1. Image Preprocessing",
          points: [
            "Grayscale conversion & intensity normalization",
            "Median filtering to remove sensor noise",
            "CLAHE (Contrast Limited Adaptive Histogram Equalization) contrast enhancement",
            "Sharpening filters & Gamma correction for shadow enhancement",
          ],
        },
        {
          title: "2. Edge Detection (Hazard Density)",
          points: [
            "Canny edge detection to identify strong terrain discontinuities",
            "High edge density directly flags craters, boulder fields, and uneven rock formations",
          ],
        },
        {
          title: "3. Roughness Analysis",
          points: [
            "Local intensity variations standard deviation filtering",
            "Gaussian smoothing applied to spread terrain risk around hazardous zones",
          ],
        },
        {
          title: "4. Shadow Detection",
          points: [
            "Otsu and threshold-based dark region segmentation",
            "Identifies deep shadows that obscure potential hazards and reduce lander sensor visibility",
          ],
        },
        {
          title: "5. Continuous Risk Mapping & Decision Analysis",
          points: [
            "Combines roughness, edge density, and shadows via weighted multi-layer matrix scoring",
            "Outputs normalized 2D risk heatmaps (Green = Safe, Yellow = Moderate, Red = Unsafe)",
            "Identifies contiguous safe zones suitable for touchdown",
          ],
        },
      ],
      technologiesUsed: ["Python", "OpenCV", "NumPy", "Matplotlib", "Streamlit"],
      exampleOutputs: [
        "Preprocessed CLAHE enhanced imagery",
        "Canny edge hazard density maps",
        "Surface roughness variance maps",
        "Shadow segmentation hazard masks",
        "Continuous composite risk decision heatmaps",
      ],
      application:
        "Deployed as an interactive Streamlit application enabling aerospace researchers and mission planners to upload lunar surface images and inspect real-time multi-layered hazard analyses.",
    },
  },
  {
    id: "ai-clinical-simulator",
    title: "AI Clinical Case Simulator",
    description:
      "Interactive medical education tool powered by Google Gemini and Streamlit. Presents dynamic MBBS-level clinical cases with multilingual voice interaction, adaptive questioning, and real-time feedback to help medical students practice clinical reasoning.",
    keyResult: "Voice & Multilingual AI",
    tags: ["Generative AI", "Google Gemini", "LLM", "Medical AI", "Streamlit", "Multimodal AI"],
    liveUrl: "https://final-mbbs-clinical-simulator.streamlit.app/",
    featured: true,
    details: {
      overview:
        "An interactive AI-powered clinical case simulator built specifically for Sri Lankan medical students preparing for their Final MBBS Clinical Examinations (Long Cases and Short Cases). The simulator uses Streamlit for the UI and the Google GenAI SDK (gemini-3.1-flash-lite) to dynamically model patient scenarios and senior examiner assessments — grounded in local Sri Lankan ward settings and the undergraduate clinical syllabus.",
      keyFeatures: [
        {
          title: "🎙️ Hands-Free Voice-to-Text Input",
          points: [
            "Native Browser Integration: Uses the browser's native Web Speech API embedded directly inside the chat input box.",
            "Multilingual Recognition: Speak in Sinhala, Singlish, or English. The browser instantly transcribes your speech.",
            "Auto-Submit: When you finish speaking, the simulator automatically submits your question to the patient.",
            "Blazing Fast Text Responses: The AI patient responds immediately in text format (no slow audio-generation overhead).",
          ],
        },
        {
          title: "🗣️ Multilingual Patient Engine",
          points: [
            "Sinhala Script: Type/speak in Sinhala (e.g., 'මොකද අමාරුව?') → Patient replies in colloquial Sinhala.",
            "Singlish: Type/speak in Singlish (e.g., 'mokada amaruwa?') → Patient replies in natural Singlish.",
            "English: Realistic Sri Lankan patient persona responding with culturally accurate symptoms and expressions.",
          ],
        },
      ],
      caseDirectory: [
        { category: "Medicine Long Cases", systems: "CVS, RS, GIT, GUT, Nervous & MS, Endocrine, Systemic, Haematological, Infections" },
        { category: "Medicine Short Cases", systems: "CVS, RS, GIT, Abdomen, GUT, Nervous & MS, Endocrine, Haematological" },
        { category: "Surgery Long Cases", systems: "Vascular, Head & Neck, Chest & Breast, GIT, GUT, Orthopaedics" },
        { category: "Surgery Short Cases", systems: "Vascular, Head & Neck, Chest & Breast, GIT, GUT, Orthopaedics, Miscellaneous" },
        { category: "Paediatric Long Cases", systems: "CVS, RS, Endocrine, Haematological, GIT, Systemic, GUT, Nervous & MS, Infectious" },
        { category: "Paediatric Short Cases", systems: "CVS, RS, CNS & MS, Haematological, Abdomen, GUT, Skin, Other" },
        { category: "Gynecology Cases", systems: "Benign & Malignant Gynecology, Infertility, Prolapse, Endocrine, Infections" },
        { category: "Obstetrics Cases", systems: "Antenatal, Postnatal, Intrapartum, High-risk Obstetrics" },
      ],
      simulationPhases: [
        {
          phase: "Phase 1",
          title: "Patient Simulation (PATIENT_SIM)",
          description:
            "The AI plays a patient admitted to a local Sri Lankan Teaching Hospital ward. Adapts symptom responses to fit the assigned hidden diagnosis without ever revealing medical jargon. Full conversational context is maintained across the history-taking session.",
        },
        {
          phase: "Phase 2",
          title: "Examiner Review (EXAMINER_REVIEW)",
          description:
            "Triggered by typing 'done'. Evaluates only the questions the student asked (patient replies are hidden) to accurately assess clinical reasoning. Provides a structured critique covering PC/HPC depth, history gaps, and diagnostic omissions, continuing into an interactive viva.",
        },
      ],
      technologiesUsed: [
        "Streamlit >= 1.31",
        "Google GenAI SDK (gemini-3.1-flash-lite)",
        "Web Speech API (webkitSpeechRecognition)",
        "Vanilla CSS (Glassmorphism & Micro-animations)",
        "Python",
      ],
      application:
        "Deployed as a publicly accessible Streamlit application designed for MBBS undergraduates across Sri Lankan state medical faculties.",
    },
  },
];
