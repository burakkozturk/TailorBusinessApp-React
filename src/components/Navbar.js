import React, { useState, useEffect } from 'react';
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

    // Bileşen unmount olduğunda event'ı kaldır
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">
            <img src="/img/logo.jpeg" alt="Logo" className="logo-image" />
          </a>
        </div>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <a href="/" className="nav-links">Ana Sayfa</a>
          </li>
          <li className="nav-item">
            <a href="/hizmetler" className="nav-links">Hizmetler</a>
          </li>
          <li className="nav-item">
            <a href="/koleksiyon" className="nav-links">Koleksiyon</a>
          </li>
          <li className="nav-item">
            <a href="/blog" className="nav-links">Blog</a>
          </li>
          <li className="nav-item">
            <a href="/iletisim" className="nav-links">İletişim</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

