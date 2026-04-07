const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getApiBaseUrl() {
  return API_BASE_URL;
}

async function parseErrorResponse(response) {
  try {
    const data = await response.json();
    if (data.detail !== undefined) {
      if (typeof data.detail === "string") return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((d) => (typeof d === "string" ? d : d.msg || JSON.stringify(d)))
          .join("; ");
      }
    }
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch {
    return response.statusText || "Request failed";
  }
}

export async function predictCustomer(customerData) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new Error(message);
  }

  return response.json();
}

/**
 * Upload CSV or Excel (.xlsx) with training-schema columns (see README).
 * Field name must match backend: `file`.
 */
export async function bulkPredict(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/bulk-predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new Error(message);
  }

  return response.json();
}
