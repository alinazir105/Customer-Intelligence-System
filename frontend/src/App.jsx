import { useState } from "react";
import { predictCustomer } from "./api";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Gender: "Male",
    Senior_Citizen: "No",
    Partner: "Yes",
    Dependents: "No",
    Phone_Service: "Yes",
    Multiple_Lines: "No",
    Internet_Service: "Fiber optic",
    Online_Security: "No",
    Online_Backup: "Yes",
    Device_Protection: "Yes",
    Tech_Support: "No",
    Streaming_TV: "Yes",
    Streaming_Movies: "Yes",
    Contract: "Month-to-month",
    Paperless_Billing: "Yes",
    Payment_Method: "Electronic check",
    Monthly_Charges: 85.5,
    Tenure_Months: 12,
    Total_Charges: 1026.0,
    CLTV: 3500.0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictCustomer(formData);
      setResult(data);
    } catch (err) {
      setError("Prediction failed. Please check your input or backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = () => {
    if (!result) return "";
    if (result.risk_level === "High") return "risk-high";
    if (result.risk_level === "Medium") return "risk-medium";
    return "risk-low";
  };

  return (
    <div className="app-container">
      <div className="hero">
        <h1>Customer Intelligence System</h1>
        <p>
          Predict customer churn risk and assign behavioral segments using a
          production-style ML system.
        </p>
      </div>

      <div className="layout">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Customer Input</h2>

          <div className="form-grid">
            <Field label="Gender">
              <select name="Gender" value={formData.Gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>

            <Field label="Senior Citizen">
              <select name="Senior_Citizen" value={formData.Senior_Citizen} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Partner">
              <select name="Partner" value={formData.Partner} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Dependents">
              <select name="Dependents" value={formData.Dependents} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Phone Service">
              <select name="Phone_Service" value={formData.Phone_Service} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Multiple Lines">
              <select name="Multiple_Lines" value={formData.Multiple_Lines} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Internet Service">
              <select name="Internet_Service" value={formData.Internet_Service} onChange={handleChange}>
                <option value="Fiber optic">Fiber optic</option>
                <option value="DSL">DSL</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Online Security">
              <select name="Online_Security" value={formData.Online_Security} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Online Backup">
              <select name="Online_Backup" value={formData.Online_Backup} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Device Protection">
              <select name="Device_Protection" value={formData.Device_Protection} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Tech Support">
              <select name="Tech_Support" value={formData.Tech_Support} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Streaming TV">
              <select name="Streaming_TV" value={formData.Streaming_TV} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Streaming Movies">
              <select name="Streaming_Movies" value={formData.Streaming_Movies} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Contract">
              <select name="Contract" value={formData.Contract} onChange={handleChange}>
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </Field>

            <Field label="Paperless Billing">
              <select name="Paperless_Billing" value={formData.Paperless_Billing} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Payment Method">
              <select name="Payment_Method" value={formData.Payment_Method} onChange={handleChange}>
                <option value="Electronic check">Electronic check</option>
                <option value="Mailed check">Mailed check</option>
                <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                <option value="Credit card (automatic)">Credit card (automatic)</option>
              </select>
            </Field>

            <Field label="Monthly Charges">
              <input
                type="number"
                step="0.01"
                name="Monthly_Charges"
                value={formData.Monthly_Charges}
                onChange={handleChange}
              />
            </Field>

            <Field label="Tenure Months">
              <input
                type="number"
                name="Tenure_Months"
                value={formData.Tenure_Months}
                onChange={handleChange}
              />
            </Field>

            <Field label="Total Charges">
              <input
                type="number"
                step="0.01"
                name="Total_Charges"
                value={formData.Total_Charges}
                onChange={handleChange}
              />
            </Field>

            <Field label="CLTV">
              <input
                type="number"
                step="0.01"
                name="CLTV"
                value={formData.CLTV}
                onChange={handleChange}
              />
            </Field>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Customer"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="card result-card">
          <h2>Prediction Result</h2>

          {!result && !loading && (
            <div className="placeholder">
              <p>Your churn prediction and customer segment will appear here.</p>
            </div>
          )}

          {loading && <p className="loading-text">Running model inference...</p>}

          {result && (
            <div className="result-content">
              <div className={`risk-badge ${getRiskClass()}`}>
                {result.risk_level} Risk
              </div>

              <div className="metric-grid">
                <div className="metric-box">
                  <span className="metric-label">Churn Probability</span>
                  <span className="metric-value">
                    {(result.churn_probability * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Prediction</span>
                  <span className="metric-value">
                    {result.churn_label === 1 ? "Likely to Churn" : "Stable Customer"}
                  </span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Segment</span>
                  <span className="metric-value">{result.segment_name}</span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Cluster ID</span>
                  <span className="metric-value">{result.segment_label}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default App;