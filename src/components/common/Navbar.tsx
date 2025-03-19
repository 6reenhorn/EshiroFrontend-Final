import React, { useState, useEffect } from "react";
import Header from "./Header";
import { FiSearch, FiHeart, FiUser, FiBox, FiShoppingCart } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./Searchbar";

const Navbar: React.FC = () => {
  const location = useLocation(); // Get the current route
  const isCategoryPage = location.pathname.startsWith("/category"); // Check if on a category page

  const [isHeaderVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper functions to show/hide header

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("authToken");
      console.log("Stored Token:", storedToken); // Debugging line

      try {
        let parsedToken = null;

        // Handle cases where authToken is stored either as JSON or a plain string
        if (storedToken) {
          parsedToken =
            storedToken.startsWith("{")
              ? JSON.parse(storedToken) // Parse if it's JSON
              : { token: storedToken }; // Treat as plain token if not JSON
        }

        console.log("Parsed Token:", parsedToken); // Debugging line
        setIsAuthenticated(!!parsedToken?.token); // Set authentication state based on presence of a token
      } catch (error) {
        console.error("Error parsing authToken:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for changes to localStorage in other tabs/windows
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location]);

  // Log authentication state changes
  useEffect(() => {
    console.log("Auth state changed:", isAuthenticated); // Debugging: See if state updates
  }, [isAuthenticated]);

  return (
    <div
     
    >
      {/* Header */}
      <Header isVisible={isHeaderVisible} />
      <nav
        className={`${
          isCategoryPage
            ? "bg-gradient-to-r from-black via-gray-900 to-gray-700 shadow-lg"
            : "bg-gradient-to-r from-black via-gray-900 to-gray-700"
        } fixed top-0 left-0 w-full p-4 flex items-center justify-between text-primary-foreground z-20`}
      >
        {/* Left Section (Logo) */}
        <div className="flex-1 flex justify-start ml-4 md:ml-20">
          <img
            src="https://i.imghippo.com/files/EKJR1736yTo.png"
            alt="Éshiro Flex"
            className="h-8"
          />
          <Link to="/" className="text-2xl font-roboto text-white ml-2">
            Éshiro Flex
          </Link>
        </div>

        {/* Right Section (Icons) */}
        <ul className="flex space-x-6 mr-4 md:mr-20">
          {/* Search Button */}
          <li>
            <button onClick={() => setIsSearchVisible(true)} aria-label="Open Search Bar">
              <FiSearch size={20} color="white" />
            </button>
          </li>
          {/* Products Link */}
          <li>
            <Link to="/product" title="Products">
              <FiBox size={20} color="white" />
            </Link>
          </li>
          {/* Wishlist Link */}
          <li>
            <Link to="/wishlist" title="Wishlist">
              <FiHeart size={20} color="white" />
            </Link>
          </li>
          {/* Cart Link */}
          <li>
            <Link to="/cart" title="Cart">
              <FiShoppingCart size={20} color="white" />
            </Link>
          </li>
          {/* Profile/Login Link */}
          <li>
            <Link to={isAuthenticated ? "/profile" : "/login"} title="Profile">
              <FiUser size={20} color="white" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Search Bar */}
      {isSearchVisible && (
        <SearchBar isVisible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />
      )}
    </div>
  );
};

export default Navbar;