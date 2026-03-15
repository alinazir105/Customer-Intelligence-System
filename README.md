# 🚀 Customer Intelligence System
### Production-Ready Churn Prediction & Customer Segmentation Platform
---

## 🔗 Live Demo

Frontend: https://customer-intelligence-system-psi.vercel.app  
API: https://customer-intelligence-system-umd0.onrender.com

---

## 📌 Overview

This project implements a production-style machine learning system that predicts customer churn risk and assigns behavioral customer segments.

The system combines:

- Supervised learning for churn prediction
- Unsupervised learning for customer segmentation
- Threshold tuning for business-aligned decisions
- REST API deployment using FastAPI
- Interactive web interface built with React
- End-to-end production pipeline

The goal is to demonstrate how machine learning models can be taken from notebook experimentation to a deployable, real-world application.

---

## ✨ Key Features

- 🔮 Predicts churn probability for individual customers
- ⚠️ Classifies risk levels (Low / Medium / High)
- 👥 Assigns customers to behavioral segments
- 🧠 Uses tuned decision threshold (not default 0.5)
- 🚀 Production-ready API using FastAPI
- 🎨 React frontend for interactive predictions
- 📦 Fully deployable architecture

---

## 🏗️ System Architecture

Input Customer Data  
→ Preprocessing Pipeline  
→ Churn Prediction Model  
→ Threshold-Based Decision  
→ Customer Segmentation Model  
→ API Response  
→ Frontend Visualization

---

## 🤖 Models Used

### Churn Prediction (Supervised Learning)

- Logistic Regression
- Class imbalance handling
- Threshold tuning for business impact
- Feature engineering including log-transformed tenure

### Customer Segmentation (Unsupervised Learning)

- K-Means clustering
- Feature scaling
- Cluster profiling using numerical and categorical analysis
- PCA visualization for interpretability

---

## 👥 Customer Segments

1. **Budget Minimal Users**
   - Low service usage
   - Low monthly charges
   - Long-term contracts
   - Stable, low-value customers

2. **Premium Bundled Users**
   - High service adoption
   - Fiber optic users
   - Multiple add-ons
   - Medium churn risk

3. **High-Value Volatile Customers**
   - High revenue contribution
   - Month-to-month contracts
   - High churn risk if not retained

---

## 🧰 Tech Stack

- Python
- Scikit-learn
- Pandas & NumPy
- FastAPI
- React
- Joblib (model serialization)
- Uvicorn (ASGI server)
- Vercel (frontend deployment)
- Render (backend deployment)

---

## 🌐 API Endpoint

POST /predict

Returns:

- Churn probability
- Churn classification
- Risk level
- Customer segment
- Cluster ID

---

## 🧪 Example Response

```json
{
  "churn_probability": 0.89,
  "churn_label": 1,
  "risk_level": "High",
  "segment_label": 1,
  "segment_name": "Premium Bundled Users"
}
```

---

## 🚀 Deployment

- Backend deployed on Render
- Frontend deployed on Vercel
- Cross-origin communication enabled via CORS configuration

---

## 📂 Project Structure

```md
Customer-Intelligence-System/
│
├── app/                      # FastAPI backend
│   ├── main.py
│   ├── predictor.py
│   └── schemas.py
│
├── models/                   # Serialized ML artifacts
│   ├── Churn_Pipeline
│   ├── Segmentation_Model
│   ├── Segmentation_Preprocessor
│   └── Threshold_Config
│
├── frontend/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── notebooks/                # Development notebook
│   └── Notebook.ipynb
│
├── Data/
│   └── Telco_customer_churn.xlsx
│
├── README.md
└── requirements.txt
```

---

## 🎓 Learning Outcomes

This project demonstrates:

- End-to-end ML lifecycle
- Model evaluation beyond accuracy
- Handling class imbalance
- Production deployment of ML systems
- Integration of ML with modern web applications
- Customer analytics for business decision support

---

## 👤 [Ali Nazir](www.linkedin.com/in/ali-nazir-74b909275)

Developed as a portfolio project demonstrating production-level data science capabilities.

---

