import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/services/axiosInstance";

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

interface ProductCardProps {
  id: number;
  imageSrc: string;
  productName: string;
  price: string;
  onAddToWishlist: (item: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageSrc,
  productName,
  price,
  onAddToWishlist,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  // Check if product is already in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await api.get("/wishlist/", {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        // Safely check if this product is in the wishlist
        if (response.data && Array.isArray(response.data)) {
          const isInWishlist = response.data.some(
            (item) => item.product === id || (item.product && item.product.id === id)
          );
          setIsWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [id]);

  const handleAddToWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("authToken");
    
    if (!authToken) {
      toast.error("Please log in to manage your wishlist");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/wishlist/",
        { product: id },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      const item: Product = {
        id,
        category: "Category",
        name: productName,
        description: "Product Description",
        price,
        stock: 10,
        image_url: imageSrc,
        product_size: "M",
        created_at: new Date().toISOString(),
      };

      onAddToWishlist(item);
      setIsWishlisted(true);
      toast.success(`${productName} added to wishlist!`);
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        toast.error("Failed to add item to wishlist.");
      }
    }
  };

  const handleWishlistPageRedirect = () => {
    navigate("/wishlist");
  };

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-4">
      {/* Wishlist & Swap Buttons */}
      <div className="absolute top-3 right-3 flex space-x-2">
        <button
          className={`p-1 ${
            isWishlisted ? "text-red-500" : "text-gray-300"
          } bg-gray-800 rounded-full hover:text-red-400`}
          onClick={handleAddToWishlist}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <button
          className="p-1 text-gray-300 bg-gray-800 rounded-full hover:text-gray-400"
          onClick={handleWishlistPageRedirect}
        >
          ⇅
        </button>
      </div>

      {/* Product Image */}
      <img
        src={imageSrc}
        alt={productName}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />

      {/* Product Details */}
      <div>
        <h2 className="font-semibold text-white">{productName}</h2>
        <p className="text-sm text-gray-400">Éshiro Shoes</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-white">₱ {price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;