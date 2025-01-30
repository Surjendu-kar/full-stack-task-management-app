import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
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

  return (
    <div className="flex justify-between items-center h-16 shadow-sm max-w-[1536px] mx-auto px-16 sticky top-0 z-50 bg-white">
      {/* Logo */}
      <div className="flex items-center hover:scale-105 transition-all duration-300">
        <Link to="/">
          <span className="text-xl font-bold">Restaurant</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-2">
        <Link
          to="/menu"
          className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          Menu
        </Link>
        {isAuthenticated && (
          <Link
            to="/orders"
            className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            Orders
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative hover:bg-gray-100 rounded-full p-2"
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
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
