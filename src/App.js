// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import Services from './components/Services';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import CebinizdekiTerziniz from './pages/CebinizdekiTerziniz';
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Orders from './components/Orders';
import AdminBlog from './pages/AdminBlog';
import AdminCategories from './pages/AdminCategories';
import AdminFabrics from './pages/AdminFabrics';
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';
import UserManagement from './pages/AdminManagers';
import PendingUsers from './pages/PendingUsers';
import TestPage from './components/TestPage';
import './styles/App.css';
import './styles/GlobalButtons.css';
import { AuthProvider, RequireAuth, RequireAdmin, RequireUsta, RequireMuhasebeci } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Genel Sayfalar */}
          <Route path="/" element={<HomePage />} />
          <Route path="/hizmetler" element={<Services />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/kategori/:categorySlug" element={<CategoryPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/cebinizdeki-terziniz" element={<CebinizdekiTerziniz />} />
          <Route path="/giris" element={<Login />} />
          <Route path="/kayit" element={<Register />} />
          <Route path="/test" element={<TestPage />} />
          
          {/* Admin Dashboard - Kimlik Doğrulama Gerektirir */}
          <Route path="/admin" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            
            {/* Muhasebeci ve üzeri erişimli sayfalar (ADMIN + USTA + MUHASEBECI) */}
            <Route path="customers" element={<RequireMuhasebeci><Customers /></RequireMuhasebeci>} />
            <Route path="orders" element={<RequireMuhasebeci><Orders /></RequireMuhasebeci>} />
            
            {/* Usta ve üzeri erişimli sayfalar (ADMIN + USTA) */}
            <Route path="fabrics" element={<RequireUsta><AdminFabrics /></RequireUsta>} />
            <Route path="templates" element={<RequireUsta><div>Şablonlar</div></RequireUsta>} />
            
            {/* Sadece Admin Erişimi Olan Sayfalar */}
            <Route path="messages" element={<RequireAdmin><AdminMessages /></RequireAdmin>} />
            <Route path="pending-users" element={<RequireAdmin><PendingUsers /></RequireAdmin>} />
            <Route path="blog" element={<RequireAdmin><AdminBlog /></RequireAdmin>} />
            <Route path="categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
            <Route path="user-management" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
            
            {/* Tüm roller erişebilir */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
