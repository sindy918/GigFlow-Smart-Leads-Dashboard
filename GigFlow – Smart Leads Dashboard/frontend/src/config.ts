// Centralized configuration for the frontend API URL
// Under production mode, we never fallback to localhost:5000.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://gigflow-backend-fb1x.onrender.com/api'
    : 'http://localhost:5000/api');
