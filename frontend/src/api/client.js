const API_URL = import.meta.env.VITE_API_URL || "https://fitforge-backend-o2f7.onrender.com";

let authToken = "";

export const setApiToken = (token) => {
  authToken = token || "";
};

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(payload.message || "Request failed.");
    error.status = response.status;
    error.details = payload.errors;
    throw error;
  }

  return payload;
};

export const apiUrl = API_URL;

