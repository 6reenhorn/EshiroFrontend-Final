import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/common/Navbar";
import HeroSection from "../ui/HeroSection";
import WhatsNew from "./product/WhatsNew";
import ProductCard from "../ui/ProductCard";
import LoginPage from "./authentication/LoginPage";
import SignUpPage from "./authentication/SignUpPage";
import CartPage from "./cart/CartPage";
import UserProfile from "./user/UserProfile";
import CheckoutPage from "./cart/CheckoutPage";
import Wishlist from "./cart/Wishlists";
import { fetchProducts } from "../api/services/apiService"; // Import API call function
import ProductPage from "./product/ProductPage";
import { WishlistItem } from "../hooks/wishlistTypes"; // Adjust the path accordingly
import { CartItem } from "../hooks/cartTypes";


// Product interface
interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string;
  product_size: string;
  created_at: string;
}


const AestheticShop: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);




  // Fetch products from backend
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(); // Fetch data from API
        setProducts(data); // Update state with fetched products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Handle Add to Wishlist
  const handleAddToWishlist = (item: Product) => {
    setWishlistItems((prevItems) => {
      if (!prevItems.find((wishlistItem) => wishlistItem.id === item.id)) {
        return [
          ...prevItems,
          {
            id: item.id,
            product: item.id, // Assuming `product` is the product ID
            product_name: item.name,
            product_price: item.price,
            product_image: item.image_url,
            store_name: "Default Store", // Change based on your data
          },
        ];
      }
      return prevItems;
    });
  };    

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-gray-700 text-gray-100 min-h-screen flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="dark"
      />

      {/* Navbar */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <WhatsNew />
                {loading ? (
                  <p className="text-center text-gray-300">Loading products...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 mt-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        imageSrc={product.image_url}
                        productName={product.name}
                        price={product.price}
                        onAddToWishlist={() => handleAddToWishlist(product)}
                      />
                    ))}
                  </div>
                )}
              </>
            }
          />
          {/* Other Routes */}
          <Route path="/shop" element={<AestheticShop />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/wishlist"
            element={<Wishlist wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="*"
            element={<div className="text-center text-gray-200 py-20">Page Not Found</div>}
          />
        </Routes>
      </div>

      {/* Footer */}
    </div>
  );
};

export default AestheticShop;