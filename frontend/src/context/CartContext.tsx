import { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem, CartItem } from "../../public/types";

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (menuItem: MenuItem, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.menuItem._id === menuItem._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.menuItem._id === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { menuItem, quantity }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.menuItem._id !== menuItemId)
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.menuItem._id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
