from pathlib import Path
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR/'models'

churn_pipeline = joblib.load(MODELS_DIR/'Churn_Pipeline')
segmentation_preprocessor = joblib.load(MODELS_DIR/'Segmentation_Preprocessor')
segmentation_model = joblib.load(MODELS_DIR/'Segmentation_Model')
threshold_config = joblib.load(MODELS_DIR/'Threshold_Config')

CHURN_THRESHOLD = threshold_config['churn_threshold']

SEGMENT_MAP = {
    0: 'Budget Minimal Users',
    1: 'Premium Bundled Users',
    2: 'High-Value but Volatile Users' 
}

"""
Function to determine risk level based on churn probability and threshold.
- High Risk: churn probability >= 0.75
- Medium Risk: churn probability >= threshold but < 0.75
- Low Risk: churn probability < threshold
"""
def get_risk_level(churn_prob: float, threshold: float) -> str:
    if churn_prob >= 0.75:
        return 'High'
    elif churn_prob >= threshold:
        return 'Medium'
    else:
        return 'Low'
   
"""
Prediction function for batch of customers. Returns a dataframe with predictions for each customer.
"""
def analyze_customers_batch(
    churn_input_df: pd.DataFrame,
    segmentation_input_df: pd.DataFrame
) -> pd.DataFrame:
    churn_probs = churn_pipeline.predict_proba(churn_input_df)[:, 1]
    churn_labels = (churn_probs >= CHURN_THRESHOLD).astype(int)
    
    segment_transformed = segmentation_preprocessor.transform(segmentation_input_df)
    segment_labels = segmentation_model.predict(segment_transformed)
    
    results_df = pd.DataFrame({
        'churn_probability': churn_probs.astype(float),
        'churn_label': churn_labels.astype(int),
        'risk_level': [get_risk_level(prob, CHURN_THRESHOLD) for prob in churn_probs],
        'segment_label': segment_labels.astype(int),
        'segment_name': [SEGMENT_MAP[label] for label in segment_labels]
    })
    return results_df

"""
Prediction function for single customer. Returns a dictionary with predictions for the customer.
"""
def analyze_customer(
    churn_input_df: pd.DataFrame, 
    segmentation_input_df: pd.DataFrame
    ) -> dict:
    churn_prob = churn_pipeline.predict_proba(churn_input_df)[:, 1][0]
    churn_label = int(churn_prob >= CHURN_THRESHOLD)
    
    segment_transformed = segmentation_preprocessor.transform(segmentation_input_df)
    segment_label = int(segmentation_model.predict(segment_transformed)[0])
    
    risk_level = get_risk_level(churn_prob, CHURN_THRESHOLD)
    
    return {
        'churn_probability': float(churn_prob),
        'churn_label': churn_label,
        'risk_level': risk_level,
        'segment_label': segment_label,
        'segment_name': SEGMENT_MAP[segment_label]
    }