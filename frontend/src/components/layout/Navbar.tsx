import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Restaurant App
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/menu" className="hover:text-gray-600">
              Menu
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <FiShoppingCart className="h-6 w-6" />
                </Link>
                <Link to="/orders" className="hover:text-gray-600">
                  Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-gray-600">
                    Admin
                  </Link>
                )}
                <span className="text-gray-600">{user}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
