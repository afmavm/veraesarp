'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendWelcomeEmail } from '@/lib/email/email-service';

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
  updatePassword: (currentPass: string, newPass: string) => AuthResult;
  resetPasswordDirectly: (email: string, newPass: string) => AuthResult;
}

// Store Official Admin Account
const OFFICIAL_ADMIN_ACCOUNT: UserProfile = {
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([OFFICIAL_ADMIN_ACCOUNT]);

  // Load Saved Users & Active Session from Server DB & LocalStorage
  useEffect(() => {
    async function loadUserDatabase() {
      let loadedUsers: UserProfile[] = [];

      // 1. Try loading from Server DB first
      try {
        const res = await fetch('/api/db');
        const json = await res.json();
        if (json.success && json.data && json.data.registeredUsers && Array.isArray(json.data.registeredUsers)) {
          loadedUsers = json.data.registeredUsers;
        }
      } catch (e) {
        console.warn('Failed to fetch registeredUsers from server DB', e);
      }

      // 2. Fallback to localStorage if server DB had no registeredUsers
      if (loadedUsers.length === 0) {
        try {
          const savedUsers = localStorage.getItem('veraesarp_registered_users');
          if (savedUsers) {
            loadedUsers = JSON.parse(savedUsers);
          }
        } catch (e) {}
      }

      // Ensure official admin exists in list
      const hasAdmin = loadedUsers.some((u) => u.email.toLowerCase() === OFFICIAL_ADMIN_ACCOUNT.email.toLowerCase());
      const finalUsers = hasAdmin ? loadedUsers : [OFFICIAL_ADMIN_ACCOUNT, ...loadedUsers];

      setRegisteredUsers(finalUsers);
      try {
        localStorage.setItem('veraesarp_registered_users', JSON.stringify(finalUsers));
      } catch (e) {}

      // Load active user session
      try {
        const savedSession = localStorage.getItem('veraesarp_user_session');
        if (savedSession) {
          const sessionUser: UserProfile = JSON.parse(savedSession);
          if (sessionUser.email === 'ayse.yilmaz@example.com' || sessionUser.email === 'demo@veraesarp.com') {
            localStorage.removeItem('veraesarp_user_session');
            setUser(null);
          } else {
            setUser(sessionUser);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    }

    loadUserDatabase();
  }, []);

  // Synchronize registered Users array to localStorage & Server DB permanently
  const saveRegisteredUsers = (usersList: UserProfile[]) => {
    setRegisteredUsers(usersList);

    // Save to LocalStorage
    try {
      localStorage.setItem('veraesarp_registered_users', JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to save registered users to localStorage', e);
    }

    // Persist to Permanent Server DB
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registeredUsers: usersList }),
    }).catch((err) => console.error('Failed to save registeredUsers to server DB', err));
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
      const matchPass = (u.password || '').trim() === cleanPass;
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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('veraesarp_new_user_registered', { detail: newUser }));
    }

    const { password, ...sessionData } = newUser;
    setUser(sessionData);
    try {
      localStorage.setItem('veraesarp_user_session', JSON.stringify(sessionData));
    } catch (e) {
      console.error(e);
    }

    try {
      sendWelcomeEmail(newUser);
    } catch (e) {
      console.error('Welcome email error', e);
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

      const updatedList = registeredUsers.map((u) => (u.id === prev.id ? { ...u, ...updates } : u));
      saveRegisteredUsers(updatedList);

      return updated;
    });
  };

  // 3. User Password Update (authenticated profile change)
  const updatePassword = (currentPass: string, newPass: string): AuthResult => {
    if (!user) {
      return { success: false, message: 'Lütfen önce hesabınıza giriş yapınız.' };
    }

    const cleanCurrent = (currentPass || '').trim();
    const cleanNew = (newPass || '').trim();

    if (!cleanCurrent || !cleanNew) {
      return { success: false, message: 'Lütfen tüm şifre alanlarını doldurunuz.' };
    }

    if (cleanNew.length < 6) {
      return { success: false, message: 'Yeni şifreniz en az 6 karakter olmalıdır.' };
    }

    // Find user record in registeredUsers database
    const targetUser = registeredUsers.find(
      (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
    );

    if (!targetUser || (targetUser.password || '').trim() !== cleanCurrent) {
      return { success: false, message: '⚠️ Mevcut şifrenizi yanlış girdiniz!' };
    }

    // Update password in registeredUsers registry
    const updatedUsers = registeredUsers.map((u) =>
      u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
        ? { ...u, password: cleanNew }
        : u
    );

    saveRegisteredUsers(updatedUsers);

    return { success: true, message: '🔒 Şifreniz başarıyla değiştirildi ve kalıcı olarak kaydedildi!' };
  };

  // 4. Direct Password Reset (Forgot Password / Admin Reset)
  const resetPasswordDirectly = (email: string, newPass: string): AuthResult => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanNew = (newPass || '').trim();

    if (!cleanEmail || !cleanNew) {
      return { success: false, message: 'E-posta adresi ve yeni şifre zorunludur.' };
    }

    if (cleanNew.length < 6) {
      return { success: false, message: 'Yeni şifre en az 6 karakter olmalıdır.' };
    }

    const targetUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!targetUser) {
      return { success: false, message: '⚠️ Bu e-posta adresine ait kayıtlı kullanıcı bulunamadı.' };
    }

    const updatedUsers = registeredUsers.map((u) =>
      u.email.toLowerCase() === cleanEmail ? { ...u, password: cleanNew } : u
    );

    saveRegisteredUsers(updatedUsers);

    return { success: true, message: '🔒 Şifreniz başarıyla sıfırlandı ve yenilendi! Yeni şifrenizle giriş yapabilirsiniz.' };
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
        updatePassword,
        resetPasswordDirectly,
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
