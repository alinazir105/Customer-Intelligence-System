from app.schemas import CustomerInput
from app.services.preproccessing import (
    build_raw_dataframe,
    build_churn_input,
    build_segmentation_input
)
from app.predictor import analyze_customer

def predict_single_customer(customer: CustomerInput) -> dict:
    customer_dict = customer.model_dump()
    
    raw_df = build_raw_dataframe(customer_dict)
    churn_input_df = build_churn_input(raw_df)
    segmentation_input_df = build_segmentation_input(raw_df)
    
    result = analyze_customer(churn_input_df, segmentation_input_df)
    return result