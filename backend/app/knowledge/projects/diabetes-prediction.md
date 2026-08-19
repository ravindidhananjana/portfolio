---
title: diabetes-prediction
type: project
classification: PORTFOLIO_PROJECT
last_commit: 1d554f26424d7cd19e769bbed02c1e5882bb973f
---

# Diabetes Prediction App

## Executive Summary
The **Diabetes Prediction App** is an end-to-end Machine Learning web application designed to assess the likelihood of diabetes in patients based on key clinical parameters VERIFIED (Source: README.md). Built using Python and Streamlit, the system integrates a pre-trained Random Forest Classifier to process patient measurements and display probability-based predictions via an interactive web interface VERIFIED (Source: README.md, app.py).

---

## Technical Stack & Dependencies

- **Language:** Python 3.9 VERIFIED (Source: README.md)
- **Framework & UI:** Streamlit (`1.25.0`) VERIFIED (Source: requirements.txt, app.py)
- **Machine Learning & Data Science:** `scikit-learn` (`1.7.2`), `xgboost` (`3.0.5`), `pandas` (`2.3.2`), `numpy` (`2.3.3`), `joblib` (`1.5.2`) VERIFIED (Source: requirements.txt)
- **Visualization:** `matplotlib` (`3.10.6`), `seaborn` (`0.13.2`) VERIFIED (Source: requirements.txt)

---

## Dataset & Feature Engineering

- **Dataset Source:** Kaggle Pima Indians Diabetes Dataset VERIFIED (Source: README.md).
- **Target Variable:** `Outcome` (0: Non-diabetic, 1: Diabetic) VERIFIED (Source: README.md).
- **Features Used:**
  1. `Pregnancies`: Number of times pregnant VERIFIED (Source: README.md, app.py)
  2. `Glucose`: Plasma glucose concentration VERIFIED (Source: README.md, app.py)
  3. `BloodPressure`: Diastolic blood pressure VERIFIED (Source: README.md, app.py)
  4. `SkinThickness`: Triceps skin fold thickness VERIFIED (Source: README.md, app.py)
  5. `Insulin`: 2-Hour serum insulin VERIFIED (Source: README.md, app.py)
  6. `BMI`: Body mass index VERIFIED (Source: README.md, app.py)
  7. `DiabetesPedigreeFunction`: Diabetes pedigree function VERIFIED (Source: README.md, app.py)
  8. `Age`: Age in years VERIFIED (Source: README.md, app.py)
- **Data Preprocessing:** Feature scaling applied via `StandardScaler` to handle normalization across differing continuous ranges VERIFIED (Source: README.md).

---

## Model Architecture & Experiments

- **Selected Production Model:** Random Forest Classifier VERIFIED (Source: README.md).
- **Configured Hyperparameters:**
  - `n_estimators`: 200 VERIFIED (Source: README.md)
  - `min_samples_split`: 10 VERIFIED (Source: README.md)
  - `min_samples_leaf`: 1 VERIFIED (Source: README.md)
  - `class_weight`: `'balanced'` VERIFIED (Source: README.md)
- **Model Alternatives Explored:** Logistic Regression, K-Nearest Neighbors (KNN), and XGBoost were experimented with during model selection; Random Forest yielded the optimal production balance VERIFIED (Source: README.md).

---

## Model Evaluation & Performance Results

Evaluated on a held-out test dataset prioritizing healthcare screening relevance:
- **Test Accuracy:** ~75% VERIFIED (Source: README.md)
- **Recall (Diabetic class):** ~73% VERIFIED (Source: README.md)
- **Precision (Diabetic class):** ~65% VERIFIED (Source: README.md)
- **Evaluation Tools:** Confusion Matrix and Classification Report VERIFIED (Source: README.md).

---

## Web Application Implementation

The web interface is implemented in `app.py` using Streamlit:
- Loads the trained pipeline (`rf_model.pkl`) via `joblib` VERIFIED (Source: app.py).
- Constructs input fields for patient clinical indicators with predefined range boundaries and defaults VERIFIED (Source: app.py).
- Processes inputs as a Pandas DataFrame matching target feature names (`FEATURE_NAMES`) VERIFIED (Source: app.py).
- Calculates output class probability using `model.predict_proba()` VERIFIED (Source: app.py).
- Displays visual diagnostic status:
  - **Diabetic:** Highlighted red banner if probability $\ge 0.5$ VERIFIED (Source: app.py).
  - **Non-Diabetic:** Highlighted green banner if probability $< 0.5$ VERIFIED (Source: app.py).

---

## Project Structure

```bash
diabetes-prediction/
│
├─ app.py              # Streamlit web app
├─ rf_model.pkl        # Trained Random Forest model (referenced)
├─ scaler.pkl          # Feature scaler (referenced)
├─ diabetes.ipynb      # Model training & evaluation notebook (referenced)
├─ requirements.txt    # Python dependencies
└─ README.md           # Project documentation
```
VERIFIED (Source: README.md)

---

## Author's Key Contributions & Key Takeaways

- Developed an end-to-end machine learning pipeline from raw dataset preprocessing to interactive app deployment VERIFIED (Source: README.md, app.py).
- Addressed class imbalance using balanced class weighting (`class_weight='balanced'`) during Random Forest classifier training VERIFIED (Source: README.md).
- Implemented real-time prediction capabilities via Streamlit web interface INFERRED (Source: app.py, README.md).
