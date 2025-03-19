import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/api/services/axiosInstance";
import { Product, CartItem } from "../types/product";

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { products, loading, setProducts };
};

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]);
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({});

  const handleAddToWishlist = async (product: Product) => {
    if (!wishlistStatus[product.name]) {
      try {
        const response = await api.post("/wishlist/", { product: product.id });
        console.log(response.data);

        const item: CartItem = {
          id: product.id.toString(),
          productName: product.name,
          price: product.price.toString(),
          imageSrc: product.image_url,
          quantity: 1,
        };

        const updatedWishlist = [...wishlistItems, item];
        setWishlistItems(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        setWishlistStatus((prevStatus) => ({
          ...prevStatus,
          [product.name]: true,
        }));

        toast.success(`${product.name} added to wishlist!`);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add product to wishlist.");
      }
    } else {
      toast.info(`${product.name} is already in your wishlist!`);
    }
  };

  return { wishlistItems, wishlistStatus, handleAddToWishlist };
};

export const useCart = () => {
  const [addedStatus, setAddedStatus] = useState<Record<number, boolean>>({});

  const handleAddToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      const response = await api.post(
        "/cart/add/",
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(`${product.name} added to cart!`);
        setAddedStatus((prev) => ({ ...prev, [product.id]: true }));
      }
    } catch (error: any) {
      console.error("Error adding product to cart:", error);
      const errorMsg = error.response?.data?.error || "Failed to add to cart";
      toast.error(errorMsg);
    }
  };

  return { addedStatus, handleAddToCart };
};
