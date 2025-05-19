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
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Orders from './components/Orders';
import AdminBlog from './pages/AdminBlog';
import AdminCategories from './pages/AdminCategories';
import AdminFabrics from './pages/AdminFabrics';
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';
import TestPage from './components/TestPage';
import './styles/App.css';
import { AuthProvider, RequireAuth, RequireAdmin } from './context/AuthContext';

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
          <Route path="/test" element={<TestPage />} />
          
          {/* Admin Dashboard - Kimlik Doğrulama Gerektirir */}
          <Route path="/admin" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            
            {/* Manager ve Admin erişimli sayfalar */}
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<AdminSettings />} />
            
            {/* Sadece Admin Erişimi Olan Sayfalar */}
            <Route path="fabrics" element={<RequireAdmin><AdminFabrics /></RequireAdmin>} />
            <Route path="templates" element={<RequireAdmin><div>Şablonlar</div></RequireAdmin>} />
            <Route path="messages" element={<RequireAdmin><AdminMessages /></RequireAdmin>} />
            <Route path="blog" element={<RequireAdmin><AdminBlog /></RequireAdmin>} />
            <Route path="categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
