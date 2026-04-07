import pandas as pd
from app.services.preproccessing import(
    normalize_bulk_dataframe,
    validate_bulk_dataframe,
    build_churn_input,
    build_segmentation_input
)
from app.predictor import analyze_customers_batch
from app.services.actions import (
    suggest_action,
    calculate_priority_score,
    get_risk_drivers
)

def load_uploaded_dataframe(file) -> pd.DataFrame:
    filename = file.filename.lower()
    
    if filename.endswith('.csv'):
        return pd.read_csv(file.file)
    elif filename.endswith('.xlsx'):
        return pd.read_excel(file.file)
    else:
        raise ValueError("Unsupported file format. Please upload a CSV or Excel file.")
    
def predict_bulk_customers(file) -> pd.DataFrame:
    raw_df = load_uploaded_dataframe(file)
    raw_df = normalize_bulk_dataframe(raw_df)
    
    validate_bulk_dataframe(raw_df)
    
    churn_input_df = build_churn_input(raw_df)
    segmentation_input_df = build_segmentation_input(raw_df)
    
    predictions_df = analyze_customers_batch(churn_input_df, segmentation_input_df)
    
    output_df = pd.concat([raw_df.reset_index(drop=True), predictions_df.reset_index(drop=True)], axis=1)
    output_df["suggested_action"] = output_df.apply(
        lambda row: suggest_action(
            row["churn_probability"],
            row["segment_name"],
            row["CLTV"]
        ),
        axis=1
    )

    output_df["priority_score"] = output_df.apply(
        lambda row: calculate_priority_score(
            row["churn_probability"],
            row["CLTV"]
        ),
        axis=1
    )

    output_df["risk_drivers"] = output_df.apply(
        lambda row: get_risk_drivers(row),
        axis=1
    )
    
    output_df = output_df.sort_values(by="priority_score", ascending=False)
    
    return {
        "total_rows": int(len(raw_df)),
        "processed_rows": int(len(output_df)),
        "records": output_df.to_dict(orient="records")
    }