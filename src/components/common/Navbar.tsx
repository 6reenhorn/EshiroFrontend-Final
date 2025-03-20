import React, { useState, useEffect } from "react";
import Header from "./Header";
import { FiSearch, FiHeart, FiUser, FiBox, FiShoppingCart, FiFileText } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./Searchbar";

const Navbar: React.FC = () => {
  const location = useLocation(); 
  const isCategoryPage = location.pathname.startsWith("/category");

  const [isHeaderVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("authToken");

      try {
        let parsedToken = null;

        if (storedToken) {
          parsedToken =
            storedToken.startsWith("{")
              ? JSON.parse(storedToken)
              : { token: storedToken };
        }

        setIsAuthenticated(!!parsedToken?.token);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location]);

  return (
    <div>
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
          <Link
            to="/"
            className="text-2xl font-roboto text-white ml-2 hover:text-blue-500 transition duration-300 transform hover:scale-105"
          >
            Éshiro Flex
          </Link>
        </div>

        {/* Right Section (Icons) */}
        <ul className="flex space-x-6 mr-4 md:mr-20">
          <li>
            <button
              onClick={() => setIsSearchVisible(true)}
              className="text-white"
              aria-label="Open Search Bar"
            >
              <FiSearch size={20} />
            </button>
          </li>
          <li>
            <Link
              to="/product"
              className={`${
                location.pathname === "/product" ? "text-blue-500" : "text-white"
              }`}
              title="Products"
            >
              <FiBox size={20} />
            </Link>
          </li>
          <li>
            <Link
              to="/wishlist"
              className={`${
                location.pathname === "/wishlist" ? "text-red-500" : "text-white"
              }`}
              title="Wishlist"
            >
              <FiHeart size={20} />
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={`${
                location.pathname === "/cart" ? "text-blue-500" : "text-white"
              }`}
              title="Cart"
            >
              <FiShoppingCart size={20} />
            </Link>
          </li>

          {/* Transaction History Icon */}
          <li>
            <Link
              to="/history"
              className={`${
                location.pathname === "/history" ? "text-yellow-500" : "text-white"
              }`}
              title="Transaction History"
            >
              <FiFileText size={20} />
            </Link>
          </li>

          <li>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className={`${
                location.pathname === (isAuthenticated ? "/profile" : "/login")
                  ? "text-blue-500"
                  : "text-white"
              }`}
              title="Profile"
            >
              <FiUser size={20} />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Search Bar */}
      {isSearchVisible && (
        <SearchBar
          isVisible={isSearchVisible}
          onClose={() => setIsSearchVisible(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
