'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'admin' | 'customer';
  isAdmin?: boolean;
  tier: string;
  totalSpent: number;
  orderCount: number;
  avatar?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  registeredUsers: UserProfile[];
  login: (emailOrPhone: string, pass: string) => AuthResult;
  register: (name: string, email: string, phone: string, pass: string) => AuthResult;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

// Initial Registered Demo Users in Database
const DEFAULT_REGISTERED_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Vera Mağaza Yöneticisi',
    email: 'destek@veraesarp.com',
    phone: '+90 212 555 83 72',
    password: '123456',
    role: 'admin',
    isAdmin: true,
    tier: 'Vera Yönetici',
    totalSpent: 0,
    orderCount: 0,
  },
  {
    id: 'usr-1',
    name: 'Ayşe Yılmaz',
    email: 'ayse.yilmaz@example.com',
    phone: '+90 532 123 45 67',
    password: '123456',
    role: 'customer',
    isAdmin: false,
    tier: 'Vera VIP Diamond Müşteri',
    totalSpent: 14850,
    orderCount: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'usr-3',
    name: 'Demo Müşteri',
    email: 'demo@veraesarp.com',
    phone: '+90 555 000 00 00',
    password: '123456',
    role: 'customer',
    isAdmin: false,
    tier: 'Vera Silver Üye',
    totalSpent: 1890,
    orderCount: 1,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(DEFAULT_REGISTERED_USERS);

  // Load Saved Users & Active Session from Storage
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('veraesarp_registered_users');
      if (savedUsers) {
        setRegisteredUsers(JSON.parse(savedUsers));
      } else {
        localStorage.setItem('veraesarp_registered_users', JSON.stringify(DEFAULT_REGISTERED_USERS));
      }

      const savedSession = localStorage.getItem('veraesarp_user_session');
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to load user database', e);
      setUser(null);
    }
  }, []);

  // Synchronize registered Users array to localStorage
  const saveRegisteredUsers = (usersList: UserProfile[]) => {
    setRegisteredUsers(usersList);
    try {
      localStorage.setItem('veraesarp_registered_users', JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to save registered users', e);
    }
  };

  // 1. Credentials Login Verification
  const login = (emailOrPhone: string, pass: string): AuthResult => {
    const cleanInput = (emailOrPhone || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanInput || !cleanPass) {
      return { success: false, message: 'Lütfen e-posta / telefon ve şifre alanlarını doldurunuz.' };
    }

    // Search user database for matching credentials
    const foundUser = registeredUsers.find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanInput;
      const matchPhone = u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '');
      const matchPass = u.password === cleanPass;
      return (matchEmail || matchPhone) && matchPass;
    });

    if (!foundUser) {
      return {
        success: false,
        message: '⚠️ Geçersiz e-posta adresi / telefon numarası veya şifre! Lütfen bilgilerinizi kontrol ediniz.',
      };
    }

    // Credentials Verified! Create active session
    const { password, ...userSession } = foundUser;
    setUser(userSession);
    try {
      localStorage.setItem('veraesarp_user_session', JSON.stringify(userSession));
    } catch (e) {
      console.error(e);
    }

    return { success: true, user: userSession };
  };

  // 2. New User Registration
  const register = (name: string, email: string, phone: string, pass: string): AuthResult => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanEmail || !cleanPass || !name.trim()) {
      return { success: false, message: 'Lütfen tüm zorunlu alanları doldurunuz.' };
    }

    // Check if email already registered
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: '⚠️ Bu e-posta adresi ile zaten kayıtlı bir üyelik mevcut! Lütfen giriş yapınız.',
      };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '+90 500 000 00 00',
      password: cleanPass,
      role: 'customer',
      isAdmin: false,
      tier: 'Vera Silver Üye',
      totalSpent: 0,
      orderCount: 0,
    };

    const updatedUsers = [newUser, ...registeredUsers];
    saveRegisteredUsers(updatedUsers);

    // Auto-login new user
    const { password, ...sessionData } = newUser;
    setUser(sessionData);
    try {
      localStorage.setItem('veraesarp_user_session', JSON.stringify(sessionData));
    } catch (e) {
      console.error(e);
    }

    return { success: true, user: sessionData };
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

      // Also update in registeredUsers list
      const updatedList = registeredUsers.map((u) => (u.id === prev.id ? { ...u, ...updates } : u));
      saveRegisteredUsers(updatedList);

      return updated;
    });
  };

  const isAdmin = !!user && (user.role === 'admin' || user.isAdmin === true || user.email === 'destek@veraesarp.com');

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        registeredUsers,
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
