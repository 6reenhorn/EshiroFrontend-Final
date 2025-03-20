import { useState, useEffect } from "react";
import api from "../../api/services/axiosInstance";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  product_name: string;
  product_image: string;
  quantity: number;
  price: string;
}

interface PaymentInfo {
  mode_of_payment: string;
  status: string;
  created_at: string;
}

interface Order {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment_info: PaymentInfo[];
}

const TransactionPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
          throw new Error("Missing authentication token. Please log in again.");
        }
        
        const response = await api.get("/order-history/", {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError("Failed to load transaction history.");
        setLoading(false);
      }
    };
    
    fetchOrderHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-800 text-green-200';
      case 'cancelled':
        return 'bg-red-800 text-red-200';
      case 'processing':
        return 'bg-blue-800 text-blue-200';
      default:
        return 'bg-yellow-800 text-yellow-200';
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order === selectedOrder ? null : order);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center text-4xl font-bold mb-10 text-gray-200">
          <h1>Transaction History</h1>
        </div>
        
        {error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-400 text-xl">You haven't placed any orders yet.</p>
            <button 
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
              onClick={() => navigate('/product')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:bg-gray-750"
                onClick={() => handleOrderClick(order)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-200">Order #{order.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-400">
                    <p>Date: {formatDate(order.created_at)}</p>
                    <p className="text-gray-200 font-semibold">₱{parseFloat(order.total_price).toFixed(2)}</p>
                  </div>
                  
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 space-y-6 border-t border-gray-700 pt-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">Order Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 bg-gray-850 rounded-lg p-3">
                              <img 
                                src={item.product_image || "/placeholder.jpg"} 
                                alt={item.product_name} 
                                className="w-16 h-16 object-cover rounded-md border border-gray-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                }}
                              />
                              <div className="flex-grow">
                                <p className="text-gray-200 font-medium">{item.product_name}</p>
                                <p className="text-gray-400">Quantity: {item.quantity}</p>
                              </div>
                              <p className="text-gray-200 font-semibold">
                                ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {order.payment_info.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-300 mb-3">Payment Details</h3>
                          <div className="bg-gray-850 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-2 text-gray-400">
                              <p>Method:</p>
                              <p className="text-gray-200">{order.payment_info[0].mode_of_payment}</p>
                              <p>Status:</p>
                              <p className="text-gray-200">{order.payment_info[0].status}</p>
                              <p>Date:</p>
                              <p className="text-gray-200">{formatDate(order.payment_info[0].created_at)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                        <span className="text-gray-400">Last Updated: {formatDate(order.updated_at)}</span>
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                          Need Help?
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder?.id !== order.id && (
                    <div className="mt-2 text-indigo-400 text-sm">
                      Click to view details
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;