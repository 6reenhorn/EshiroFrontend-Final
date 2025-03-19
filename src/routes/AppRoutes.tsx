import React from "react";
import { Route, Routes } from "react-router-dom";
import AestheticShop from "../pages/AestheticShop";
import ProductDetails from "../pages/product/ProductDetails";
import CartPage from "../pages/cart/CartPage";
import Wishlists from "../pages/cart/Wishlists";
import LoginPage from "../pages/authentication/LoginPage";
import ProductPage from "../pages/product/ProductPage";
import SignUpPage from "../pages/authentication/SignUpPage";
import UserProfile from "../pages/user/UserProfile";
import WhatsNew from "../pages/product/WhatsNew";
import CheckoutPage from "../pages/cart/CheckoutPage";
import type { CartItem } from "../hooks/cartTypes";
import type { WishlistItem } from "../hooks/wishlistTypes";

interface AppRoutesProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlistItems: WishlistItem[];
  setWishlistItems: React.Dispatch<React.SetStateAction<WishlistItem[]>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ 
  cartItems, 
  setCartItems, 
  wishlistItems, 
  setWishlistItems 
}) => {
  return (
    <Routes>
      <Route path="/" element={<AestheticShop />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
      <Route path="/wishlist" element={<Wishlists wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/whats-new" element={<WhatsNew />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
};

export default AppRoutes;

export const shouldHideNavbar = (pathname: string): boolean => {
  return pathname === "/login" || pathname === "/signup";
};