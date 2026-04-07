import pandas as pd
import numpy as np

REQUIRED_COLUMNS = [
    "Gender",
    "Senior Citizen",
    "Partner",
    "Dependents",
    "Phone Service",
    "Multiple Lines",
    "Internet Service",
    "Online Security",
    "Online Backup",
    "Device Protection",
    "Tech Support",
    "Streaming TV",
    "Streaming Movies",
    "Contract",
    "Paperless Billing",
    "Payment Method",
    "Monthly Charges",
    "Tenure Months",
    "Total Charges",
    "CLTV",
]

# Remove leading/trailing spaces from column names
def normalize_bulk_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [col.strip() for col in df.columns]
    return df

# Validate that all required columns are present in the dataframe
def validate_required_columns(df: pd.DataFrame) -> None:
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")

def validate_bulk_dataframe(df: pd.DataFrame) -> None:
    if df.empty:
        raise ValueError("Uploaded File is empty")
    validate_required_columns(df)
    


"""
Preprocessing functions for Single Customer Prediction
"""
def map_customer_dict_to_raw_row(customer_dict: dict) -> dict:
    # Map API field names to original model training columns
    return {
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
    
def build_raw_dataframe(customer_dict: dict) -> pd.DataFrame:
    # One-row dataframe from raw customer input
    raw_row = map_customer_dict_to_raw_row(customer_dict)
    return pd.DataFrame([raw_row])


"""
Input Builder functions to match the training schema of each model. 
Work for bth single and bulk prediction since they operate on dataframes.
"""

def build_churn_input(raw_df: pd.DataFrame) -> pd.DataFrame:
    # Churn model input must match the churn training schema
    churn_input_df = raw_df.drop(columns=['Total Charges', 'CLTV'])
    churn_input_df["log_tenure"] = np.log1p(churn_input_df["Tenure Months"])
    churn_input_df = churn_input_df.drop(columns=['Tenure Months'])
    return churn_input_df

def build_segmentation_input(raw_df: pd.DataFrame) -> pd.DataFrame:
    # Segmentation model input must match the segmentation training schema
    segmentation_input_df = raw_df.drop(columns=['Gender'])
    return segmentation_input_df