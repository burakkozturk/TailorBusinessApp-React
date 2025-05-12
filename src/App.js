// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import Services from './components/Services';
import Blog from './components/Blog';
import AboutPage from './pages/AboutPage';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminPage from './pages/AdminPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
