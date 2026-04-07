
"""
This module contains functions to suggest actions based on churn probability, customer segment, and CLTV. 
It also includes a function to calculate a priority score for retention efforts and identify key risk drivers for customer churn.
"""

"""
Function to suggest action based on churn probability, customer segment, and CLTV.
- High Risk (churn_prob >= 0.8):
    - If CLTV > 4000: "Immediate retention call by senior agent"
    - Else: "Send targeted discount offer"
- Medium Risk (churn_prob >= 0.5):
    - If segment is "Premium Bundled Users": "Offer loyalty upgrade or bundle"
    - Else: "Send engagement email"
- Low Risk (churn_prob < 0.5): "No immediate action required"
"""
def suggest_action(churn_prob: float, segment_name: str, cltv: float) -> str:
    if churn_prob >= 0.8:
        if cltv > 4000:
            return "Immediate retention call by senior agent"
        else:
            return "Send targeted discount offer"
        
    elif churn_prob >= 0.5:
        if segment_name == "Premium Bundled Users":
            return "Offer loyalty upgrade or bundle"
        else:
            return "Send engagement email"
        
    else:
        return "No immediate action required"
    
    
"""
Function to calculate a priority score for retention efforts. Higher score indicates higher priority.   
"""
def calculate_priority_score(churn_prob: float, cltv: float) -> float:
    return round(churn_prob * cltv, 2)

"""
Function to identify key risk drivers for customer churn based on input features.
This is a simple rule-based approach for demonstration. In a real application, this could be enhanced with SHAP values or feature importance from the model.
"""
def get_risk_drivers(row: dict) -> list:
    reasons = []

    if row["Tenure Months"] < 6:
        reasons.append("Short tenure")

    if row["Contract"] == "Month-to-month":
        reasons.append("No long-term contract")

    if row["Tech Support"] == "No":
        reasons.append("No tech support")

    if row["Monthly Charges"] > 80:
        reasons.append("High monthly charges")

    if row["Payment Method"] == "Electronic check":
        reasons.append("Risky payment method")

    return reasons