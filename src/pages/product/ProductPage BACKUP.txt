import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useProduct, useWishlist, useCart } from "@/hooks/useProductHooks";

const ProductPage: React.FC = () => {
  const { products, loading } = useProduct();
  const { wishlistStatus, handleAddToWishlist } = useWishlist();
  const { addedStatus, handleAddToCart } = useCart();

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
                  wishlistStatus[product.name]
                    ? "text-red-500"
                    : "text-gray-300"
                } bg-gray-800 rounded-full hover:text-red-400`}
                onClick={() => handleAddToWishlist(product)}
              >
                <Heart size={18} />
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
    </div>
  );
};

export default ProductPage;
