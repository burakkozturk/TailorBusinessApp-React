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

    isAuthenticated: !!user,
    isAdminUser: user?.userType === 'ADMIN', // Admin panel kullanıcısı
    isRegularUser: user?.userType === 'USER', // Normal kayıtlı kullanıcı
    isOlcum: user?.role === 'ÖLÇÜM',
    isKesimhane: user?.role === 'KESIMHANE',
    isDikimhane: user?.role === 'DIKIMHANE',
    isAdmin: user?.role === 'ADMIN',
    
    // Yetki kontrolleri
    hasKesimhaneAccess: user?.role === 'ADMIN' || user?.role === 'KESIMHANE',
    hasDikimhaneAccess: user?.role === 'ADMIN' || user?.role === 'DIKIMHANE',
    hasOlcumAccess: user?.role === 'ADMIN' || user?.role === 'ÖLÇÜM',
    hasAllRolesAccess: user?.role === 'ADMIN' || user?.role === 'KESIMHANE' || user?.role === 'DIKIMHANE' || user?.role === 'ÖLÇÜM'
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

// Kesimhane erişimi (ADMIN + KESIMHANE)
export function RequireKesimhane({ children }) {
  const { user, loading, hasKesimhaneAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasKesimhaneAccess) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Dikimhane erişimi (ADMIN + DIKIMHANE)
export function RequireDikimhane({ children }) {
  const { user, loading, hasDikimhaneAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasDikimhaneAccess) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Ölçüm erişimi (ADMIN + ÖLÇÜM)
export function RequireOlcum({ children }) {
  const { user, loading, hasOlcumAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasOlcumAccess) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Tüm roller için erişim (ADMIN + KESIMHANE + DIKIMHANE + ÖLÇÜM)
export function RequireMuhasebeci({ children }) {
  const { user, loading, hasAllRolesAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasAllRolesAccess) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
} 