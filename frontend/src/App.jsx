import { useState } from "react";
import { predictCustomer, bulkPredict, getApiBaseUrl } from "./api";
import "./App.css";

function App() {
  const apiBase = getApiBaseUrl();
  const [mode, setMode] = useState("single");

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

  const [bulkFile, setBulkFile] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");

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
    if (!apiBase) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictCustomer(formData);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Prediction failed. Check input or API connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBulkFileChange = (e) => {
    const f = e.target.files?.[0];
    setBulkFile(f ?? null);
    setBulkError("");
    setBulkResult(null);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!apiBase || !bulkFile) {
      setBulkError("Choose a CSV or Excel file first.");
      return;
    }
    setBulkLoading(true);
    setBulkError("");
    setBulkResult(null);

    try {
      const data = await bulkPredict(bulkFile);
      setBulkResult(data);
    } catch (err) {
      setBulkError(
        err instanceof Error ? err.message : "Bulk prediction failed. Check the file and API connection."
      );
    } finally {
      setBulkLoading(false);
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
          Predict customer churn risk and assign behavioral segments using a production-style ML
          system. Use a single customer form or upload a spreadsheet for batch scoring.
        </p>
        {!apiBase && (
          <p className="config-warning">
            Set <code>VITE_API_BASE_URL</code> in <code>frontend/.env</code> (for example{" "}
            <code>http://127.0.0.1:8000</code>) and restart the dev server.
          </p>
        )}
      </div>

      <div className="mode-bar">
        <button
          type="button"
          className={`mode-tab ${mode === "single" ? "active" : ""}`}
          onClick={() => setMode("single")}
        >
          Single customer
        </button>
        <button
          type="button"
          className={`mode-tab ${mode === "bulk" ? "active" : ""}`}
          onClick={() => setMode("bulk")}
        >
          Bulk upload
        </button>
      </div>

      {mode === "single" && (
        <div className="layout">
          <form className="card form-card" onSubmit={handleSubmit}>
            <h2>Customer input</h2>

            <div className="form-grid">
              <Field label="Gender">
                <select name="Gender" value={formData.Gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>

              <Field label="Senior Citizen">
                <select
                  name="Senior_Citizen"
                  value={formData.Senior_Citizen}
                  onChange={handleChange}
                >
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
                <select
                  name="Multiple_Lines"
                  value={formData.Multiple_Lines}
                  onChange={handleChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Field>

              <Field label="Internet Service">
                <select
                  name="Internet_Service"
                  value={formData.Internet_Service}
                  onChange={handleChange}
                >
                  <option value="Fiber optic">Fiber optic</option>
                  <option value="DSL">DSL</option>
                  <option value="No">No</option>
                </select>
              </Field>

              <Field label="Online Security">
                <select
                  name="Online_Security"
                  value={formData.Online_Security}
                  onChange={handleChange}
                >
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
                <select
                  name="Device_Protection"
                  value={formData.Device_Protection}
                  onChange={handleChange}
                >
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
                <select
                  name="Streaming_Movies"
                  value={formData.Streaming_Movies}
                  onChange={handleChange}
                >
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
                <select
                  name="Paperless_Billing"
                  value={formData.Paperless_Billing}
                  onChange={handleChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Field>

              <Field label="Payment Method">
                <select
                  name="Payment_Method"
                  value={formData.Payment_Method}
                  onChange={handleChange}
                >
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

            <button className="submit-btn" type="submit" disabled={loading || !apiBase}>
              {loading ? "Analyzing..." : "Analyze customer"}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>

          <div className="card result-card">
            <h2>Prediction result</h2>

            {!result && !loading && (
              <div className="placeholder">
                <p>Churn probability, risk band, and segment appear here after you run the model.</p>
              </div>
            )}

            {loading && <p className="loading-text">Running model inference...</p>}

            {result && (
              <div className="result-content">
                <div className={`risk-badge ${getRiskClass()}`}>{result.risk_level} risk</div>

                <div className="metric-grid">
                  <div className="metric-box">
                    <span className="metric-label">Churn probability</span>
                    <span className="metric-value">{(result.churn_probability * 100).toFixed(1)}%</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-label">Prediction</span>
                    <span className="metric-value">
                      {result.churn_label === 1 ? "Likely to churn" : "Stable customer"}
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
      )}

      {mode === "bulk" && (
        <div className="bulk-layout">
          <form className="card bulk-upload-card" onSubmit={handleBulkSubmit}>
            <h2>Bulk scoring</h2>
            <p className="bulk-hint">
              Upload a <strong>CSV</strong> or <strong>Excel</strong> file whose columns match the
              training data (for example <code>Gender</code>, <code>Senior Citizen</code>,{" "}
              <code>Contract</code>, <code>Monthly Charges</code>, <code>Tenure Months</code>,{" "}
              <code>CLTV</code>, and the other service fields). The API returns churn and segment
              predictions, suggested actions, priority scores, and risk drivers, sorted by priority.
            </p>

            <div className="file-row">
              <input
                type="file"
                accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={handleBulkFileChange}
                disabled={!apiBase}
              />
            </div>

            {bulkFile && (
              <p className="file-name">
                Selected: <strong>{bulkFile.name}</strong>
              </p>
            )}

            <button className="submit-btn" type="submit" disabled={bulkLoading || !apiBase || !bulkFile}>
              {bulkLoading ? "Processing file..." : "Run bulk prediction"}
            </button>

            {bulkError && <p className="error-text">{bulkError}</p>}
          </form>

          <div className="card bulk-result-card">
            <h2>Bulk results</h2>

            {!bulkResult && !bulkLoading && (
              <div className="placeholder">
                <p>Upload a file and run bulk prediction to see a prioritized table of customers.</p>
              </div>
            )}

            {bulkLoading && <p className="loading-text">Scoring rows and ranking by priority...</p>}

            {bulkResult && (
              <BulkResultsTable data={bulkResult} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BulkResultsTable({ data }) {
  const { total_rows, processed_rows, records } = data;

  return (
    <div className="bulk-results-inner">
      <div className="bulk-summary">
        <span>
          <strong>{processed_rows}</strong> of <strong>{total_rows}</strong> rows processed
        </span>
      </div>

      <div className="bulk-table-wrap">
        <table className="bulk-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Contract</th>
              <th>CLTV</th>
              <th>Churn %</th>
              <th>Risk</th>
              <th>Segment</th>
              <th>Priority</th>
              <th>Suggested action</th>
              <th>Risk drivers</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{row["Contract"] ?? "—"}</td>
                <td>{formatNum(row["CLTV"])}</td>
                <td>{((row.churn_probability ?? 0) * 100).toFixed(1)}%</td>
                <td>
                  <span className={`risk-pill risk-pill-${String(row.risk_level || "").toLowerCase()}`}>
                    {row.risk_level ?? "—"}
                  </span>
                </td>
                <td>{row.segment_name ?? "—"}</td>
                <td>{formatNum(row.priority_score)}</td>
                <td className="cell-action">{row.suggested_action ?? "—"}</td>
                <td className="cell-drivers">{formatRiskDrivers(row.risk_drivers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatNum(v) {
  if (v === undefined || v === null || Number.isNaN(Number(v))) return "—";
  return Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatRiskDrivers(val) {
  if (val == null) return "—";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "—";
  return String(val);
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
