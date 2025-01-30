import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QuantityControls from "../components/QuantityControls";

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get("/menu");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (menuItem: MenuItem) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem(menuItem, 1);
  };

  const handleQuantityChange = (menuItem: MenuItem, quantity: number) => {
    if (quantity < 1) {
      removeItem(menuItem._id);
      return;
    }
    updateQuantity(menuItem._id, quantity);
  };

  const getItemQuantity = (menuItemId: string) => {
    const cartItem = items.find((item) => item.menuItem._id === menuItemId);
    return cartItem?.quantity || 0;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {/* <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Our Menu
      </h2> */}

      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {menuItems.map((item) => {
          const quantity = getItemQuantity(item._id);

          return (
            <div key={item._id} className="group relative w-full">
              {/* Image */}
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl">{item.name}</span>
                </div>
              </div>

              {/* Name and Category */}
              <div className="my-4 flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-md text-gray-900 capitalize font-medium">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <QuantityControls
                quantity={quantity}
                onQuantityChange={(newQuantity: number) =>
                  handleQuantityChange(item, newQuantity)
                }
                showAddToCart={true}
                onAddToCart={() => handleAddToCart(item)}
                isAvailable={item.availability}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
