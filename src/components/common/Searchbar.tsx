import React, { useEffect, useRef, useCallback, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/services/axiosInstance"; // Import axios instance

interface Product {
  id: number;
  name: string;
}

interface SearchBarProps {
  isVisible: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onClose }) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // For navigation
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce function to optimize API calls
  const debounce = useCallback((func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Fetch products dynamically based on search input
  const fetchProducts = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setProducts([]); // Clear results for short queries
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using axios instance for API call
      const response = await api.get(`/search/?q=${searchTerm}`);
      const data = response.data;

      if (!Array.isArray(data)) throw new Error("Invalid data format from API");

      setProducts(data); // Update the products state
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProducts([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchProducts
  const debouncedFetchProducts = useCallback(
    debounce((value: string) => {
      fetchProducts(value);
    }, 300),
    [debounce]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchProducts(value);
  };

  // Handle clicking outside the search bar to close it
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  // Add and remove event listener based on visibility
  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, handleClickOutside]);

  if (!isVisible) return null;

  return (
    <div
      ref={searchRef}
      className="fixed top-3 left-1/2 transform -translate-x-1/2 w-2/3 sm:w-1/3 
                 bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl flex flex-col px-3 py-2 
                 border border-white/20 z-50 overflow-hidden"
    >
      <div className="flex items-center w-full relative">
        <FiSearch size={18} className="text-white/80 absolute left-3" strokeWidth={3.5} />
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search input"
          value={query}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-3 py-2 text-sm text-white placeholder-white/60 bg-transparent 
                     rounded-full outline-none border-none focus:ring-2 focus:ring-white/40"
          aria-live="polite"
        />
      </div>

      {/* Search Results */}
      {loading && <p className="text-white text-sm text-center mt-2">Loading...</p>}

      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {products.length > 0 && !loading && (
        <ul
          className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg 
                     max-h-48 overflow-auto shadow-lg"
        >
          {products.map((product) => (
            <li
              key={product.id}
              className="p-2 text-white hover:bg-gray-700 cursor-pointer transition-colors duration-150"
              onClick={() => {
                navigate(`/products/${product.id}`); // Navigate to product details page
                onClose(); // Close search bar after clicking
              }}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}

      {!loading && query.length > 1 && products.length === 0 && (
        <p className="text-white text-sm text-center mt-2">No products found.</p>
      )}
    </div>
  );
};

export default SearchBar;
