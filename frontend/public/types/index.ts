export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  availability: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
} 