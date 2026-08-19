---
title: AML_CANCER_CLASSIFICATION
type: project
classification: PORTFOLIO_PROJECT
last_commit: ebe9ef2e24337532e345d3229461421aa8bc81ab
---

# AML Cancer Classification using Multimodal Machine Learning

## Executive Summary
This repository contains a end-to-end multimodal machine learning system for classifying Acute Myeloid Leukemia (AML) genetic subtypes. The system combines morphological features extracted from single-cell peripheral blood smear microscopy images with 15 clinical laboratory differential count measurements.

The solution extracts deep feature representations using pretrained Convolutional Neural Network (CNN) backbones (ResNet50, MobileNetV2, EfficientNetB0), aggregates image features to the patient level, applies Dimensionality Reduction via Principal Component Analysis (PCA), and concatenates them with normalized clinical lab features. The combined multimodal feature matrix is classified using a tuned XGBoost model. The final application includes a multi-page Streamlit dashboard featuring an inference pipeline and an AI chatbot powered by the Groq API (`llama-3.1-8b-instant`).

VERIFIED (Source: `README.md`, `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`, `05_finalModel.ipynb`, `app.py`, `pages/prediction.py`)

---

## Dataset & Target Classes

### Source & Structure
- **Dataset**: TCIA AML-Cytomorphology (`AML-Cytomorphology_MLL_Helmholtz`) dataset (Hehr et al., 2023). VERIFIED (Source: `README.md`, `pages/about.py`)
- **Total Images**: 81,220 microscopy blood smear `.tif` images (~430 images per patient). VERIFIED (Source: `02_featureExtraction.ipynb`, `pages/about.py`)
- **Total Patients**: 189 patients. VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`)

### Class Map & Patient Distribution
The classification task covers 5 distinct classes:
1. `0 - Control`: Healthy / non-malignant controls (60 patients, 20,305 images) VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`)
2. `1 - NPM1`: Nucleophosmin 1 mutation (36 patients, 17,715 images) VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`)
3. `2 - PML_RARA`: Acute Promyelocytic Leukemia (24 patients, 11,585 images) VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`)
4. `3 - RUNX1_RUNX1T1`: t(8;21) translocation AML (32 patients, 14,403 images) VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`)
5. `4 - CBFB_MYH11`: Core Binding Factor AML / inv(16) (37 patients, 17,212 images) VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`)

---

## Technical Architecture & Pipeline

```
[ Blood Smear Images (.tif) ] ---> ResNet50 Feature Extractor (2048-dim) ---> Patient Mean Aggregation ---> StandardScaler + PCA
                                                                                                                   |
                                                                                                                   v
                                                                                                         [ Concatenate (45-dim) ] ---> XGBoost Classifier ---> 5-Class Prediction
                                                                                                                   ^
                                                                                                                   |
[ 15 Clinical Lab Features ] --------------------------------------------------------------------> StandardScaler
```
VERIFIED (Source: `05_finalModel.ipynb`, `app.py`, `pages/about.py`, `pages/prediction.py`)

### 1. Image Processing Branch
- **Input Preprocessing**: Images resized to $224 \times 224 \times 3$ and passed through model-specific preprocessing function (`resnet_preprocess`, `mobilenet_preprocess`, `efficientnet_preprocess`). VERIFIED (Source: `02_featureExtraction.ipynb`)
- **Feature Extraction**:
  - `ResNet50`: Global Average Pooling output $\rightarrow 2048$ dimensions per image. VERIFIED (Source: `02_featureExtraction.ipynb`)
  - `MobileNetV2`: Global Average Pooling output $\rightarrow 1280$ dimensions per image. VERIFIED (Source: `02_featureExtraction.ipynb`)
  - `EfficientNetB0`: Global Average Pooling output $\rightarrow 1280$ dimensions per image. VERIFIED (Source: `02_featureExtraction.ipynb`)
- **Patient-Level Aggregation**: Takes the arithmetic mean across all image vectors belonging to a given patient ID, compressing 81,220 image vectors into 189 patient vectors. VERIFIED (Source: `03_imageBranchComparison.ipynb`, `05_finalModel.ipynb`)
- **Scaling & Dimensionality Reduction**: `StandardScaler` followed by `PCA` set to preserve 95% of explained variance (reducing 2048 image dimensions to ~30–44 components). VERIFIED (Source: `03_imageBranchComparison.ipynb`, `05_finalModel.ipynb`, `pages/about.py`)

### 2. Clinical Processing Branch
- **Input Features (15 Total)**: `sex_1f_2m`, `age`, `leucocytes_per_ul`, `pb_myeloblast`, `pb_promyelocyte`, `pb_myelocyte`, `pb_metamyelocyte`, `pb_neutrophil_band`, `pb_neutrophil_segmented`, `pb_eosinophil`, `pb_basophil`, `pb_monocyte`, `pb_lymph_typ`, `pb_lymph_atyp_react`, `pb_other`. VERIFIED (Source: `05_finalModel.ipynb`, `06_prediction.ipynb`, `pages/prediction.py`)
- **Normalization**: Standardized using `StandardScaler`. VERIFIED (Source: `05_finalModel.ipynb`, `pages/prediction.py`)

### 3. Feature Fusion & Classifier
- **Fusion**: Feature concatenation of PCA-transformed image vector + standardized clinical vector. VERIFIED (Source: `05_finalModel.ipynb`, `pages/prediction.py`)
- **Class Imbalance Handling**: Computed sample weights using `compute_sample_weight(class_weight="balanced", y=y_train)` passed during XGBoost training. VERIFIED (Source: `03_imageBranchComparison.ipynb`, `05_finalModel.ipynb`)
- **Final Model Hyperparameters**:
  - Algorithm: `XGBClassifier`
  - Objective: `multi:softprob` (5 classes)
  - `n_estimators`: 500
  - `max_depth`: 5
  - `learning_rate`: 0.03
  - `subsample`: 0.6
  - `colsample_bytree`: 0.6
  - `gamma`: 0.5
  - `min_child_weight`: 3
  - Evaluation Metric: `mlogloss`
  VERIFIED (Source: `05_finalModel.ipynb`)

---

## Experimental Results & Performance

### 1. CNN Backbone Comparison (Image Branch Only, Patient-Level Aggregation)
Tested on an 80/20 stratified split (151 train patients, 38 test patients) using XGBoost (`n_estimators=200`, `max_depth=4`, `learning_rate=0.05`):

| Backbone | Dimensions | PCA Dimensions (95% Var) | Test Accuracy | Weighted F1 | Macro F1 | Execution Time |
|---|---|---|---|---|---|---|
| **ResNet50** | 2048 | 44 | **76.32%** | **0.7481** | **0.7064** | 1.01s |
| **MobileNetV2** | 1280 | 42 | 73.68% | 0.7322 | 0.6860 | 0.95s |
| **EfficientNetB0** | 1280 | 44 | 65.79% | 0.6509 | 0.5967 | 0.99s |

VERIFIED (Source: `03_imageBranchComparison.ipynb`)

### 2. Downstream Classifier Comparison (5-Fold Stratified Cross-Validation on Multimodal Data)

| Model | CV Accuracy | CV Macro F1 | CV Weighted F1 | Status |
|---|---|---|---|---|
| **XGBoost** | **76.84%** | **72.91%** | **76.52%** | **Selected Final Model** |
| **Random Forest** | 70.86% | 63.09% | 69.61% | Evaluated |
| **MLP Classifier** | 70.24% | 64.49% | 70.21% | Evaluated |

VERIFIED (Source: `pages/dashboard.py`)

### 3. Final Multimodal Model Test Set Performance (ResNet50 + Clinical + Tuned XGBoost)

- **Overall Test Accuracy**: **84.21%** VERIFIED (Source: `pages/dashboard.py`)
- **Weighted F1 Score**: **83.89%** VERIFIED (Source: `pages/dashboard.py`)
- **Macro F1 Score**: **80.72%** VERIFIED (Source: `pages/dashboard.py`)
- **Test Patients Count**: 38 patients VERIFIED (Source: `pages/dashboard.py`)

#### Per-Class Test Breakdown:
| Subtype Class | Precision | Recall | F1-Score | Test Support |
|---|---|---|---|---|
| **Control** | 0.92 | 1.00 | **0.96** | 12 |
| **CBFB_MYH11** | 0.89 | 1.00 | **0.94** | 8 |
| **NPM1** | 0.83 | 0.71 | **0.77** | 7 |
| **PML_RARA** | 1.00 | 0.60 | **0.75** | 5 |
| **RUNX1_RUNX1T1** | 0.57 | 0.67 | **0.62** | 6 |

VERIFIED (Source: `pages/dashboard.py`)

#### Confusion Matrix (Held-out Test Set):
```
Actual \ Predicted | Control | NPM1 | PML_RARA | RUNX1_RUNX1T1 | CBFB_MYH11
-------------------|---------|------|----------|---------------|-----------
Control            |   12    |  0   |    0     |       0       |     0
NPM1               |    0    |  5   |    0     |       2       |     0
PML_RARA           |    1    |  0   |    3     |       1       |     0
RUNX1_RUNX1T1      |    0    |  1   |    0     |       4       |     1
CBFB_MYH11         |    0    |  0   |    0     |       0       |     8
```
VERIFIED (Source: `pages/dashboard.py`)

---

## Web Application & User Interface

The repository provides a complete Streamlit web application (`app.py` and modular pages in `pages/`):

1. **Home (`app.py`)**: System overview, key statistics, pipeline visualization, and subtype classification details. VERIFIED (Source: `app.py`)
2. **Prediction (`pages/prediction.py`)**: Accepts upload of single/multiple cell `.tif`/`.png`/`.jpg` images per patient, extracts features on-the-fly using Keras ResNet50, collects 15 clinical parameters, executes pipeline transformation, and outputs probability distributions across the 5 AML classes. VERIFIED (Source: `pages/prediction.py`)
3. **AI Chatbot (`pages/AI_chatbot.py`)**: Integrates with Groq API using `llama-3.1-8b-instant`. Features automatic context injection of the patient's latest prediction results (predicted subtype, confidence, clinical inputs) into the prompt for clinical explanation and interactive Q&A. VERIFIED (Source: `pages/AI_chatbot.py`)
4. **Dashboard (`pages/dashboard.py`)**: Interactive model performance metrics, per-class bar charts, confusion matrix visualization, and 5-fold cross-validation comparisons. VERIFIED (Source: `pages/dashboard.py`)
5. **About (`pages/about.py`)**: Project citation, dataset breakdown, methodology overview, team details, and academic disclaimers. VERIFIED (Source: `pages/about.py`)
6. **Devcontainer Setup (`.devcontainer/devcontainer.json`)**: Docker container config built on `mcr.microsoft.com/devcontainers/python:1-3.11-bookworm` that automatically provisions packages and launches `streamlit run pages/dashboard.py` on port 8501 upon attachment. VERIFIED (Source: `.devcontainer/devcontainer.json`)

---

## Key Technologies Used

- **Deep Learning / Computer Vision**: TensorFlow, Keras (`ResNet50`, `MobileNetV2`, `EfficientNetB0`), Pillow VERIFIED (Source: `02_featureExtraction.ipynb`, `06_prediction.ipynb`, `requirements.txt`)
- **Machine Learning & Fusion**: XGBoost (`XGBClassifier`), Scikit-learn (`StandardScaler`, `PCA`, `train_test_split`, `f1_score`, `compute_sample_weight`), Joblib VERIFIED (Source: `03_imageBranchComparison.ipynb`, `05_finalModel.ipynb`, `requirements.txt`)
- **Data Manipulation & Analysis**: NumPy, Pandas VERIFIED (Source: `02_featureExtraction.ipynb`, `03_imageBranchComparison.ipynb`, `requirements.txt`)
- **Frontend & Deployment**: Streamlit, Requests (Groq API client), VS Code Devcontainers VERIFIED (Source: `app.py`, `pages/AI_chatbot.py`, `.devcontainer/devcontainer.json`, `requirements.txt`)

---

## Team & Provenance

- **Repository Owner**: Ravindi Dhananjana (`ravindidhananjana`) VERIFIED (Source: GitHub metadata and `02_featureExtraction.ipynb` executionInfo)
- **Project Authors**:
  - Yathindu Jayawardhane VERIFIED (Source: `README.md`)
  - Ravindi Gunasekara / Ravindi Dhananjana VERIFIED (Source: `README.md`, `02_featureExtraction.ipynb`)
  - Sindupa Ekanayake VERIFIED (Source: `README.md`)
  - Sudara Jayalath VERIFIED (Source: `README.md`)
- **Institution / Program**: NIBM KIC · Computer Science with AI (Team Code: `KIC-HNDCSAI-252F`) VERIFIED (Source: `pages/about.py`, `app.py`)
