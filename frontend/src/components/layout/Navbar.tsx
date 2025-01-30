import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex justify-between items-center h-16 shadow-sm max-w-[1536px] mx-auto px-16 sticky top-0 z-50 bg-white">
      {/* Logo */}
      <div className="flex items-center hover:scale-105 transition-all duration-300">
        <Link to="/">
          <span className="text-xl font-bold">Restaurant</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 font-medium">
        <Link
          to="/menu"
          className={` rounded-md transition-colors hover:text-indigo-600 ${
            isActivePath("/menu") ? "text-indigo-600" : "text-gray-700"
          }`}
        >
          Menu
        </Link>
        {isAuthenticated && (
          <Link
            to="/orders"
            className={` rounded-md transition-colors hover:text-indigo-600 ${
              isActivePath("/orders") ? "text-indigo-600" : "text-gray-700"
            }`}
          >
            Orders
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            className={` rounded-md transition-colors hover:text-indigo-600 ${
              isActivePath("/admin") ? "text-indigo-600" : "text-gray-700"
            }`}
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Cart Icon */}
        <Link
          to="/cart"
          className={`relative p-2 rounded-full transition-colors hover:text-indigo-600 ${
            isActivePath("/cart") ? "text-indigo-600" : "text-gray-700"
          }`}
        >
          <FiShoppingCart className="h-6 w-6" />
          {items.length > 0 && (
            <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            {/* User Icon */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full transition-colors hover:text-indigo-600 text-gray-700"
            >
              <FiUser className="h-6 w-6" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                  {user}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
