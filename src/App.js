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
// … diğer import’lar

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

      </Routes>
    </Router>
  );
}

export default App;
