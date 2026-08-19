---
title: weather-ml
type: project
classification: PORTFOLIO_PROJECT
last_commit: 6a93af7e3bf1f2c3d8a3f3ff30d943ba5c3f387d
---

# Weather-ML: 7-Day Temperature Forecasting System

## Executive Summary

**Weather-ML** is a full-stack, time-series machine learning web application that provides a 7-day daily average temperature forecast for Kandy, Sri Lanka VERIFIED (Source: backend/data/fetch_weather.py, frontend/src/App.js). The platform integrates real-time hourly weather data collection from the Open-Meteo API, database storage with MongoDB Atlas, a FastAPI REST service executing machine learning inference, and an interactive glassmorphic React 19 dashboard VERIFIED (Source: README.md, backend/main.py, frontend/src/App.js).

---

## Technical Stack

| Component | Technologies Used |
| :--- | :--- |
| **Backend Framework** | FastAPI, Uvicorn VERIFIED (Source: backend/requirements.txt) |
| **Machine Learning & Data Processing** | Scikit-Learn, Pandas, NumPy, Joblib VERIFIED (Source: backend/requirements.txt) |
| **Database** | MongoDB Atlas, PyMongo VERIFIED (Source: README.md, backend/db/mongo_loader.py) |
| **Data Ingestion** | Open-Meteo API via Python `requests` VERIFIED (Source: backend/data/fetch_weather.py) |
| **Frontend Framework** | React 19, Recharts VERIFIED (Source: frontend/package.json) |
| **Dev Tooling** | `concurrently`, Python Virtual Environment VERIFIED (Source: package.json) |

---

## Architecture & Implementation Details

```
                                +-----------------------+
                                |    Open-Meteo API     |
                                +-----------+-----------+
                                            |
                                            v
+------------------+           +------------+------------+           +------------------+
| MongoDB Atlas    | <=======> | Data Ingestion Engine   | --------> | Feature Engine   |
| (weather_db.py)  |  Upsert   | (fetch_weather.py)      |  Fallback | (hourly_to_daily)|
+------------------+           +------------+------------+           +--------+---------+
         |                                                                    |
         +-----------------------------> + -----------------------------------+
                                         |
                                         v
                                +--------+---------+
                                | FastAPI Backend  |
                                | (main.py)        |
                                +--------+---------+
                                         |
                                 ML Model Inference
                              (7day_temp_model.pkl)
                                         |
                                         v
                                +--------+---------+
                                | React 19 UI      |
                                | Dashboard        |
                                +------------------+
```

### Key Components

1. **Data Ingestion & Storage (`backend/data/`)**:
   - Fetches hourly data for 6 weather features: `temperature_2m`, `relative_humidity_2m`, `pressure_msl`, `windspeed_10m`, `cloudcover`, and `rain` for coordinates latitude `7.284440`, longitude `80.637466` (Kandy, Sri Lanka) VERIFIED (Source: backend/data/fetch_weather.py, frontend/src/App.js).
   - `weather_db.py` uses PyMongo `bulk_write` with `UpdateOne(..., upsert=True)` to prevent gaps or duplicate temporal entries VERIFIED (Source: backend/data/weather_db.py).

2. **FastAPI Backend & Inference API (`backend/main.py`)**:
   - Exposes `GET /predict` endpoint to compute daily forecasts for the next 7 days starting from the current date VERIFIED (Source: backend/main.py).
   - Aggregates hourly weather data into daily averages (`hourly_to_daily`) using daily resampling VERIFIED (Source: backend/main.py).
   - Generates lag features (`temp_lag_1` to `temp_lag_14`), rolling averages (`temp_roll_7`, `temp_roll_14`), and calendar metadata (`day_of_year`, `month`, `week_of_year`) VERIFIED (Source: backend/main.py).
   - Loads a pre-trained serialized scikit-learn model (`7day_temp_model.pkl`) using Joblib to run multi-step output predictions VERIFIED (Source: backend/main.py).

3. **Frontend Dashboard (`frontend/src/App.js`)**:
   - Built with React 19 and custom Glassmorphism CSS VERIFIED (Source: README.md, frontend/package.json).
   - Visualizes temperature trends via Recharts with interactive toggles between "Gradient Area View" and "Smooth Line View" VERIFIED (Source: frontend/src/App.js).
   - Features dynamic weather condition labeling (e.g., Warm, Mild, Cool, Chilly with responsive emojis) based on predicted daily temperatures VERIFIED (Source: frontend/src/App.js).
   - Calculates weekly summary statistics (Weekly Average, Peak Temp, Lowest Temp) VERIFIED (Source: frontend/src/App.js).

---

## Machine Learning Pipeline & Data Preprocessing

### Feature Engineering
The model transforms hourly raw weather data into aggregated daily time-series features VERIFIED (Source: backend/main.py):

* **Aggregated Physical Features**:
  - `temperature_2m` (Daily Mean)
  - `relative_humidity_2m` (Daily Mean)
  - `pressure_msl` (Daily Mean)
  - `windspeed_10m` (Daily Mean)
  - `cloudcover` (Daily Mean)
  - `rain` (Daily Sum)
* **Lag Features**: `temp_lag_1`, `temp_lag_2`, `temp_lag_3`, `temp_lag_7`, `temp_lag_14`
* **Rolling Statistics**: `temp_roll_7` (7-day mean), `temp_roll_14` (14-day mean)
* **Calendar Features**: `day_of_year`, `month`, `week_of_year`

### Forecasting Model
* **Model Serialization**: `7day_temp_model.pkl` loaded via Joblib VERIFIED (Source: backend/main.py).
* **Model Type**: Random Forest / XGBoost Regressor model trained for multi-step daily temperature forecasting VERIFIED (Source: README.md, frontend/src/App.js).
* **Inference Pipeline**: The model accepts the latest calculated feature vector derived from historical daily data and outputs a 7-day daily mean temperature array VERIFIED (Source: backend/main.py).

---

## Key Technical Solutions & Resilience

1. **Automatic Database Failover & Fallback Mechanism**:
   - The application attempts to fetch up to 40 days of historical hourly records from MongoDB Atlas VERIFIED (Source: backend/main.py).
   - If MongoDB Atlas is unreachable (e.g., DNS resolution failure or network timeout) or contains fewer than 480 hourly records (20 days), the API gracefully falls back to querying live data directly from the Open-Meteo REST API VERIFIED (Source: backend/main.py).

2. **Gap-Proof Bulk Ingestion**:
   - DB upsert script (`weather_db.py`) uses MongoDB bulk operations with `time` keys as unique identifiers, guaranteeing data continuity across automated runs without duplicate record accumulation VERIFIED (Source: backend/data/weather_db.py).

---

## Datasets & Evaluation Results

* **Dataset Source**: Open-Meteo API historical weather records for geographic coordinates `(7.284440, 80.637466)` VERIFIED (Source: backend/data/fetch_weather.py).
* **Evaluation Metrics**: Specific metric scores (e.g., RMSE, MAE) are UNKNOWN as the model training notebook (`backend/notebooks/trainingModel.ipynb`) file contents were not included in the repository snapshot.

---

## Repository Structure Overview

```
weather-ml/
├── backend/
│   ├── data/
│   │   ├── fetch_weather.py      # Open-Meteo API fetcher
│   │   └── weather_db.py         # MongoDB bulk upsert script
│   ├── db/
│   │   └── mongo_loader.py       # PyMongo DataFrame loader
│   ├── models/
│   │   └── 7day_temp_model.pkl   # Serialized ML model
│   ├── notebooks/
│   │   └── trainingModel.ipynb   # Jupyter model exploration notebook
│   ├── config.py                 # Environment variables loader
│   └── main.py                   # FastAPI REST server & prediction router
├── frontend/
│   └── src/
│       ├── App.js                # React UI with Recharts analytics
│       └── App.css               # Glassmorphic UI styles
├── package.json                  # Root runner script (concurrently)
└── requirements.txt              # Python dependency list
