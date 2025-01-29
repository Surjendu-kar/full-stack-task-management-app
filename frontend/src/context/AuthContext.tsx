import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: string | null;
  login: (token: string, username: string, isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    
    if (token && username) {
      setIsAuthenticated(true);
      setUser(username);
      setIsAdmin(adminStatus);
    }
  }, []);

  const login = (token: string, username: string, adminStatus: boolean) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('isAdmin', String(adminStatus));
    setIsAuthenticated(true);
    setUser(username);
    setIsAdmin(adminStatus);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 