const API_BASE = "http://localhost:4000/api";

const request = async (path, options = {}, token) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Erreur API";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (error) {
      // Keep fallback message when response body is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  listVehicles: (token) => request("/vehicles", {}, token),
  createVehicle: (payload, token) =>
    request("/vehicles", { method: "POST", body: JSON.stringify(payload) }, token),
  updateVehicle: (id, payload, token) =>
    request(`/vehicles/${id}`, { method: "PUT", body: JSON.stringify(payload) }, token),
  deleteVehicle: (id, token) => request(`/vehicles/${id}`, { method: "DELETE" }, token),

  addPosition: (payload, token) =>
    request("/positions", { method: "POST", body: JSON.stringify(payload) }, token),
  latestPositions: (token) => request("/positions/latest", {}, token),
  history: (vehicleId, token) => request(`/positions/vehicle/${vehicleId}/history`, {}, token),
  radiusSearch: (lat, lng, radius, token) =>
    request(`/positions/search/radius?lat=${lat}&lng=${lng}&radius=${radius}`, {}, token),
  nearest: (lat, lng, token) =>
    request(`/positions/search/nearest?lat=${lat}&lng=${lng}`, {}, token),
};
