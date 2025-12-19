const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);

const handleResponse = async (resp) => {
  if (resp.status === 401) {
    console.warn("Unauthorized — logging out");
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  const text = await resp.text();
  try {
    return JSON.parse(text || "null");
  } catch (err) {
    // not JSON, return raw text
    if (!resp.ok) throw new Error(text || "API Error");
    return text;
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  // let fetch set Content-Type for FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const resp = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!resp.ok) return handleResponse(resp);
  return handleResponse(resp);
};

// convenience helpers
export const apiGet = (endpoint) => apiFetch(endpoint, { method: "GET" });
export const apiPost = (endpoint, body) => apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) });
export const apiPatch = (endpoint, body) => apiFetch(endpoint, { method: "PATCH", body: JSON.stringify(body) });
export const apiDelete = (endpoint) => apiFetch(endpoint, { method: "DELETE" });
export const apiPostForm = (endpoint, formData) => apiFetch(endpoint, { method: "POST", body: formData });
