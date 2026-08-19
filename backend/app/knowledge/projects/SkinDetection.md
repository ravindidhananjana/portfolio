---
title: SkinDetection
type: project
classification: PORTFOLIO_PROJECT
last_commit: fa766fe549a284bae1c061a362a920b2889048ad
---

# Skin Color Detection Using Chromaticity

## Project Overview

The **SkinDetection** repository implements a computer vision pipeline for detecting skin regions in images using chromaticity-space statistics and probabilistic thresholding. Built in Python using OpenCV and NumPy, the project models skin color distribution using normalized red and green chromaticity components `(r, g)` and applies Mahalanobis distance to classify pixels in unseen test images VERIFIED (Source: README.md).

## Tech Stack & Requirements

- **Primary Language**: Jupyter Notebook / Python VERIFIED (Source: README.md)
- **Dependencies**:
  - Python 3.8+ VERIFIED (Source: README.md)
  - OpenCV (`cv2`) VERIFIED (Source: README.md)
  - NumPy VERIFIED (Source: README.md)
  - Matplotlib VERIFIED (Source: README.md)

## Repository Structure

- `final.ipynb`: Notebook containing the workflow for ROI selection, color conversion, model fitting, and skin detection evaluation VERIFIED (Source: README.md).
- `Images/train/`: Directory containing training images used for interactive ROI selection VERIFIED (Source: README.md).
- `Images/test/`: Directory containing test images for evaluating skin segmentation VERIFIED (Source: README.md).
- `all_skin_pixels.npy`: Pre-saved 2D NumPy array containing extracted skin chromaticity coordinates `(r, g)` for reproducibility VERIFIED (Source: README.md).

## Algorithm & Implementation Details

### 1. Chromaticity Conversion
To reduce sensitivity to illumination intensity variations, RGB pixels are converted to normalized chromaticity space VERIFIED (Source: README.md):
$$r = \frac{R}{R + G + B}$$
$$g = \frac{G}{R + G + B}$$

### 2. ROI Sampling & Feature Extraction
- Users manually select skin regions in training images using `cv2.selectROI` VERIFIED (Source: README.md).
- Extracted ROI pixels are transformed to chromaticity space and flattened into `all_skin_pixels` VERIFIED (Source: README.md).

### 3. Outlier Filtering
- Filtering removes noise by retaining pixels within valid chromaticity bounds VERIFIED (Source: README.md):
  - $0.3 \le r \le 0.6$ VERIFIED (Source: README.md)
  - $0.2 \le g \le 0.5$ VERIFIED (Source: README.md)

### 4. Statistical Modeling
- **Mean Vector (`mean_skin`)**: Mean chromaticity vector of skin pixels VERIFIED (Source: README.md).
- **Covariance Matrix (`cov_skin`)**: Covariance matrix representing variance and correlation across $r$ and $g$ components VERIFIED (Source: README.md).
- **Inverse Covariance (`inv_cov_skin`)**: Computed for Mahalanobis distance evaluation VERIFIED (Source: README.md).

### 5. Detection & Thresholding
- For each test image pixel, the Mahalanobis distance to the skin distribution is calculated VERIFIED (Source: README.md).
- Pixels with a Mahalanobis distance below a specified threshold (e.g., 2.0) are classified as skin VERIFIED (Source: README.md).

### 6. Visualization Output
The system generates inline visualizations comparing VERIFIED (Source: README.md):
- Original image VERIFIED (Source: README.md)
- Binary detected skin mask VERIFIED (Source: README.md)
- Skin-only extracted image VERIFIED (Source: README.md)
- Non-skin masked background image VERIFIED (Source: README.md)

## Dataset & Evaluation

- **Dataset**: Custom image dataset structured in `Images/train/` and `Images/test/` supporting `.jpg`, `.jpeg`, and `.png` image formats VERIFIED (Source: README.md).
- **Evaluation Metrics**: Quantitative evaluation metrics (such as Precision, Recall, or IoU) are UNKNOWN (Source: README.md does not specify quantitative metrics). Results are evaluated visually via inline Matplotlib plots VERIFIED (Source: README.md).

## Customization & Troubleshooting

- **Hyperparameter Tuning**: Precision and recall can be adjusted by tuning the Mahalanobis distance `threshold` in `detect_skin()` or modifying chromaticity bounding boxes VERIFIED (Source: README.md).
- **Singular Covariance Handling**: If `cov_skin` becomes singular during execution, diagonal regularization (adding a small $\epsilon$ to the diagonal) or adding more training ROI samples resolves the issue VERIFIED (Source: README.md).
- **GUI Handling**: Calling `cv2.destroyAllWindows()` handles unclosed ROI selector windows during interactive labeling VERIFIED (Source: README.md).
