// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
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

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links">Ana Sayfa</Link>
          </li>
          <li className="nav-item">
            <Link to="/hakkimizda" className="nav-links">Hakkımızda</Link>
          </li>
          <li className="nav-item">
            <Link to="/blog" className="nav-links">Blog</Link>
          </li>
          <li className="nav-item">
            <Link to="/cebinizdeki-terziniz" className="nav-links"><i>Cebinizdeki Terziniz</i></Link>
          </li>
          <li className="nav-item">
            <Link to="/iletisim" className="nav-links">İletişim</Link>
          </li>
        </ul>

        {/* Giriş ikonu - sağa sabit */}
        <Link to="/giris" className="login-icon">
          <FiLogIn size={24} />
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
