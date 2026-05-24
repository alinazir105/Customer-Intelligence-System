# Customer Intelligence System

Production-style churn prediction and customer segmentation for a telecommunications company. Supervised churn scoring with threshold tuning, unsupervised K-Means segmentation, churn risk analysis per customer segment, and a FastAPI backend with a React (Vite) frontend.

## Live demo

| Component | URL |
|-----------|-----|
| Frontend | https://customer-intelligence-system-psi.vercel.app |
| API | https://customer-intelligence-system-umd0.onrender.com |

---

## Overview

The system turns notebook-trained models into a deployable stack that produces three outputs per customer:

- **Churn probability** — calibrated score from the final Logistic Regression pipeline.
- **Risk band** — Low / Medium / High using the saved tuned threshold plus a 0.75 cutoff for High.
- **Segment** — K-Means cluster id and human-readable label.

Additional capabilities:
- **Single customer**: JSON `POST /predict` with snake_case fields.
- **Bulk upload**: `POST /bulk-predict` accepts CSV or Excel; responses sorted by priority score and include suggested actions and rule-based risk drivers per row.
- **Churn risk by segment**: mean and median churn probability aggregated per cluster, bridging the prediction and segmentation components.

Goal: demonstrate an end-to-end ML lifecycle from raw data and notebooks to API and UI.

---

## Notebook walkthrough

The analysis notebook (`notebooks/`) follows this structure:

### 1. Business problem and dataset
Binary classification for churn prediction (target: `Churn Value`) and unsupervised segmentation. Dataset: 7,043 California telco customers, 33 variables, Q3. Churn rate: 26.54% — class-imbalanced.

### 2. EDA
- Churn rates by every categorical feature (bar charts).
- Box plots of numeric features (`Tenure Months`, `Monthly Charges`, `Total Charges`) against churn.
- Correlation matrix across all features.
- Key finding: Contract type, Internet Service, Payment Method, and Tenure are the strongest predictors.

### 3. Model building

**Preprocessing pipeline** (ColumnTransformer, no leakage):
- Continuous numerics → `StandardScaler`
- Binary numerics → passthrough
- Categorical → `OneHotEncoder(drop='first')`

**Baseline**: Logistic Regression, default threshold=0.5, no class balancing. Recall ~0.55 for churners — majority-class bias confirmed.

**Feature engineering**:
- `log_tenure = log1p(Tenure Months)` — linearizes the nonlinear early-stage churn spike. ROC-AUC: 0.847 → 0.854.
- Early-tenure flags (`tenure_le_6`, `tenure_le_12`) were trialled and rejected — redundant with `log_tenure`, minimal recall improvement.
- `Total Charges` removed — linear function of `Monthly Charges × Tenure Months` (multicollinearity).

**Class imbalance**: handled via `class_weight='balanced'` — preferred over SMOTE given the mixed numeric/categorical feature space where interpolation is not meaningful.

**Threshold tuning**: validation sweep from 0.05 to 0.95; best threshold selected by maximising recall subject to precision ≥ 0.40. Optimal threshold: **0.20**.

### 4. Model selection

Three models compared (all with balanced weights and threshold tuning):

| Model | ROC-AUC | Recall (churn) | Precision | F1 | Threshold |
|-------|---------|----------------|-----------|----|-----------|
| Logistic Regression | ~0.855 | ~0.97 | ~0.41 | ~0.57 | 0.20 |
| Random Forest | ~0.830 | ~0.90 | ~0.47 | ~0.62 | 0.25 |
| XGBoost | ~0.830 | ~0.92 | ~0.45 | ~0.60 | 0.25 |

**Logistic Regression selected** — highest ROC-AUC, highest churn recall, and best interpretability via coefficient analysis.

### 5. Model evaluation

- ROC-AUC: ~0.855
- Churn recall: ~0.97 (97% of churners correctly identified)
- Churn precision: ~0.41
- Normalized confusion matrices — best (tuned LR) vs. worst (baseline, threshold=0.50)
- ROC curves for all three models overlaid
- Feature importance via Logistic Regression coefficients

**Strongest churn drivers**: fiber optic internet, electronic check payment, month-to-month contract.  
**Strongest retention factors**: two-year contract, high log_tenure, having dependents.

### 6. Business recommendations

Contract conversion incentives, fiber optic retention campaigns, payment method nudges toward automatic methods, early-tenure onboarding programs, and add-on service bundling.

### 7. Customer segmentation

K-Means clustering (k=3) on service features, billing, tenure, Total Charges, and CLTV. Cluster selection validated with Elbow Method and Silhouette Analysis.

| Cluster | Segment name | Profile |
|---------|-------------|---------|
| 0 | Budget Minimal Users | Low charges, moderate tenure, limited services, DSL/no internet |
| 1 | Premium Bundled Users | High charges, short tenure, fiber optic, many add-ons |
| 2 | High-Value but Volatile | Highest charges/tenure/CLTV, but mostly month-to-month + electronic check |

**Churn risk by segment**: mean churn probability aggregated per cluster using the trained model's `predict_proba` output. Cluster 2 carries the highest churn risk despite being the highest-value segment — the primary retention priority.

### 8. PCA cluster validation

PCA to 2 components (~54.5% explained variance). Scatter plot with cluster centroids labelled — confirms three meaningful, separable groups.

---

## Architecture

```text
Client (React) or file upload
    → FastAPI (CORS for local + Vercel)
        → preprocessing (raw → churn / segmentation feature frames)
            → joblib pipelines (churn + segmentation + threshold)
        → JSON response (single) or tabular records (bulk)
```

**Backend layout**

- `app/main.py` — routes and middleware.
- `app/predictor.py` — loads `models/*`, shared `analyze_customer` / `analyze_customers_batch`, risk levels, segment map.
- `app/services/preproccessing.py` — column mapping, validation, `build_churn_input` / `build_segmentation_input`.
- `app/services/prediction_service.py` — single-customer orchestration.
- `app/services/bulk_service.py` — file load, batch inference, actions and sorting.
- `app/services/actions.py` — suggested actions, priority score, risk driver hints.

**Artifacts** (`models/`)

- `Churn_Pipeline` — full sklearn Pipeline (preprocessor + Logistic Regression).
- `Segmentation_Model` — fitted K-Means (k=3).
- `Segmentation_Preprocessor` — fitted ColumnTransformer for segmentation features.
- `Threshold_Config` — dict with `churn_threshold` (tuned value, not fixed at 0.5).

---

## API

Base URL: deployed API above or `http://127.0.0.1:8000` locally.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health message |
| `POST` | `/predict` | Single customer — JSON body (`CustomerInput`, snake_case). Returns `PredictionResponse`. |
| `POST` | `/bulk-predict` | Multipart form: `file` = `.csv` or `.xlsx`. Returns `BulkPredictionResponse`. |

Interactive docs: **`/docs`** (Swagger UI) when the API is running.

### `POST /predict`

Request body uses snake_case keys from `app/schemas.py`: `Gender`, `Senior_Citizen`, `Partner`, `Dependents`, service and contract fields, `Monthly_Charges`, `Tenure_Months`, `Total_Charges`, `CLTV`, etc.

Example response:

```json
{
  "churn_probability": 0.89,
  "churn_label": 1,
  "risk_level": "High",
  "segment_label": 1,
  "segment_name": "Premium Bundled Users"
}
```

### `POST /bulk-predict`

- **File**: CSV or Excel with columns matching the training schema (names with spaces): `Gender`, `Senior Citizen`, `Partner`, `Dependents`, `Phone Service`, `Multiple Lines`, `Internet Service`, `Online Security`, `Online Backup`, `Device Protection`, `Tech Support`, `Streaming TV`, `Streaming Movies`, `Contract`, `Paperless Billing`, `Payment Method`, `Monthly Charges`, `Tenure Months`, `Total Charges`, `CLTV`.
- **Response**: `total_rows`, `processed_rows`, and `records` — each record includes predictions plus `suggested_action`, `priority_score`, and `risk_drivers`. Records are ordered by `priority_score` descending.

---

## Frontend

The React app supports:

- **Single customer**: form-based scoring via `POST /predict`.
- **Bulk upload**: upload a `.csv` / `.xlsx` and view a prioritised table via `POST /bulk-predict`.

Uses `VITE_API_BASE_URL` from `frontend/src/api.js`.

---

## Tech stack

- **Python**: FastAPI, Pydantic, Uvicorn, pandas, NumPy, scikit-learn, XGBoost, joblib, openpyxl.
- **Frontend**: React 19, Vite 8.
- **Deployment**: Vercel (frontend), Render (backend).

---

## Local development

**API** (from repository root, with virtual environment activated):

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL=http://127.0.0.1:8000` in `frontend/.env` for local runs.

---

## Render deployment notes

- **Build command**: `pip install -r requirements-render.txt` (runtime-only; avoids notebook/plotting packages).
- **Start command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- If `/bulk-predict` returns 404, check `/docs` on the deployed API — the service may be on an older commit and need a redeploy.

---

## Project structure

```text
Customer-Intelligence-System/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── predictor.py
│   ├── schemas.py
│   └── services/
│       ├── preproccessing.py
│       ├── prediction_service.py
│       ├── bulk_service.py
│       └── actions.py
├── models/                 # Churn_Pipeline, Segmentation_Model,
│                           # Segmentation_Preprocessor, Threshold_Config
├── frontend/               # Vite + React
├── notebooks/              # Analysis and model development
├── Data/                   # Telco_customer_churn.xlsx
├── requirements.txt
├── requirements-render.txt
└── README.md
```

---

## Learning outcomes

- End-to-end ML workflow: exploration → feature engineering → model selection → deployment.
- Decisions beyond default accuracy: class imbalance handling, threshold tuning, risk bands.
- Bridging prediction and segmentation: churn probability aggregated per behavioral segment.
- Serving models with FastAPI and a React client.
- Bulk scoring with lightweight business rules (suggested actions, priority score, risk drivers).

---

## Author

[Ali Nazir](https://www.linkedin.com/in/ali-nazir-74b909275) — portfolio project demonstrating production-oriented data science and deployment.