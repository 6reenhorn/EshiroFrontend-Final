import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../hooks/cartTypes";
import api from "@/api/services/axiosInstance";

interface CartPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart items from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Adjust based on where you store it
        console.log("Stored Token:", token);
        if (!token) {
          setError("Authentication required. Please log in.");
          return;
        }
    
        const response = await api.get("/cart/", {
          headers: {
            Authorization: `Token ${token}`, // If using JWT
          },
        });
    
        console.log("Cart API Response:", response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [setCartItems]);

  // Handle quantity change
  const handleQuantityChange = async (id: number, increment: boolean) => {
    try {
      const updatedQuantity = cartItems.find((item) => item.id === id)?.quantity || 1;
      const newQuantity = Math.max(1, updatedQuantity + (increment ? 1 : -1));

      await api.put(`/cart/${id}/`, { quantity: newQuantity });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  
  // Handle selection
  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  
  // Handle remove from cart
  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/cart/${id}/`);

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSelectedItems((prevSelected) => prevSelected.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Handle Checkout
  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem("user_id");
  
      if (!userId) {
        console.error("User ID missing:", userId);
        alert("Missing authentication details.");
        return;
      }
  
      // Send the total price along with the order data
      const orderResponse = await api.post("/orders/", {
        user_id: userId,
        total_price: total,  // Send the calculated total price
      });
  
      const orderId = orderResponse.data.id;
      console.log("Order Created:", orderId);
  
      // Navigate to checkout page with orderId
      console.log("Navigating to checkout with orderId:", orderId);
      navigate("/checkout", { state: { orderId } });
  
      // Add selected items to the order
      await Promise.all(
        selectedItems.map(async (cartItemId) => {
          const item = cartItems.find((item) => item.id === cartItemId); // Find item by cart ID
          if (item) {
            await api.post("/order-items/create/", {
              order_id: orderId,
              product_id: item.product_id, // Use the correct product_id
              quantity: item.quantity,
            });
          }
        })
      );
  
      console.log("All selected items added to order.");
  
      // Remove selected items from the cart
      setCartItems((prevItems) =>
        prevItems.filter((item) => !selectedItems.includes(item.id))
      );
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const total: number = selectedItems.reduce((acc, id) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? acc + parseFloat(item.price) * item.quantity : acc;
  }, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center text-white px-6">
      <h1 className="text-4xl font-bold mt-16 mb-10 text-gray-200">🛒 Your Shopping Cart</h1>
  
      {loading ? (
        <p className="text-gray-400 text-lg">Loading cart...</p>
      ) : error ? (
        <p className="text-red-400 text-lg">{error}</p>
      ) : (
        <div className="w-full max-w-[100rem] flex gap-12">
          
          {/* 🛍️ Extra-Wide Cart Items */}
          <div className="w-4/5 bg-gray-900 rounded-lg shadow-lg p-10">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-[auto_7rem_1fr_auto_auto_auto] items-center border-b border-gray-700 py-6 gap-x-6"
                >
                  {/* ✅ Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-6 h-6 text-indigo-500 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500"
                  />
  
                  {/* 🖼 Product Image */}
                  <img
                    src={item.image_Url && item.image_Url.startsWith("http") 
                      ? item.image_Url 
                      : "/fallback-image.png"}
                    alt={item.productName || "Product Image"}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
  
                  {/* 🏷 Product Name */}
                  <h2 className="text-xl font-semibold text-gray-200">{item.productName}</h2>
  
                  {/* 🔢 Quantity Selector (Centered) */}
                  <div className="flex items-center justify-center space-x-4">
                    <button 
                      onClick={() => handleQuantityChange(item.id, false)} 
                      className="w-12 h-12 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-2xl"
                    >
                      −
                    </button>
                    <span className="text-2xl font-semibold text-gray-200 w-12 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, true)} 
                      className="w-12 h-12 flex items-center justify-center bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-2xl"
                    >
                      +
                    </button>
                  </div>
  
                  {/* 💰 Price */}
                  <p className="text-gray-200 font-semibold text-xl w-24 text-center">
                    ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                  
                  {/* ❌ Remove Button */}
                  <button onClick={() => handleRemove(item.id)} className="text-red-400 hover:text-red-500 text-3xl">
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xl text-center">Your cart is empty.</p>
            )}
          </div>
  
          {/* 📦 Order Summary */}
            <div className="w-1/5 bg-gray-900 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-200 mb-6">Order Summary</h3>
            <p className="text-gray-400 text-lg">Subtotal</p>
            <p className="text-gray-200 font-semibold text-2xl">₱{total.toFixed(2)}</p>
            <button 
              onClick={handleCheckout} 
              className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;