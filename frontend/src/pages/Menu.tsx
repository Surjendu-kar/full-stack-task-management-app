import { useState, useEffect } from "react";
import { MenuItem } from "../../public/types";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

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
    addItem(menuItem, 1);
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
        {menuItems.map((item) => (
          <div key={item._id} className="group relative w-full">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xl">{item.name}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex flex-col">
                <h3 className="text-sm text-gray-900 capitalize font-medium">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">${item.price}</p>
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!item.availability}
              className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer 
                ${
                  item.availability
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {item.availability ? "Add to Cart" : "Not Available"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
