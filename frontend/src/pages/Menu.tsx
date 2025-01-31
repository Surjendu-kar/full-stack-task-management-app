import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QuantityControls from "../components/QuantityControls";
import { FiSearch } from "react-icons/fi";

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Add debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get("/menu", {
          params: {
            category: selectedCategory === "all" ? undefined : selectedCategory,
            ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
          },
        });
        setMenuItems(data?.items ?? []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories([{ _id: "all", name: "All" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    fetchMenu();
  }, [debouncedSearchQuery, selectedCategory]);

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
    <div className="flex gap-6">
      {/* Category Sidebar */}
      <div className="w-64 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 text-left rounded-md transition-colors cursor-pointer ${
                selectedCategory === category._id
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
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
                    <p className="mt-1 text-sm text-gray-500">
                      {item.category.name}
                    </p>
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

        {/* No Results Message */}
        {!menuItems.length && (
          <div className="text-center py-10">
            <p className="text-gray-500">No menu items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
