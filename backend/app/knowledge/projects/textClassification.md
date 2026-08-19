---
title: textClassification
type: project
classification: PORTFOLIO_PROJECT
last_commit: 743a57dd5c2fcc3e1e867c2e9ec88b8cb3c9c154
---

# Text Classification Project

## Overview
The `textClassification` repository implements an end-to-end NLP text classification workflow in a Jupyter Notebook (`final_fixed.ipynb`) VERIFIED (Source: README.md). The project focuses on classifying news articles into categories by preprocessing textual data, extracting features using Bag-of-Words and TF-IDF, training multiple Machine Learning models, selecting the best-performing model, and generating predictions on an unlabeled test set VERIFIED (Source: README.md).

## Implementation Details & Technology Stack

- **Primary Language & Tools**: Python, Jupyter Notebook VERIFIED (Source: Metadata, README.md).
- **Machine Learning Library**: `scikit-learn` VERIFIED (Source: README.md).
- **Text Preprocessing**:
  - Lowercasing VERIFIED (Source: README.md).
  - Removing non-letter characters VERIFIED (Source: README.md).
  - Collapsing extra whitespace VERIFIED (Source: README.md).
- **Feature Engineering**:
  - Bag-of-Words via `CountVectorizer` VERIFIED (Source: README.md).
  - Term Frequency-Inverse Document Frequency via `TfidfVectorizer` VERIFIED (Source: README.md).

## Datasets & Pipeline Architecture

### Pipeline Workflow
1. **Data Ingestion**: Load tab-separated (`\t`) dataset from `trainset.txt` VERIFIED (Source: README.md).
2. **Data Cleaning**: Inspect entries and remove invalid or empty text entries VERIFIED (Source: README.md).
3. **Preprocessing**: Apply text normalization steps (lowercasing, character filtering, whitespace collapsing) VERIFIED (Source: README.md).
4. **Feature Extraction**: Generate feature representations using both `CountVectorizer` and `TfidfVectorizer` VERIFIED (Source: README.md).
5. **Model Evaluation**: Train and evaluate candidate classification models VERIFIED (Source: README.md).
6. **Model Retraining**: Select the best model based on comparative evaluation metrics and retrain it on the full labeled dataset VERIFIED (Source: README.md).
7. **Inference & Export**: Generate predictions on `testsetwithoutlabels.txt` and export predictions to `predictions.csv` with a single `Predicted_Label` column VERIFIED (Source: README.md).

### Datasets
- **Training Set (`trainset.txt`)**: Tab-separated dataset containing columns `Class`, `Title`, `Date`, and `Body` VERIFIED (Source: README.md).
- **Test Set (`testsetwithoutlabels.txt`)**: Unlabeled tab-separated dataset containing columns `Title`, `Date`, and `Body` VERIFIED (Source: README.md).
- **Output (`predictions.csv`)**: CSV output file containing predictions under the column `Predicted_Label` VERIFIED (Source: README.md).

## Experiments and Models Evaluated

The project benchmarks four model/feature combinations VERIFIED (Source: README.md):
1. **Multinomial Naive Bayes** with **Bag-of-Words (`CountVectorizer`)** VERIFIED (Source: README.md).
2. **Multinomial Naive Bayes** with **TF-IDF (`TfidfVectorizer`)** VERIFIED (Source: README.md).
3. **Logistic Regression** with **Bag-of-Words (`CountVectorizer`)** VERIFIED (Source: README.md).
4. **Logistic Regression** with **TF-IDF (`TfidfVectorizer`)** VERIFIED (Source: README.md).

### Evaluation Results
- Specific numerical accuracy scores or evaluation metrics for each model variant are UNKNOWN as they are not explicitly detailed in the provided README.md file.

## Key Challenges and Solutions
- **Handling Unlabeled Test Data**: The pipeline handles end-to-end evaluation and retraining on the full labeled dataset prior to predicting on unlabeled test data VERIFIED (Source: README.md).
- **Data Quality**: The workflow explicitly includes validation to remove empty or invalid entries before feature extraction VERIFIED (Source: README.md).

## Author's Contribution
- Developed the data processing and training pipeline within `final_fixed.ipynb` INFERRED (Source: README.md).
- Implemented data pre-processing, vectorization experiments, model benchmarking, and inference generation VERIFIED (Source: README.md).
