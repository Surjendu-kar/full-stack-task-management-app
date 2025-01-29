import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from "@mui/material";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">Restaurant</span>
          </Link>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Button component={Link} to="/menu" color="inherit">
              Menu
            </Button>
            {isAuthenticated && (
              <Button component={Link} to="/orders" color="inherit">
                Orders
              </Button>
            )}
            {isAdmin && (
              <Button component={Link} to="/admin" color="inherit">
                Admin
              </Button>
            )}
          </div>
          <div className="flex items-center ml-auto">
            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={items.length} color="error">
                <FiShoppingCart className="h-6 w-6" />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <FiUser className="h-6 w-6" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem disabled>{user}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                className="ml-3"
              >
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
