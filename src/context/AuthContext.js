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
    
    // Temel rol kontrolleri
    isAdmin: user?.role === 'ADMIN',
    isUsta: user?.role === 'USTA', 
    isMuhasebeci: user?.role === 'MUHASEBECI',
    isDikimhane: user?.role === 'DIKIMHANE',
    isKesimhane: user?.role === 'KESIMHANE',
    isOlcum: user?.role === 'ÖLÇÜM',
    
    // Yetkilendirme kontrolleri
    // MÜŞTERI YÖNETİMİ: Sadece ADMIN, USTA, ÖLÇÜM (DIKIMHANE/KESIMHANE erişemez)
    canViewCustomers: ['ADMIN', 'USTA', 'ÖLÇÜM'].includes(user?.role),
    canManageCustomers: ['ADMIN', 'USTA', 'ÖLÇÜM'].includes(user?.role),
    canDeleteCustomers: ['ADMIN', 'USTA'].includes(user?.role),
    
    // SİPARİŞ YÖNETİMİ: Herkes görüntüleyebilir, ama kısıtlamalar var
    canViewOrders: ['ADMIN', 'USTA', 'MUHASEBECI', 'DIKIMHANE', 'KESIMHANE', 'ÖLÇÜM'].includes(user?.role),
    canCreateOrders: ['ADMIN', 'USTA', 'ÖLÇÜM'].includes(user?.role),
    canEditOrders: ['ADMIN', 'USTA', 'ÖLÇÜM'].includes(user?.role),
    canDeleteOrders: ['ADMIN', 'USTA'].includes(user?.role),
    canViewOrderPrices: !['ÖLÇÜM'].includes(user?.role), // ÖLÇÜM rolü fiyat göremez
    
    // ÖLÇÜM YÖNETİMİ: ADMIN, USTA, DIKIMHANE, KESIMHANE (görüntüleme), ÖLÇÜM (tam yetki)
    canViewMeasurements: ['ADMIN', 'USTA', 'DIKIMHANE', 'KESIMHANE', 'ÖLÇÜM'].includes(user?.role),
    canManageMeasurements: ['ADMIN', 'USTA', 'ÖLÇÜM'].includes(user?.role),
    
    // ADMIN ONLY: Blog, Kategori, Mesajlar, Raporlar, Ayarlar
    canManageBlogs: user?.role === 'ADMIN',
    canManageCategories: user?.role === 'ADMIN',
    canManageMessages: user?.role === 'ADMIN',
    canViewReports: user?.role === 'ADMIN',
    canManageSettings: user?.role === 'ADMIN',
    canManageUsers: user?.role === 'ADMIN',
    
    // DASHBOARD: Herkes kendi rolüne göre erişebilir
    canViewDashboard: ['ADMIN', 'USTA', 'MUHASEBECI', 'DIKIMHANE', 'KESIMHANE', 'ÖLÇÜM'].includes(user?.role),
    
    // Eski uyumluluk için
    hasKesimhaneAccess: ['ADMIN', 'USTA', 'KESIMHANE'].includes(user?.role),
    hasDikimhaneAccess: ['ADMIN', 'USTA', 'DIKIMHANE'].includes(user?.role),
    hasOlcumAccess: ['ADMIN', 'USTA', 'ÖLÇÜM'].includes(user?.role),
    hasAllRolesAccess: ['ADMIN', 'USTA', 'MUHASEBECI', 'DIKIMHANE', 'KESIMHANE', 'ÖLÇÜM'].includes(user?.role)
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

// Muhasebeci erişimi (ADMIN + USTA + MUHASEBECI)
export function RequireMuhasebeci({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hasMuhasebeci = ['ADMIN', 'USTA', 'MUHASEBECI'].includes(user?.role);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!hasMuhasebeci) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Sipariş görüntüleme yetkisi (Tüm roller)
export function RequireOrderView({ children }) {
  const { user, loading, canViewOrders } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!canViewOrders) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Müşteri görüntüleme yetkisi (ADMIN + USTA + ÖLÇÜM + DIKIMHANE + KESIMHANE)
export function RequireCustomerView({ children }) {
  const { user, loading, canViewCustomers } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!canViewCustomers) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Müşteri yönetimi yetkisi (ADMIN + USTA + ÖLÇÜM)
export function RequireCustomerManagement({ children }) {
  const { user, loading, canManageCustomers } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!canManageCustomers) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

// Ölçüm görüntüleme yetkisi (ADMIN + USTA + DIKIMHANE + KESIMHANE + ÖLÇÜM)
export function RequireMeasurementView({ children }) {
  const { user, loading, canViewMeasurements } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  if (!canViewMeasurements) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
} 