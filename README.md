# Customer Intelligence System

Production-style churn prediction and customer segmentation: supervised churn scoring with a tuned decision threshold, unsupervised segmentation, and a FastAPI backend with a React (Vite) frontend.

## Live demo

| Component | URL |
|-----------|-----|
| Frontend | https://customer-intelligence-system-psi.vercel.app |
| API | https://customer-intelligence-system-umd0.onrender.com |

## Overview

The system turns notebook-trained models into a small deployable stack:

- **Churn**: probability, binary label (vs. tuned threshold), and **risk band** (Low / Medium / High) using the saved threshold plus a 0.75 cutoff for “High” risk.
- **Segmentation**: K-Means cluster id and a human-readable segment name.
- **Single customer**: JSON `POST /predict` with snake_case fields; preprocessing matches training (e.g. `log_tenure` for churn).
- **Bulk upload**: `POST /bulk-predict` accepts **CSV or Excel** with the same columns as the training sheet; responses are sorted by a **priority score** and include **suggested actions**, **priority score**, and **rule-based risk drivers** for each row.

Goal: show an end-to-end ML lifecycle from data and notebooks to API and UI.

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

- `Churn_Pipeline`, `Segmentation_Model`, `Segmentation_Preprocessor`, `Threshold_Config` (includes `churn_threshold`).

## Models (summary)

**Churn (supervised)**  
Logistic regression (via saved pipeline), class-imbalance handling in training, **threshold tuning** stored in `Threshold_Config` (not fixed at 0.5). Feature engineering includes log-transformed tenure (`log_tenure`).

**Segmentation (unsupervised)**  
K-Means with a fitted preprocessor; clusters are mapped to labels in `app/predictor.py`.

## Customer segments

| Cluster | Label |
|--------|--------|
| 0 | Budget Minimal Users |
| 1 | Premium Bundled Users |
| 2 | High-Value but Volatile Users |

## API

Base URL: use the deployed API above or `http://127.0.0.1:8000` when running locally.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health message |
| `POST` | `/predict` | Single customer JSON body (`CustomerInput` — snake_case fields). Returns `PredictionResponse`. |
| `POST` | `/bulk-predict` | Multipart form: `file` = `.csv` or `.xlsx`. Returns `BulkPredictionResponse`. |

Interactive docs: **`/docs`** (Swagger UI) when the API is running.

### `POST /predict`

Request body uses snake_case keys aligned with `app/schemas.py`, for example: `Gender`, `Senior_Citizen`, `Partner`, `Dependents`, service and contract fields, `Monthly_Charges`, `Tenure_Months`, `Total_Charges`, `CLTV`, etc.

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

- **File**: CSV or Excel with columns matching the training schema (names with spaces), for example: `Gender`, `Senior Citizen`, `Partner`, `Dependents`, `Phone Service`, `Multiple Lines`, `Internet Service`, `Online Security`, `Online Backup`, `Device Protection`, `Tech Support`, `Streaming TV`, `Streaming Movies`, `Contract`, `Paperless Billing`, `Payment Method`, `Monthly Charges`, `Tenure Months`, `Total Charges`, `CLTV`.
- **Response**: `total_rows`, `processed_rows`, and `records` — each record combines original columns with predictions plus `suggested_action`, `priority_score`, and `risk_drivers` (list of strings). Records are ordered by `priority_score` descending.

## Tech stack

- **Python**: FastAPI, Pydantic, Uvicorn, pandas, NumPy, scikit-learn, joblib, openpyxl (Excel).
- **Frontend**: React 19, Vite 8.
- **Deployment**: Vercel (frontend), Render (backend); CORS allows localhost (Vite default port) and the Vercel URL.

## Local development

**API** (from repository root, with a virtual environment and dependencies installed):

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

The client reads `VITE_API_BASE_URL` (used in `frontend/src/api.js`). For local runs, set it to `http://127.0.0.1:8000` in `frontend/.env` or your environment.

## Project structure

```text
Customer-Intelligence-System/
├── app/
│   ├── main.py
│   ├── predictor.py
│   ├── schemas.py
│   └── services/
│       ├── preproccessing.py
│       ├── prediction_service.py
│       ├── bulk_service.py
│       └── actions.py
├── models/                 # joblib pipelines and threshold config
├── frontend/               # Vite + React
├── notebooks/
├── Data/                   # e.g. Telco_customer_churn.xlsx
├── requirements.txt
└── README.md
```

## Learning outcomes

- End-to-end ML workflow from exploration to API.
- Decisions beyond default accuracy (imbalance, threshold tuning, risk bands).
- Serving models with FastAPI and a small React client.
- Optional bulk scoring and lightweight business rules (actions, priority, drivers).

## Author

[Ali Nazir](https://www.linkedin.com/in/ali-nazir-74b909275) — portfolio project demonstrating production-oriented data science and deployment.
