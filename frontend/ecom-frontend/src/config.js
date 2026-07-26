// Single source of truth for the backend URL.
// Change this in ONE place if your backend ever runs on a different host/port.
export const API_BASE_URL = "http://localhost:8080";
export const API_URL = `${API_BASE_URL}/api`;

export const getProductImageUrl = (id) => `${API_URL}/products/${id}/image`;
