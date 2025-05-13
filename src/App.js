// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import Services from './components/Services';
import Blog from './components/Blog';
import AboutPage from './pages/AboutPage';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Customers from './components/Customers';
import Orders from './components/Orders';
import './styles/App.css';
// … diğer import'lar

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hizmetler" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<div>Dashboard Ana Sayfa</div>} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="fabrics" element={<div>Kumaşlar</div>} />
          <Route path="templates" element={<div>Şablonlar</div>} />
          <Route path="settings" element={<div>Ayarlar</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
