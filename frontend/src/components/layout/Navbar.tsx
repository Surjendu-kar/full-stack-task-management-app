import { FiShoppingCart } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { Badge, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

function Navbar() {
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
    <div className="flex justify-between items-center h-16 shadow-sm max-w-[1536px] mx-auto px-16 mb-16">
      {/* Logo */}
      <div>
        <Link to="/" className="flex-shrink-0 flex items-center">
          <span className="text-xl font-bold">Restaurant</span>
        </Link>
      </div>

      <div className="flex  items-center">
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

      <div className="flex items-center">
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
    </div>
  );
}

export default Navbar;
