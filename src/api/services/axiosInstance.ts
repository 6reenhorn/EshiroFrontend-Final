import axios from "axios";

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Dynamically load from .env
  headers: {
    "Content-Type": "application/json",
  },
});


// Add an interceptor to include the Authorization token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Token ${token}`; // Attach token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle user login
export const login = async (email: string, password: string) => {
  try {
    // Send a POST request to the login endpoint
    const response = await api.post("/login/", { username: email, password });

    // Extract token and user_id from the response
    const { token, user_id } = response.data;

    // Save the token and user_id to localStorage if present
    if (token && user_id) {
      localStorage.setItem("token", token); // Save the token
      localStorage.setItem("user_id", user_id.toString()); // Save the user_id as a string
      console.log("Authentication successful. Token:", token, "User ID:", user_id);
    } else {
      console.error("Login response is missing token or user_id.");
      throw new Error("Login failed: Invalid response from the server.");
    }

    return response.data; // Return the entire response data for further use
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Login failed:", error);

    // Throw the error to let the calling function handle it
    throw new Error(error.response?.data?.detail || "Login failed: Please try again.");
  }
};
// Export the axios instance
export default api;
