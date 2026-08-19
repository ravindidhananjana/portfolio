---
title: LunarLandingSafetyAnalysis
type: project
classification: PORTFOLIO_PROJECT
last_commit: a7227ee6a48d351e9c705ff87fdbbc9fb8a35b08
---

# Lunar Landing Site Risk Analysis using Computer Vision

## Overview

The **Lunar Landing Site Risk Analysis** system is a computer vision and image processing application designed to evaluate real lunar surface imagery and assess safe landing regions for autonomous lunar landers. Developed using Python, OpenCV, and Streamlit, the system analyzes lunar terrain hazard features—including surface roughness, structural edge density, and shadowed regions—to compute a continuous risk heatmap and classify landing zones into Safe, Moderate, and Unsafe areas.

---

## Key Features & Technology Stack

* **Interactive Web Interface:** Built with Streamlit, providing real-time image uploads, full risk metric breakdowns, overlay visualizations, individual pipeline stage previews, and downloadable decision maps. VERIFIED (Source: `app.py`)
* **Multi-Stage Computer Vision Pipeline:** Integrates classical image preprocessing, edge detection, laplacian roughness calculation, percentile shadow segmentation, and continuous spatial smoothing. VERIFIED (Source: `app.py`, `README.md`)
* **Dynamic Risk Map Fusion:** Combines four hazard metrics using weighted spatial smoothing to generate a normalized continuous terrain risk score. VERIFIED (Source: `app.py`)
* **Automated Landing Verdict:** Computes area coverage percentages for each risk class and categorizes overall landing viability. VERIFIED (Source: `app.py`)
* **Technologies Used:**
  * **Language:** Python VERIFIED (Source: `README.md`)
  * **Libraries:** OpenCV (`opencv-python-headless`), NumPy, Streamlit, Pillow, Matplotlib VERIFIED (Source: `requirements.txt`)

---

## Computer Vision Pipeline & Implementation Details

The processing pipeline implemented in `app.py` consists of six distinct computational stages:

```
[ Input Lunar Image ]
        │
        ▼
1. Image Preprocessing ──► Grayscale conversion, Median Blur (5x5), CLAHE, 3x3 Sharpening, Intensity Normalization
        │
        ├──────────────────────┬──────────────────────┐
        ▼                      ▼                      ▼
2. Edge Detection      3. Roughness Analysis   4. Shadow Detection
   (Canny + Dilation)     (Laplacian Magnitude)   (20th Percentile + Morphology)
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                   5. Continuous Risk Mapping
                   (0.20 Edge + 0.40 Rough + 0.20 Shadow + 0.20 Dark)
                               │
                               ▼
                  6. Classification & Verdict
                   (Thresholds: Safe <0.45, Moderate <0.70, Unsafe >=0.70)
```

### 1. Image Preprocessing
* Converts input BGR images to grayscale. VERIFIED (Source: `app.py`)
* Applies median filtering (`kernel_size=5`) to remove high-frequency noise while preserving terrain edges. VERIFIED (Source: `app.py`)
* Uses Contrast Limited Adaptive Histogram Equalization (CLAHE) with `clipLimit=2.0` and `tileGridSize=(8, 8)` to enhance contrast across varying surface illumination. VERIFIED (Source: `app.py`)
* Sharpens image features using a 3x3 kernel (`[[0, -1, 0], [-1, 5, -1], [0, -1, 0]]`) and normalizes intensity to $[0, 255]$. VERIFIED (Source: `app.py`)

### 2. Edge Detection
* Applies Gaussian blur ($5 \times 5$) and calculates lower and upper Canny thresholds dynamically based on median image intensity ($\text{lower} = 0.8 \times \text{median}$, $\text{upper} = 2.2 \times \text{median}$). VERIFIED (Source: `app.py`)
* Dilates detected edges with a $3 \times 3$ kernel and applies Gaussian smoothing to spread edge risk around detected crater rims and rocks. VERIFIED (Source: `app.py`, `README.md`)

### 3. Surface Roughness Analysis
* Computes local intensity variations by passing a Gaussian-blurred image through a 64-bit float Laplacian operator (`cv2.Laplacian`). VERIFIED (Source: `app.py`)
* Normalizes absolute Laplacian response values to $[0, 255]$ to formulate a surface roughness map. VERIFIED (Source: `app.py`)

### 4. Shadow Detection
* Uses Gaussian blur ($7 \times 7$) and segments dark regions by calculating the 20th percentile intensity threshold of the image. VERIFIED (Source: `app.py`)
* Cleans noise and fills gaps using morphological opening and closing with a $3 \times 3$ kernel. VERIFIED (Source: `app.py`)

### 5. Continuous Risk Map Fusion
* Normalizes edge, roughness, shadow, and deep shadow mask ($< 50$ intensity) features to $[0, 1]$ floating-point maps. VERIFIED (Source: `app.py`)
* Smooths each map with a large Gaussian kernel ($31 \times 31$) to simulate spatial hazard influence around dangerous obstacles. VERIFIED (Source: `app.py`, `README.md`)
* Combines maps using a weighted linear combination:
  $$\text{Risk} = 0.20 \cdot \text{Edge}_{\text{smooth}} + 0.40 \cdot \text{Roughness}_{\text{smooth}} + 0.20 \cdot \text{Shadow}_{\text{smooth}} + 0.20 \cdot \text{Dark}_{\text{smooth}}$$
  VERIFIED (Source: `app.py`)
* Forces extreme shadow pixels ($< 35$ intensity) to maximum risk ($1.0$), applies a final $21 \times 21$ Gaussian blur, and renormalizes to $[0, 1]$. VERIFIED (Source: `app.py`)

### 6. Classification & Decision Rules
* Maps continuous risk values into three discrete classes:
  * **Safe (Green, Class 0):** $\text{Risk} < 0.45$
  * **Moderate (Yellow, Class 1):** $0.45 \le \text{Risk} < 0.70$
  * **Unsafe (Red, Class 2):** $\text{Risk} \ge 0.70$
  VERIFIED (Source: `app.py`)
* Generates a final verdict based on total coverage percentage:
  * If $\text{Unsafe Area} > 40\%$: `"UNSAFE LANDING AREA"`
  * Else if $\text{Safe Area} > 50\%$ AND $\text{Unsafe Area} < 25\%$: `"POSSIBLE SAFE LANDING AREA"`
  * Else: `"MODERATE / NEEDS FURTHER ANALYSIS"`
  VERIFIED (Source: `app.py`)

---

## Dataset

* **Source:** Real lunar surface images collected from NASA / Lunar Reconnaissance Orbiter Camera (LROC) imagery sources. VERIFIED (Source: `README.md`)
* **Volume:** 20 imagery samples evaluated during project development. VERIFIED (Source: `README.md`)
* **Terrain Types Captured:** Craters, deep shadows, rough uneven surfaces, and flat lunar mare regions. VERIFIED (Source: `README.md`)

---

## Key Results & Evaluation

* **Multi-Stage Map Outputs:** The system outputs step-by-step visual feedback (Preprocessed, Edges, Roughness, Shadow, Continuous Risk Map, Classified Map, and Final Decision Map overlay). VERIFIED (Source: `app.py`, `README.md`)
* **Quantitative Landing Breakdown:** Provides exact percentage coverage metrics for safe, moderate, and unsafe landing surfaces per image analysis. VERIFIED (Source: `app.py`)
* **Deployment Readiness:** Interactive web app allows immediate upload and analysis of common image formats (`jpg`, `png`, `bmp`, `tif`) with decision map downloads. VERIFIED (Source: `app.py`)

---

## Author & Project Information

* **Author:** Ravindi Dhananjana VERIFIED (Source: `README.md`)
* **Academic Background:** Undergraduate student pursuing a BSc (Hons) in Computer Science with AI. VERIFIED (Source: `README.md`)
* **Future Work:** Integration of deep learning crater detection models, CNN-based terrain classification, hazard segmentation models, and real-time landing simulation. VERIFIED (Source: `README.md`)
