interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  availability: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}
