import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import dayjs from "dayjs";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg">
        <p className="text-gray-500">You haven't placed any orders yet</p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
        >
          Order Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      <div className="flex flex-col gap-8 justify-between">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow overflow-hidden sm:rounded-lg w-[800px]"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Id: {order._id}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {dayjs(order.createdAt).format("MMMM D, YYYY h:mm A")}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Status: <span className="font-medium">{order.status}</span>
              </p>
            </div>

            <div className="flex flex-col border-t border-gray-200">
              {order.items.map((item) => (
                // item & price
                <div
                  key={item.menuItem._id}
                  className="px-4 py-3 flex justify-between"
                >
                  <p className="text-sm font-medium text-black capitalize">
                    {item.menuItem.name}
                  </p>
                  <p className=" text-sm text-black font-medium">
                    {item.quantity} x ${item.menuItem.price} = $
                    {item.quantity * item.menuItem.price}
                  </p>
                </div>
              ))}
              {/* total */}
              <div className="px-4 py-3 flex justify-between bg-gray-50">
                <p className="text-sm font-medium text-black">Total</p>
                <p className=" text-sm font-medium text-black">
                  ${order.totalAmount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
