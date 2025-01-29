import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (menuItemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(menuItemId, quantity);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      }));

      await api.post("/orders", { items: orderItems });
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Shopping Cart
      </h2>
      <div className="mt-8">
        {items.map((item) => (
          <div
            key={item.menuItem._id}
            className="flex items-center justify-between py-4 border-b"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {item.menuItem.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ${item.menuItem.price}
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() =>
                  handleQuantityChange(item.menuItem._id, item.quantity - 1)
                }
                className="px-2 py-1 border rounded-l"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  handleQuantityChange(item.menuItem._id, item.quantity + 1)
                }
                className="px-2 py-1 border rounded-r"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.menuItem._id)}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="mt-8">
          <div className="flex justify-between text-xl font-medium text-gray-900">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-8 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
