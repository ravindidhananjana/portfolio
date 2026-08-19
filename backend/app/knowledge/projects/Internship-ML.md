---
title: Internship-ML
type: project
classification: PORTFOLIO_PROJECT
last_commit: c2c042b11450bf10d70a1b50178a56abddd3f5fc
---

# Internship-ML: Applied Search Intelligence & Content Decay Prediction

## Executive Summary
The **Internship-ML** repository contains a complete applied machine learning project developed during the **FlyRank ML Internship 2026**. The project addresses the problem of predicting organic search traffic decay (impression and click drops) across large multi-client website portfolios to enable editorial teams to prioritize high-risk URLs for manual content refreshes `[VERIFIED: README.md, work/notebooks/capstone.ipynb]`.

Using both a 30,000-row anonymized starter dataset and a Hugging Face-hosted warehouse dataset containing over 78.8 million daily performance records across 104 client domains, the project designs a complete ML workflow: problem framing, data contract definition, signal auditing, rule-based baseline construction, tree-based classifier training, group-based cross-validation, and action playbook generation `[VERIFIED: README.md, GUIDE.md, work/notebooks/capstone.ipynb]`.

---

## Project Context & Problem Statement
- **Domain:** Applied Search Intelligence / Organic Search Performance (Google Search Console & Google Analytics 4) `[VERIFIED: README.md, docs/data-dictionary.md]`.
- **Target Audience:** Content publishers, SEO strategists, and editorial teams managing thousands of URLs `[VERIFIED: work/notebooks/w01_research_question.ipynb, work/notebooks/w07_action_playbook.ipynb]`.
- **Core Decision Supported:** Determining which declining or stale content items to review and refresh first, given limited editorial capacity (e.g., 5–10 pages per week) `[VERIFIED: work/notebooks/w01_research_question.ipynb, work/notebooks/capstone.ipynb]`.
- **Cost of Incorrect Predictions:** 
  - *False Positives:* Wasted editorial resources (2–4 hours per page) re-optimizing healthy content `[VERIFIED: work/notebooks/w01_research_question.ipynb]`.
  - *False Negatives:* Unnoticed organic traffic decay leading to ongoing impression loss, click degradation, and revenue decline `[VERIFIED: work/notebooks/w01_research_question.ipynb]`.

---

## Data Architecture & Pipeline

### Datasets Analyzed
1. **Anonymized Starter Playground Dataset (`data/raw/content_refresh_anonymized.csv`):**
   - 30,000 anonymized pages × 44 columns across 32 pseudonymized client domains `[VERIFIED: docs/data-dictionary.md]`.
   - Aggregated 90-day search and engagement metrics, derived comparison windows (prior 30d vs. recent 30d), and freshness tiers `[VERIFIED: docs/data-dictionary.md]`.
2. **Full Warehouse Dataset (`FlyRank/internship-warehouse` on Hugging Face):**
   - Queryable via DuckDB SQL over remote Parquet files without downloading `[VERIFIED: GUIDE.md, work/notebooks/capstone.ipynb]`.
   - Contains 78,835,655 daily fact rows (`fact_content_daily_performance`), 519,606 content dimension rows (`dim_content`), 104 client dimension rows (`dim_clients`), and 2,414,248 90-day query dynamics rows (`fact_content_query_90d`) `[VERIFIED: docs/ml-intern-dataset-and-lane-guide.md]`.
   - Primary analysis window: Mid-panel month of March 2026, comprising ~120,513 distinct URLs across 41 client domains `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w03_data_contract.ipynb]`.

### Data Preprocessing & Leakage Safeguards
- **Privacy & Anonymization:** Raw client names, URLs, page titles, search queries, and domains were pseudonymized using 128-bit hashes (`client_hash_id`, `content_hash_id`, `keyword_hash_id`) prior to release `[VERIFIED: DATA_USE.md, docs/ml-intern-dataset-and-lane-guide.md]`.
- **Label Leakage Audit:** Direct derived metrics such as `trend_pct` and `trend_direction` were explicitly excluded from model inputs, as they encode the exact calculation of the target label `[VERIFIED: notebooks/02_your_first_readable_model.ipynb, work/notebooks/w03_feature_leakage_check.ipynb]`.
- **Feature Engineering:** Features were engineered strictly from a historical window prior to the decision point (March 1–15, 2026) to predict outcomes in the subsequent 15-day window (March 16–31, 2026) `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w03_data_contract.ipynb]`:
  - `imp_prev15`: Historical 15-day impression volume `[VERIFIED: work/notebooks/capstone.ipynb]`.
  - `pos_avg_prev`: Historical 15-day average position rank `[VERIFIED: work/notebooks/capstone.ipynb]`.
  - `pos_std_prev`: Standard deviation of daily position ranks (search rank volatility) `[VERIFIED: work/notebooks/capstone.ipynb]`.
  - `visible_queries`: Total distinct search queries driving traffic `[VERIFIED: work/notebooks/capstone.ipynb]`.
  - `top_query_share`: Impression concentration ratio of the top query `[VERIFIED: work/notebooks/capstone.ipynb]`.

---

## Machine Learning Methodology

### Target Definition
- **Binary Classification Target (`is_declining`):** Defined as an organic search impression drop $\ge 20\%$ in the evaluation window relative to the historical observation window (`imp_last15 < 0.8 * imp_prev15`) `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w03_feature_leakage_check.ipynb]`.

### Baseline Heuristic Rules
To evaluate model value, a transparent hand-written rule baseline was implemented `[VERIFIED: scripts/02_baseline_score.py, work/notebooks/w04_baseline_score.ipynb]`:
- **Rules:** Flagged content exhibiting position drops $\ge 2.0$ (`ERR_POS_DROP`), impression drops $> 20\%$ (`ERR_IMP_SLUMP`), or rank volatility (`pos_std_prev > 3.0`) `[VERIFIED: work/notebooks/w04_baseline_score.ipynb, work/notebooks/w07_action_playbook.ipynb]`.

### Models Evaluated
1. **Logistic Regression:** Scaled linear baseline `[VERIFIED: scripts/03_train_model.py]`.
2. **Decision Tree Classifier:** Interpretable shallow tree (depth=2 to 5) `[VERIFIED: notebooks/02_your_first_readable_model.ipynb, scripts/03_train_model.py]`.
3. **Random Forest Classifier:** Ensembled decision trees (`n_estimators=100`, `max_depth=8-10`, `class_weight='balanced'`) to capture non-linear feature interactions `[VERIFIED: scripts/03_train_model.py, work/notebooks/capstone.ipynb]`.

### Cross-Validation Strategy
- **Grouped Split (`GroupShuffleSplit` on `client_hash_id`):** 75% train / 25% test split grouped by client domain `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w06_validation_audit.ipynb]`.
- **Methodology Rationale:** Prevents domain authority and site-level traffic distributions from leaking between training and test sets, measuring performance on completely unseen client websites `[VERIFIED: work/notebooks/w06_validation_audit.ipynb, work/notebooks/capstone.ipynb]`.

---

## Key Results & Evaluation

### 1. Starter Pipeline Results (`scripts/01–05` on `content_refresh_anonymized.csv`)
*Evaluated using client-holdout validation on 30,000 rows `[VERIFIED: outputs/model_report.md]`:*

| Model / Baseline | ROC AUC | Avg Precision | Precision@50 | Recall | F1-Score |
|---|---:|---:|---:|---:|---:|
| **Baseline Rules** | 0.627 | 0.468 | 0.240 | — | — |
| **Logistic Regression** | 0.700 | 0.522 | 0.400 | 0.567 | 0.566 |
| **Decision Tree** | 0.742 | 0.575 | 0.540 | 0.716 | 0.634 |
| **Random Forest (Best)** | **0.750** | **0.618** | **0.740** | **0.744** | **0.640** |

*Key Outcome:* The Random Forest model achieved a **~3x lift in Precision@50** (0.740 vs. 0.240) over the rule-based baseline `[VERIFIED: outputs/model_report.md, GUIDE.md]`.

### 2. Capstone Warehouse Results (March 2026 Dataset, 120,513 URLs across 41 Client Domains)
*Evaluated on unseen client domains via `GroupShuffleSplit` `[VERIFIED: work/notebooks/capstone.ipynb]`:*

| Metric | Heuristic Rule Baseline | Random Forest Model | Performance Delta |
|---|---:|---:|---|
| **Accuracy** | 0.6214 | **0.7842** | +16.28% |
| **Precision** | 0.5012 | **0.5561** | +5.49% |
| **Recall** | 0.2410 | **0.6823** | **+44.13% (2.8x lift)** |
| **F1-Score** | 0.3254 | **0.6128** | +28.74% |

*Feature Importance Ranking (Permutation / Gini):* `visible_queries` (0.2939), `imp_prev15` (0.2699), `top_query_share` (0.1915), `pos_avg_prev` (0.1244), `pos_std_prev` (0.1203) `[VERIFIED: work/notebooks/capstone.ipynb]`.

### 3. Leakage & Split Audit Findings
- **Naive vs. Honest Split Comparison:** A random row-level train/test split yielded artificially inflated metrics (Accuracy 0.7191, Precision 0.5781) compared to the honest client-grouped split (Accuracy 0.6804, Precision 0.3910) `[VERIFIED: work/notebooks/w06_validation_audit.ipynb]`. This proved that random splits suffer from cross-domain data leakage.
- **Leaked Feature Trap:** Introducing a future outcome signal (`imp_last15`) into the feature set trivially inflated accuracy to 1.0000, confirming the necessity of strict temporal isolation `[VERIFIED: work/notebooks/w03_data_contract.ipynb, work/notebooks/w03_feature_leakage_check.ipynb]`.

---

## Action Playbook & Operationalization

Model outputs were converted into a human-in-the-loop content refresh queue with transparent reason codes `[VERIFIED: work/notebooks/w07_action_playbook.ipynb, outputs/model_report.md]`:

1. **`URGENT_REFRESH` (Priority 1):** High-traffic URLs ($imp \ge 100$) experiencing concurrent position drops ($\ge 2.0$) and impression slumps ($> 20\%$) `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w07_action_playbook.ipynb]`.
2. **`MONITOR_VOLATILITY` (Priority 2):** Pages with high rank variance (`pos_std_prev > 3.0`) tracked for search intent shifts prior to heavy rewriting `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w07_action_playbook.ipynb]`.
3. **`PRUNE_OR_CONSOLIDATE` (Priority 3):** Low-volume decaying pages ($imp < 50$) recommended for consolidation or 301 redirects `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w07_action_playbook.ipynb]`.

### No-Go Automation Boundaries
- 🚫 **No Automated AI Overwrites:** LLM text generators must never replace live content programmatically without human editorial review `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w07_action_playbook.ipynb]`.
- 🚫 **No Automated URL Deletions / Redirects:** Page pruning and 301 redirects must not be automated without manual SEO approval `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w07_action_playbook.ipynb]`.

---

## Public-Safety & Claim Discipline

All research claims in the repository strictly adhere to the following claim ladder `[VERIFIED: DATA_USE.md, skills/writing-honest-claims/SKILL.md, work/notebooks/capstone.ipynb]`:
- **Allowed Terminology:** *Observed*, *measured*, *directional*, *decision-support* `[VERIFIED: DATA_USE.md, work/notebooks/w01_research_question.ipynb]`.
- **Prohibited Claims:** No claims of causal proof, no claims of predicting search engine algorithms, and no disclosure of private client details, URLs, or search queries `[VERIFIED: DATA_USE.md, work/notebooks/w01_research_question.ipynb, work/notebooks/capstone.ipynb]`.

---

## Repository Structure

```text
├── .github/workflows/       # CI workflows (data-path-smoke, personalize, smoke-test dataset leak checks)
├── data/
│   └── raw/
│       └── content_refresh_anonymized.csv  # 30k anonymized starter slice
├── docs/                     # Data dictionary, framework, tooling & dataset guides
├── notebooks/                # Week 1-2 guided first-win notebooks (01, 02, 03)
├── outputs/                  # Committed reference reports, metrics JSONs, SVG charts, PDF summary
├── scripts/                  # 5-stage reference ML pipeline (01_prepare..05_build_pdf) + ml_utils.py
├── skills/                   # Modular instruction library for AI assistants
├── submission/
│   └── paper_url.txt         # Placeholder/entry for deployed GitHub Pages research paper URL
└── work/
    ├── notebooks/            # User implementation notebooks (w01..w07, capstone.ipynb)
    └── outputs/              # Exported action queues and baseline scores
```

---

## Author Contribution Summary
- **Author:** Ravindi Dhananjana `[VERIFIED: URL metadata, Colab badges in notebooks]`.
- **Contributions Completed:**
  - Completed all 8 weekly assignment notebooks (`w01_research_question` through `w07_action_playbook` and `capstone.ipynb`) in `work/notebooks/` `[VERIFIED: work/notebooks/*.ipynb]`.
  - Implemented DuckDB remote Parquet queries connecting to Hugging Face dataset endpoints `[VERIFIED: work/notebooks/w03_data_contract.ipynb, work/notebooks/capstone.ipynb]`.
  - Conducted signal audits, leakage tests, and naive vs. grouped cross-validation experiments `[VERIFIED: work/notebooks/w03_feature_leakage_check.ipynb, work/notebooks/w06_validation_audit.ipynb]`.
  - Constructed the capstone machine learning pipeline and action playbook `[VERIFIED: work/notebooks/capstone.ipynb, work/notebooks/w07_action_playbook.ipynb]`.
