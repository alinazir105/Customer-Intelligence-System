from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

from app.predictor import analyze_customer
from app.schemas import CustomerInput

app = FastAPI(
    title="Customer Intelligence System",
    description='Predicts churn risk and assigns customer segment',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {'message': 'Customer Intelligence System API is running'}

@app.post("/predict")
def predict_customer(customer: CustomerInput):
    # Converting pydantic object to dictionary
    customer_dict = customer.model_dump()
    
    # Map API field names to original model training columns
    raw_data = {
        "Gender": customer_dict["Gender"],
        "Senior Citizen": customer_dict["Senior_Citizen"],
        "Partner": customer_dict["Partner"],
        "Dependents": customer_dict["Dependents"],
        "Phone Service": customer_dict["Phone_Service"],
        "Multiple Lines": customer_dict["Multiple_Lines"],
        "Internet Service": customer_dict["Internet_Service"],
        "Online Security": customer_dict["Online_Security"],
        "Online Backup": customer_dict["Online_Backup"],
        "Device Protection": customer_dict["Device_Protection"],
        "Tech Support": customer_dict["Tech_Support"],
        "Streaming TV": customer_dict["Streaming_TV"],
        "Streaming Movies": customer_dict["Streaming_Movies"],
        "Contract": customer_dict["Contract"],
        "Paperless Billing": customer_dict["Paperless_Billing"],
        "Payment Method": customer_dict["Payment_Method"],
        "Monthly Charges": customer_dict["Monthly_Charges"],
        "Tenure Months": customer_dict["Tenure_Months"],
        "Total Charges": customer_dict["Total_Charges"],
        "CLTV": customer_dict["CLTV"]
    }

    # One-row dataframe from raw customer input
    raw_df = pd.DataFrame([raw_data])
    
    # Churn model input must match the churn training schema
    churn_input_df = raw_df.drop(columns=['Total Charges', 'CLTV'])
    churn_input_df["log_tenure"] = np.log1p(churn_input_df["Tenure Months"])
    churn_input_df = churn_input_df.drop(columns=['Tenure Months'])
    
    # Segmentation model input must match the segmentation training schema
    segmentation_input_df = raw_df.drop(columns=['Gender'])
    
    result = analyze_customer(churn_input_df, segmentation_input_df)
    
    return result