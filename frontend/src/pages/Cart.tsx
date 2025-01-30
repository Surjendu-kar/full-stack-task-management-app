import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import api from "../services/api";
import QuantityControls from "../components/shared/QuantityControls";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (menuItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(menuItemId);
      return;
    }
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
      <div className="text-center py-10 bg-white rounded-lg">
        <p className="text-gray-500">Your cart is empty</p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col">
          {items.map((item) => (
            <div
              key={item.menuItem._id}
              className="flex gap-4 bg-white p-4 rounded-lg w-[700px]"
            >
              {/* Image placeholder - replace with actual image if available */}
              <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex-shrink-0" />

              <div className="flex flex-col flex-grow gap-2">
                {/* Item details */}
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold capitalize">{item.menuItem.name}</p>
                    <p className="text-gray-500 text-sm">
                      ${item.menuItem.price.toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-bold">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex justify-between items-center mt-auto">
                  <QuantityControls
                    quantity={item.quantity}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(item.menuItem._id, newQuantity)
                    }
                  />
                  <button
                    onClick={() => removeItem(item.menuItem._id)}
                    className="text-red-400 hover:text-red-600 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total and Checkout */}
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg">
          <div className="flex justify-between text-xl font-bold">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-indigo-600 text-white rounded-md py-3 px-8 font-medium hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
