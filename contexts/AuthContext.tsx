import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserSettings } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void;
  updateSettings: (newSettings: UserSettings) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setIsLoading(true);
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = await api.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const newUser = await api.register(name, email, password);
    if (newUser) {
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateUser = (newUserData: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        api.updateProfile(user.id, newUserData);
    }
  };

  const updateSettings = (newSettings: UserSettings) => {
    if (user) {
      updateUser({ settings: newSettings });
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
