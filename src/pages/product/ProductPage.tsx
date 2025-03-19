import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/services/axiosInstance"; // Import the axios instance

// Define the Product interface
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

interface CartItem {
  id: string;
  productName: string;
  price: string;
  imageSrc: string;
  quantity: number;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedStatus, setAddedStatus] = useState<Record<number, boolean>>({}); // Track each product's added status to cart
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({}); // Track each product's wishlist status
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]); // Define type for wishlistItems

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add product to wishlist
  const handleAddToWishlist = async (product: Product) => {
    if (!wishlistStatus[product.name]) {
      try {
        const response = await api.post("/wishlist/", { product: product.id });
        console.log(response.data);

        const item: CartItem = {
          id: product.id.toString(),  // Convert product.id to string
          productName: product.name,
          price: product.price.toString(),  // Convert price to string
          imageSrc: product.image_url,
          quantity: 1,
        };

        const updatedWishlist = [...wishlistItems, item];
        setWishlistItems(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

        setWishlistStatus((prevStatus) => ({
          ...prevStatus,
          [product.name]: true,
        }));

        toast.success(`${product.name} added to wishlist!`);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        toast.error('Failed to add product to wishlist.');
      }
    } else {
      toast.info(`${product.name} is already in your wishlist!`);
    }
  };

  // Add product to cart
  const handleAddToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("authToken");
    
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }
    
      // Change the endpoint from /cart/ to /cart/add/
      const response = await api.post(
        "/cart/add/",
        {
          product_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    
      if (response.status === 201 || response.status === 200) {
        toast.success(`${product.name} added to cart!`);
        setAddedStatus((prev) => ({
          ...prev,
          [product.id]: true
        }));
      }
    } catch (error: any) {
      console.error("Error adding product to cart:", error);
      
      // Better error handling
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || "Failed to add to cart";
        toast.error(errorMsg);
      } else {
        toast.error("Failed to add product to cart. Please try again.");
      }
    }
  };
  
  // Fallback for loading or no products
  if (loading) {
    return <p className="text-center text-white">Loading products...</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products available.</p>;
  }


  return (
      <div className="product-page p-6 bg-gradient-to-r from-black via-gray-900 to-gray-700 min-h-screen">
      {/* Product Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative bg-gray-900 border border-gray-700 rounded-2xl p-4"
          >
  
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <button
                className={`p-1 ${
                  wishlist.includes(product.id)
                    ? "text-red-500"
                    : "text-gray-300"
                } bg-gray-800 rounded-full hover:text-red-400`}
                onClick={() => handleAddToWishlist(product)}
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Product Image */}
            <img
              src={product.image_url}
              alt={product.name || "Product image"}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />

            {/* Product Details */}
            <div>
              <h2 className="font-semibold text-white">{product.name}</h2>
              <p className="text-sm text-gray-400">{product.category}</p>
              <p className="text-sm text-gray-400">
                Size: {product.product_size}
              </p>
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

              {/* Add to Cart Button */}
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
    </div>
  );
};

export default ProductPage;
