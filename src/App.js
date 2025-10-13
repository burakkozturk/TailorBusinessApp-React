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
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';
import UserManagement from './pages/AdminManagers';
import AIModel from './pages/AIModel';

import TestPage from './components/TestPage';
import ImageUploadPDF from './components/ImageUploadPDF';
import './styles/App.css';
import './styles/GlobalButtons.css';
import { AuthProvider, RequireAuth, RequireAdmin, RequireCustomerManagement, RequireOrderView, RequireMeasurementView } from './context/AuthContext';

// i18n konfigürasyonunu import et
import './i18n';

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
          <Route path="/image-pdf" element={<ImageUploadPDF />} />
          
          {/* Admin Dashboard - Kimlik Doğrulama Gerektirir */}
          <Route path="/admin" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            
            {/* Müşteriler - Sadece ADMIN, USTA, ÖLÇÜM */}
            <Route path="customers" element={<RequireCustomerManagement><Customers /></RequireCustomerManagement>} />
            
            {/* Siparişler - Tüm roller */}
            <Route path="orders" element={<RequireOrderView><Orders /></RequireOrderView>} />
            

            
            {/* Sadece Admin Erişimi Olan Sayfalar */}
            <Route path="messages" element={<RequireAdmin><AdminMessages /></RequireAdmin>} />
            <Route path="blog" element={<RequireAdmin><AdminBlog /></RequireAdmin>} />
            <Route path="managers" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
            <Route path="ai-model" element={<RequireAdmin><AIModel /></RequireAdmin>} />

            
            {/* Tüm roller erişebilir */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
