import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useProduct, useCart } from "@/hooks/useProductHooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/services/axiosInstance";

const ProductPage: React.FC = () => {
  const { products, loading } = useProduct();
  const { addedStatus, handleAddToCart } = useCart();
  const [wishlistStatus, setWishlistStatus] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await api.get("/wishlist/", {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          const status = response.data.reduce((acc: any, item: any) => {
            acc[item.product?.id || item.product] = true;
            return acc;
          }, {});
          setWishlistStatus(status);
        }
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };

    fetchWishlistStatus();
  }, []);

  const handleAddToWishlist = async (product: any) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Please log in to manage your wishlist", { theme: "dark" });
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/wishlist/",
        { product: product.id },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setWishlistStatus((prevState) => ({
        ...prevState,
        [product.id]: true,
      }));
      toast.success(`${product.name} added to wishlist!`, { theme: "dark" });
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.", { theme: "dark" });
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        toast.error("Failed to add item to wishlist.", { theme: "dark" });
      }
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading products...</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products available.</p>;
  }

  return (
    <div className="product-page p-6 bg-gradient-to-r from-black via-gray-900 to-gray-700 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative bg-gray-900 border border-gray-700 rounded-2xl p-4"
          >
            <div className="absolute top-3 right-3">
              <button
                className={`p-1 ${
                  wishlistStatus[product.id]
                    ? "text-red-500"
                    : "text-gray-300"
                } bg-gray-800 rounded-full hover:text-red-400`}
                onClick={() => handleAddToWishlist(product)}
              >
                <Heart size={18} fill={wishlistStatus[product.id] ? "currentColor" : "none"} />
              </button>
            </div>
            <img
              src={product.image_url}
              alt={product.name || "Product image"}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <div>
              <h2 className="font-semibold text-white">{product.name}</h2>
              <p className="text-sm text-gray-400">{product.category}</p>
              <p className="text-sm text-gray-400">Size: {product.product_size}</p>
              <p className="text-sm text-gray-400">{product.description}</p>
              <p className="text-lg font-bold text-white mt-2">
                ₱ {product.price}
              </p>
              <p
                className={`text-sm mt-1 ${
                  product.stock > 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `In stock: ${product.stock}`
                  : "Out of stock"}
              </p>
            </div>
            <button
              className={`mt-4 w-full ${
                addedStatus[product.id]
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-300"
              } text-sm py-2 rounded-full`}
              onClick={() => handleAddToCart(product)}
              disabled={addedStatus[product.id]}
            >
              <ShoppingCart size={16} className="mr-1 inline" />
              {addedStatus[product.id] ? "Added" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Global toast container with dark theme */}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default ProductPage;
