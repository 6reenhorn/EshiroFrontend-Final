import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/services/axiosInstance"; // Import the axios instance

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  product_size?: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center text-white">No product found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="p-6 max-w-3xl bg-gray-800 text-white rounded-lg shadow-lg">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-4 border border-gray-700"
          />
        )}

        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-400">{product.description || "No description available"}</p>

        <div className="mt-4">
          <p className="text-lg font-semibold">Price: <span className="text-green-400">₱ {product.price}</span></p>
          <p className="text-sm text-gray-300">Stock: {product.stock} items</p>
          {product.product_size && <p className="text-sm text-gray-300">Size: {product.product_size}</p>}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
