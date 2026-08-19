---
title: SEO-ML
type: project
classification: PORTFOLIO_PROJECT
last_commit: dcf95143f443ac18f661599b169dd9653e844944
---

# SEO-ML: Applied Search Intelligence & Content Refresh Opportunity Pipeline

## Overview

**SEO-ML** is an end-to-end Machine Learning system and technical framework for search engine optimization (SEO) performance modeling and content refresh prioritization. Developed for the FlyRank ML Internship, the project provides an applied solution for predicting content performance decay (traffic decline) and ranking web pages for editorial review using observable search and engagement metrics.

The repository includes a complete production-grade ML pipeline (`01` through `05`), a deterministic baseline scoring system, a client-holdout validation harness, DuckDB-powered querying over large remote datasets on Hugging Face (~79 million rows), automated PDF/SVG report generation, and automated GitHub Actions CI workflows containing strict data leak guards.

---

## Technical Stack & Dependencies

- **Language:** Python 3.11 / 3.12 `VERIFIED (Source: .github/workflows/smoke-test.yml, .github/workflows/data-path-smoke.yml)`
- **Data Processing & Manipulation:** `pandas`, `numpy`, `duckdb` `VERIFIED (Source: requirements.txt)`
- **Machine Learning:** `scikit-learn` (Logistic Regression, Decision Trees, Random Forests, Pipelines, StandardScalers) `VERIFIED (Source: scripts/03_train_model.py)`
- **Data Fetching & Remote Storage:** `huggingface_hub` (gated dataset streaming via Parquet) `VERIFIED (Source: notebooks/03_working_with_the_full_release.ipynb)`
- **Visualization & Reporting:** `matplotlib`, custom SVG generator, `reportlab` (PDF generation) `VERIFIED (Source: scripts/05_build_pdf_report.py, scripts/ml_utils.py)`
- **CI/CD & Automation:** GitHub Actions (Smoke testing, weekly scheduled workflow, dataset leak prevention) `VERIFIED (Source: .github/workflows/smoke-test.yml)`

---

## Pipeline Architecture & Implementation Details

The system transforms raw pseudonymized search and engagement analytics into a prioritized, actionable queue of pages requiring content refresh.

```
data/raw/content_refresh_anonymized.csv (30,000 rows × 44 columns)
                      │
                      ▼
 01_prepare_features.py ──> Cleans data, handles missing values, builds feature vector (52 cols), defines target
                      │
                      ▼
 02_baseline_score.py   ──> Builds non-leaky deterministic hand-rule score + reason codes
                      │
                      ▼
 03_train_model.py      ──> Trains 3 models (Logistic Regression, Decision Tree, Random Forest) via client-holdout split
                      │
                      ▼
 04_evaluate_and_export.py ──> Blends model proba (70%) + baseline score (30%) → Ranked queue, charts, Markdown
                      │
                      ▼
 05_build_pdf_report.py  ──> Renders executive PDF summary (`outputs/flyrank_refresh_model_results.pdf`)
```
`VERIFIED (Source: GUIDE.md, scripts/run_all.py)`

### 1. Feature Engineering & Preparation (`01_prepare_features.py`)
- **Input Data Filtering:** Filters pages with `impressions_90d > 0` and `content_age_days >= 90` to remove low-activity or brand-new content `VERIFIED (Source: scripts/01_prepare_features.py)`.
- **Target Definition:** Binary label `is_declining_label = (trend_direction == "down")` `VERIFIED (Source: scripts/01_prepare_features.py)`.
- **Feature Transforms:** Applied `log1p` transformation to heavily skewed counts (`log_impressions_90d`, `log_clicks_90d`, `log_sessions_90d`, `log_ai_sessions_90d`), engineered flag variables (`has_clicks`, `has_ai_sessions`, `measurable_opportunity`), and handled systematic missingness across categorical and numerical attributes `VERIFIED (Source: scripts/01_prepare_features.py)`.

### 2. Baseline Heuristic Scoring (`02_baseline_score.py`)
- Provides a transparent, non-learned baseline to beat `VERIFIED (Source: GUIDE.md)`.
- **Score Formula:**
  $$\text{Baseline Score} = 0.40 \cdot \text{Visibility} + 0.30 \cdot \text{FreshnessRisk} + 0.25 \cdot \text{PositionOpportunity} + 0.05 \cdot \text{DepthGap}$$
  `VERIFIED (Source: scripts/02_baseline_score.py)`
- Attaches heuristic reason codes (e.g., `stale_visible_page`, `declining_with_demand`, `thin_visible_page`, `page_one_decay_risk`) `VERIFIED (Source: scripts/02_baseline_score.py)`.

### 3. Model Training & Client-Holdout Validation (`03_train_model.py`)
- **Group-Aware Splitting:** Implements a client-holdout split (`make_client_aware_split`) holding out ~20% of clients to prevent data leakage between pages of the same client in training and testing sets `VERIFIED (Source: scripts/03_train_model.py, GUIDE.md)`.
- **Models Evaluated:**
  1. `LogisticRegression` with `StandardScaler` and balanced class weights `VERIFIED (Source: scripts/03_train_model.py)`.
  2. `DecisionTreeClassifier` (`max_depth=5`, `min_samples_leaf=50`) `VERIFIED (Source: scripts/03_train_model.py)`.
  3. `RandomForestClassifier` (`n_estimators=200`, `max_depth=10`, `min_samples_leaf=25`) `VERIFIED (Source: scripts/03_train_model.py)`.

### 4. Hybrid Blending & Recommendation Queuing (`04_evaluate_and_export.py`)
- **Ensemble Score:** Combines machine learning probability predictions with the normalized rule baseline score:
  $$\text{Final Refresh Score} = 100 \times (0.70 \cdot P(\text{decline}) + 0.30 \cdot \text{Normalized Baseline Score})$$
  `VERIFIED (Source: scripts/04_evaluate_and_export.py, docs/ml-intern-dataset-and-lane-guide.md)`
- Categorizes confidence levels (`high`, `medium`, `low`) and assigns actionable editor instructions (`refresh`, `refresh_and_review_ctr`, `refresh_and_review_engagement`, `expand_and_refresh`, `monitor`) `VERIFIED (Source: scripts/04_evaluate_and_export.py)`.

### 5. Large-Scale Data Handling via DuckDB (`notebooks/03_working_with_the_full_release.ipynb`)
- Enables memory-efficient analytical queries over ~79 million hosted daily performance records (`FlyRank/internship-warehouse` on Hugging Face) using SQL streaming over Parquet without requiring full local downloads `VERIFIED (Source: notebooks/03_working_with_the_full_release.ipynb, docs/ml-intern-dataset-and-lane-guide.md)`.

---

## Datasets & Data Governance

### Datasets Analyzed
1. **Bundled Starter Dataset (`data/raw/content_refresh_anonymized.csv`):**
   - 30,000 pseudonymized web pages across 32 clients `VERIFIED (Source: docs/data-dictionary.md)`.
   - 44 raw columns covering Google Search Console (impressions, clicks, average position), Google Analytics 4 (sessions, engaged sessions, AI-referred sessions, scroll events), metadata (word count, content age, updates), and derived rate metrics `VERIFIED (Source: docs/data-dictionary.md)`.
2. **Full Warehouse Release (`FlyRank/internship-warehouse`):**
   - `dim_clients` (104 rows) `VERIFIED (Source: docs/ml-intern-dataset-and-lane-guide.md)`
   - `dim_content` (519,606 rows) `VERIFIED (Source: docs/ml-intern-dataset-and-lane-guide.md)`
   - `fact_content_daily_performance` (78,835,655 rows daily performance) `VERIFIED (Source: docs/ml-intern-dataset-and-lane-guide.md)`
   - `fact_content_query_90d` (2,414,248 rows query context) `VERIFIED (Source: docs/ml-intern-dataset-and-lane-guide.md)`

### Data Privacy & Leakage Guarding
- **Privacy Rules:** The dataset strictly contains no raw client names, domains, URLs, titles, or raw search queries. All identifiers (`content_id`, `client_id`) are cryptographic pseudonyms `VERIFIED (Source: DATA_USE.md)`.
- **Target Leakage Prevention:** Label-source fields (`trend_direction`, `trend_pct`) are explicitly excluded from model features `VERIFIED (Source: GUIDE.md, notebooks/02_your_first_readable_model.ipynb)`.
- **Automated CI Leak Check:** GitHub Actions workflow fails if dataset archives (`.parquet`, `.zip`, `.feather`) or unapproved `.csv` files are committed to git `VERIFIED (Source: .github/workflows/smoke-test.yml)`.

---

## Experimental Evaluation & Results

The models were evaluated against the target label `is_declining_label` on a holdout evaluation set.

### Model Performance Benchmark

| Model | ROC AUC | Avg Precision | Precision@50 | Recall | F1 Score |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Baseline Rules** | 0.627 | 0.468 | 0.240 | — | — |
| **Logistic Regression** | 0.700 | 0.522 | 0.400 | 0.567 | 0.566 |
| **Decision Tree** | 0.742 | 0.575 | 0.540 | 0.716 | 0.634 |
| **Random Forest (Best)** | **0.750** | **0.618** | **0.740** | **0.744** | **0.640** |

`VERIFIED (Source: outputs/model_report.md)`

### Key Findings
- **3x Lift in Precision@50:** The Random Forest achieved a Precision@50 of **0.740** compared to the baseline rule's **0.240**, meaning 37 out of the top 50 flagged pages were confirmed declining pages (versus 12 for the baseline rule) `VERIFIED (Source: outputs/model_report.md, docs/ml-intern-dataset-and-lane-guide.md)`.
- **Top Feature Drivers:**
  1. `days_with_impressions` (Importance: 0.1578) `VERIFIED (Source: outputs/model_report.md)`
  2. `log_impressions_90d` (Importance: 0.1282) `VERIFIED (Source: outputs/model_report.md)`
  3. `avg_position` (Importance: 0.1090) `VERIFIED (Source: outputs/model_report.md)`
  4. `content_age_days` (Importance: 0.0955) `VERIFIED (Source: outputs/model_report.md)`
  5. `char_count` (Importance: 0.0426) `VERIFIED (Source: outputs/model_report.md)`
  6. `word_count` (Importance: 0.0397) `VERIFIED (Source: outputs/model_report.md)`

---

## Key Technical Best Practices Demonstrated

1. **Client-Holdout Cross-Validation:** Avoiding row-level random splits when data contains multiple rows per client, preventing client memorization `VERIFIED (Source: scripts/03_train_model.py, GUIDE.md)`.
2. **Explicit Target Leakage Guarding:** Demonstrated that including target-derived metrics (`trend_pct`) inflates accuracy artificially while destroying generalization `VERIFIED (Source: notebooks/02_your_first_readable_model.ipynb)`.
3. **Out-of-Core Analytical Querying:** Leveraging DuckDB over Hugging Face Parquet streams to query 79M+ records in under 100MB of RAM `VERIFIED (Source: notebooks/03_working_with_the_full_release.ipynb)`.
4. **End-to-End Execution Pipeline:** Automated pipeline executable in under 1 minute (`python scripts/run_all.py`), producing reproducible outputs, SVG visualizations, Markdown reports, and PDF documents `VERIFIED (Source: GUIDE.md, scripts/run_all.py)`.

---

## Repository Structure

```text
.
├── .github/workflows/         # CI/CD: Pipeline smoke test & data leak checker
├── data/
│   ├── raw/                   # Anonymized starter dataset (30,000 rows × 44 columns)
│   └── processed/             # Feature vector and baseline queue (gitignored)
├── docs/                      # Core foundation framework, data dictionary, lane guides
├── notebooks/
│   ├── 01_first_look_and_discovery.ipynb
│   ├── 02_your_first_readable_model.ipynb
│   └── 03_working_with_the_full_release.ipynb
├── outputs/                   # Generated reports, charts (SVG), and final PDF output
├── scripts/
│   ├── 01_prepare_features.py
│   ├── 02_baseline_score.py
│   ├── 03_train_model.py
│   ├── 04_evaluate_and_export.py
│   ├── 05_build_pdf_report.py
│   ├── ml_utils.py
│   └── run_all.py             # Orchestrates the complete pipeline execution
├── work/                      # Sandbox space for user capstone work and custom models
├── DATA_USE.md                # Public safety & data governance rules
├── GUIDE.md                   # System operation guide
└── requirements.txt           # Dependency definition
```
`VERIFIED (Source: GUIDE.md, README.md)`
