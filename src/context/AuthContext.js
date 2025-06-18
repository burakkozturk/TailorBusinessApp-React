import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Auth Context oluşturuyoruz
const AuthContext = createContext(null);

// Auth Provider bileşeni
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yenilendikten sonra localStorage'dan kullanıcı bilgilerini alıyoruz
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');

    if (token && role && username) {
      setUser({ username, role, token, userType });
    }
    
    setLoading(false);
  }, []);

  // Giriş ve çıkış fonksiyonları
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userType', userData.userType || 'USER');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isUsta: user?.role === 'USTA',
    isMuhasebeci: user?.role === 'MUHASEBECI',
    isAuthenticated: !!user,
    isAdminUser: user?.userType === 'ADMIN', // Admin panel kullanıcısı
    isRegularUser: user?.userType === 'USER', // Normal kayıtlı kullanıcı
    // Rol hiyerarşisi kontrolleri
    hasAdminAccess: user?.role === 'ADMIN',
    hasUstaAccess: user?.role === 'ADMIN' || user?.role === 'USTA',
    hasMuhasebeciAccess: user?.role === 'ADMIN' || user?.role === 'USTA' || user?.role === 'MUHASEBECI'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Auth Context hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Yetkili kullanıcıların erişebileceği route'ları koruyan bileşen
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  return children;
}

// Sadece Admin rolüne erişim sağlayan bileşen
export function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Usta ve üzeri erişim (ADMIN + USTA)
export function RequireUsta({ children }) {
  const { user, loading, hasUstaAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasUstaAccess) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Muhasebeci ve üzeri erişim (ADMIN + USTA + MUHASEBECI)
export function RequireMuhasebeci({ children }) {
  const { user, loading, hasMuhasebeciAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasMuhasebeciAccess) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
} 