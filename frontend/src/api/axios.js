import axios from "axios";

const API = axios.create({
  baseURL: "https://fuelpasssystemlive-production.up.railway.app/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    // Ignore JSON parse errors
    console.error("Error parsing user data from localStorage:", error);
  }

  return req;
});

// Error interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data on unauthorized
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default API;