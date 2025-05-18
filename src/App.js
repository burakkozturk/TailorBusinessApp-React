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
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Orders from './components/Orders';
import AdminBlog from './pages/AdminBlog';
import AdminCategories from './pages/AdminCategories';
import AdminFabrics from './pages/AdminFabrics';
import AdminMessages from './pages/AdminMessages';
import './styles/App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hizmetler" element={<Services />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/blog/kategori/:categorySlug" element={<CategoryPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="fabrics" element={<AdminFabrics />} />
          <Route path="templates" element={<div>Şablonlar</div>} />
          <Route path="settings" element={<div>Ayarlar</div>} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
