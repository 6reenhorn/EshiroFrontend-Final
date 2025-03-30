import axiosInstance from "./axiosInstance";

// Fetch Products
export const fetchProducts = async () => {
  const response = await axiosInstance.get("/products/");
  return response.data;
};

// Fetch Categories
export const fetchCategories = async () => {
  const response = await axiosInstance.get("/categories/");
  return response.data;
};

// Fetch User Profile
export const fetchUserProfile = async (userId: number) => {
  const response = await axiosInstance.get(`/profiles/${userId}/`);
  return response.data;
};

// Fetch Cart Items
export const fetchCartItems = async (userId: number) => {
  const response = await axiosInstance.get(`/carts/${userId}/`);
  return response.data;
};

// Fetch Wishlist Items
export const fetchWishlistItems = async (userId: number) => {
  const response = await axiosInstance.get(`/wishlist/${userId}/`);
  return response.data;
};

// User Login
export const login = async (email: string, password: string) => {
  try {
    // Try this format first - standard Django auth often uses this
    const response = await axiosInstance.post("/login/", {
      username: email,
      password: password
    });
    
    console.log("Login successful with username/password format");
    return response.data;
  } catch (error) {
    console.error("Login with username format failed:", error);
    
    try {
      // If that fails, try with email field explicitly
      const response = await axiosInstance.post("/login/", {
        email: email,
        password: password
      });
      
      console.log("Login successful with email/password format");
      return response.data;
    } catch (secondError) {
      console.error("Login with email format failed:", secondError);
      
      // If that also fails, log both errors for debugging and rethrow
      console.error("All login attempts failed");
      throw secondError;
    }
  }
};

// User Signup
export const signupUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await axiosInstance.post("/signup/", userData);
  return response.data;
};

// Fetch Orders
export const fetchOrders = async (userId: number) => {
  const response = await axiosInstance.get(`/orders/${userId}/`);
  return response.data;
};

// Fetch Payments
export const fetchPayments = async (userId: number) => {
  const response = await axiosInstance.get(`/payments/${userId}/`);
  return response.data;
};
