'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  totalSpent: number;
  orderCount: number;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Ayşe Yılmaz',
  email: 'ayse.yilmaz@example.com',
  phone: '+90 532 123 45 67',
  tier: 'Vera VIP Diamond Müşteri',
  totalSpent: 14850,
  orderCount: 4,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('veraesarp_user_session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default demo user logged in
        setUser(DEFAULT_USER);
        localStorage.setItem('veraesarp_user_session', JSON.stringify(DEFAULT_USER));
      }
    } catch (e) {
      console.error('Failed to load user session', e);
      setUser(DEFAULT_USER);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = (email: string, pass: string): boolean => {
    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email.split('@')[0].toUpperCase().replace('.', ' ') || DEFAULT_USER.name,
    };
    setUser(loggedUser);
    localStorage.setItem('veraesarp_user_session', JSON.stringify(loggedUser));
    return true;
  };

  const register = (name: string, email: string, phone: string, pass: string): boolean => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || 'Yeni Üye',
      email: email,
      phone: phone || '+90 500 000 00 00',
      tier: 'Vera Silver Üye',
      totalSpent: 0,
      orderCount: 0,
    };
    setUser(newUser);
    localStorage.setItem('veraesarp_user_session', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veraesarp_user_session');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('veraesarp_user_session', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
