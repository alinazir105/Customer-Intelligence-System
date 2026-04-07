from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile, HTTPException

from app.schemas import CustomerInput
from app.schemas import PredictionResponse
from app.services.prediction_service import predict_single_customer

from app.schemas import BulkPredictionResponse
from app.services.bulk_service import predict_bulk_customers

app = FastAPI(
    title="Customer Intelligence System",
    description='Predicts churn risk and assigns customer segment',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "https://customer-intelligence-system-psi.vercel.app"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {'message': 'Customer Intelligence System API is running'}

@app.post("/predict", response_model=PredictionResponse)
def predict_customer(customer: CustomerInput):
    return predict_single_customer(customer)

@app.post('/bulk-predict', response_model=BulkPredictionResponse)
def predict_bulk(file: UploadFile = File(...)):
    try:
        return predict_bulk_customers(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk prediction failed: {str(e)}")