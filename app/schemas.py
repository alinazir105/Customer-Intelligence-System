from pydantic import BaseModel
from typing import List, Dict, Any

class BulkPredictionRow(BaseModel):
    Gender: str
    Senior_Citizen: str | None = None
    Partner: str
    Dependents: str
    Phone_Service: str | None = None
    Multiple_Lines: str
    Internet_Service: str
    Online_Security: str
    Online_Backup: str
    Device_Protection: str
    Tech_Support: str
    Streaming_TV: str
    Streaming_Movies: str
    Contract: str
    Paperless_Billing: str
    Payment_Method: str
    Monthly_Charges: float
    Tenure_Months: int | None = None
    Total_Charges: float
    CLTV: float
    churn_probability: float
    churn_label: int
    risk_level: str
    segment_label: int
    segment_name: str

class BulkPredictionResponse(BaseModel):
    total_rows: int
    processed_rows: int
    records: List[Dict[str, Any]]

"""
Schemas for input and output data validation for Single Customer using Pydantic.
"""
class CustomerInput(BaseModel):
    Gender: str
    Senior_Citizen: str
    Partner: str
    Dependents: str
    Phone_Service: str
    Multiple_Lines: str
    Internet_Service: str
    Online_Security: str
    Online_Backup: str
    Device_Protection: str
    Tech_Support: str
    Streaming_TV: str
    Streaming_Movies: str
    Contract: str
    Paperless_Billing: str
    Payment_Method: str
    Monthly_Charges: float
    Tenure_Months: int
    Total_Charges: float
    CLTV: float
    
class PredictionResponse(BaseModel):
    churn_probability: float
    churn_label: int
    risk_level: str
    segment_label: int
    segment_name: str