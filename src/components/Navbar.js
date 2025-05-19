// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/img/logo.jpeg" alt="Logo" className="logo-image" />
          </Link>
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsOpen(false)}>Ana Sayfa</Link>
          </li>
          <li className="nav-item">
            <Link to="/hakkimizda" className="nav-links" onClick={() => setIsOpen(false)}>Hakkımızda</Link>
          </li>
          <li className="nav-item">
            <Link to="/blog" className="nav-links" onClick={() => setIsOpen(false)}>Blog</Link>
          </li>
          <li className="nav-item">
            <Link to="/cebinizdeki-terziniz" className="nav-links" onClick={() => setIsOpen(false)}><i>Cebinizdeki Terziniz</i></Link>
          </li>
          <li className="nav-item">
            <Link to="/iletisim" className="nav-links" onClick={() => setIsOpen(false)}>İletişim</Link>
          </li>
        </ul>

        {/* Menü ve Giriş ikonları - sağ tarafta */}
        <div className="navbar-right">
          <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={28} color="#f5e6b0" /> : <FiMenu size={28} color="#f5e6b0" />}
          </div>
          
          <Link to="/giris" className="login-icon">
            <FiLogIn size={24} color="#f5e6b0" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
