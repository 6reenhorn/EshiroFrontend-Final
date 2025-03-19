import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "@/api/services/axiosInstance";
import axios from "axios";

export interface User {
  id: number;
  full_name: string;
  email: string;
  cellphone_number: string;
  complete_address: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  price: string;
  image_Url: string;
  quantity: number;
}

export interface Order {
  id: number;
  total_price: string;
}

interface APIOrderItem {
  id: number;
  product_name: string; // Matches the backend response
  price: string;
  image: string;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  const [user, setUser] = useState<User | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderStatusMessage, setOrderStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("Order ID received:", orderId);
  
    if (!orderId) {
      setError("Invalid order ID. Please try again.");
      setLoading(false);
      return;
    }
  
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken"); // Retrieve token
  
        if (!authToken) {
          throw new Error("Missing authentication token. Please log in again.");
        }
  
        const headers = {
          headers: {
            Authorization: `Token ${authToken}`, // Include the token
          },
        };
  
        // Fetch User Data
        const userResponse = await api.get("/profile/", headers);
        setUser(userResponse.data);
  
        // Fetch Order Items
        const orderResponse = await api.get(`/order-items/${orderId}/`, headers);
        console.log("Order Items:", orderResponse.data);
  
        setOrderItems(
          orderResponse.data.map((item: APIOrderItem) => ({
            id: item.id,
            productName: item.product_name, // ✅ Correct API key
            price: item.price,
            image_Url: item.image, // ✅ Matches `OrderItem`
            quantity: item.quantity,
          }))
        );
  
        // Fetch Order Details
        const orderDetailsResponse = await api.get(`/orders/${orderId}/`, headers);
        setOrderDetails(orderDetailsResponse.data);
  
        setLoading(false);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching order details:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to fetch order details.");
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
        setLoading(false);
      }
    };
  
    fetchData();
  }, [orderId]);  

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert("Please enter a payment method.");
      return;
    }
  
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center text-white px-6">
      <h1 className="text-4xl font-bold mt-16 mb-10 text-gray-200">🛒 Checkout</h1>
  
      {/* Loading & Error Handling with Better Accessibility */}
      {loading ? (
        <p className="text-gray-400 text-lg" aria-live="polite">Loading order details...</p>
      ) : error ? (
        <p className="text-red-400 text-lg" aria-live="assertive">{error}</p>
      ) : (
        <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6 md:p-10">
          
          {/* User Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-200">User Information</h2>
            {user ? (
              <p className="text-gray-400">
                <strong>Full Name:</strong> {user.full_name} <br />
                <strong>Email:</strong> {user.email} <br />
                <strong>Cellphone Number:</strong> {user.cellphone_number} <br />
                <strong>Address:</strong> {user.complete_address}
              </p>
            ) : (
              <p className="text-gray-400">User details not available.</p>
            )}
          </div>
  
          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Order Details</h2>
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row justify-between border-b border-gray-700 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_Url?.startsWith("http") ? item.image_Url : `http://127.0.0.1:8000${item.image_Url}`}
                      alt={item.productName || "Product Image"}
                      className="w-20 h-20 object-cover rounded-md border border-gray-600"
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                    />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-200">{item.productName || "Unknown Product"}</h3>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-200">
                    ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No items in your order.</p>
            )}
          </div>
  
          {/* Order Summary */}
          <div className="flex justify-between mb-6 text-lg">
            <p className="text-gray-400">Total Price</p>
            <p className="text-xl font-semibold text-gray-200">
              ₱{orderDetails?.total_price ?? orderItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0).toFixed(2)}
            </p>
          </div>
  
          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Payment Method</h3>
            <input
              type="text"
              className="w-full p-3 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Enter payment method (e.g., Credit Card, PayPal, Bank Transfer)"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
  
          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-indigo-600 py-3 text-lg font-semibold text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Place Order
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg text-center w-96"> {/* Larger container */}
            <h2 className="text-lg font-semibold text-gray-700 mb-6">Are you sure?</h2>

            {/* Image in the center */}
            <div className="mb-6">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWAvzCqoI2tBKDLw34mY_VGc2Sn2ARoXHPNw&s"
                alt="User photo"
                className="w-40 h-40 object-cover square-full mx-auto"  // 2x2 size (around 128px x 128px)
              />
            </div>

            <div className="flex justify-around mt-6">
              <button
                onClick={async () => {
                  setShowConfirmationModal(false);
                  setOrderStatusMessage("Order Complete");
                  // You can still add your backend call here if you want after confirmation
                }}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  setOrderStatusMessage("Order Cancel");
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Order Status Message */}
      {orderStatusMessage && (
        <div className="mt-4 text-center text-lg text-gray-700">
          {orderStatusMessage === "Order Complete" ? (
            <p className="text-green-500">Your order has been placed successfully!</p>
          ) : (
            <p className="text-red-500">Your order has been canceled.</p>
          )}
        </div>
      )}
    </div>
  );  
};

export default CheckoutPage;
