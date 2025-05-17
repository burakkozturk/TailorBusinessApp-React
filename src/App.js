// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import Services from './components/Services';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Orders from './components/Orders';
import AdminBlog from './pages/AdminBlog';
import './styles/App.css';
// … diğer import'lar

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hizmetler" element={<Services />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="fabrics" element={<div>Kumaşlar</div>} />
          <Route path="templates" element={<div>Şablonlar</div>} />
          <Route path="settings" element={<div>Ayarlar</div>} />
          <Route path="blog" element={<AdminBlog />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
