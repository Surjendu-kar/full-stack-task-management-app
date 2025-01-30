import { useState, useEffect } from "react";
import api from "../services/api";
import { Order } from "../../public/types";
import dayjs from "dayjs";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      <div className="flex flex-wrap gap-8 justify-between">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow overflow-hidden sm:rounded-lg w-[650px]"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order #{order._id}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {dayjs(order.createdAt).format("MMMM D, YYYY h:mm A")}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Status: <span className="font-medium">{order.status}</span>
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {order.items.map((item) => (
                  <div
                    key={item.menuItem._id}
                    className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt className="text-sm font-medium text-gray-500">
                      {item.menuItem.name}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {item.quantity} x ${item.menuItem.price} = $
                      {item.quantity * item.menuItem.price}
                    </dd>
                  </div>
                ))}
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">Total</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                    ${order.totalAmount}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
