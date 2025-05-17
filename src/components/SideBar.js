import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaTshirt, FaCogs, FaSignOutAlt, FaLayerGroup, FaTools, FaBlog } from 'react-icons/fa';
import '../styles/SideBar.css';

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>Admin Paneli</h2>
      <ul>
        <li className={currentPath === '' ? 'active' : ''}>
          <Link to="/admin">
          <FaHome /> Genel Bakış
          </Link>
        </li>
        <li className={currentPath === 'customers' ? 'active' : ''}>
          <Link to="/admin/customers">
          <FaUser /> Müşteriler
          </Link>
        </li>
        <li className={currentPath === 'orders' ? 'active' : ''}>
          <Link to="/admin/orders">
          <FaTshirt /> Siparişler
          </Link>
        </li>
        <li className={currentPath === 'fabrics' ? 'active' : ''}>
          <Link to="/admin/fabrics">
          <FaLayerGroup /> Kumaşlar
          </Link>
        </li>
        <li className={currentPath === 'templates' ? 'active' : ''}>
          <Link to="/admin/templates">
          <FaTools /> Şablonlar
          </Link>
        </li>
        <li className={currentPath === 'settings' ? 'active' : ''}>
          <Link to="/admin/settings">
          <FaCogs /> Ayarlar
          </Link>
        </li>
        <li className={currentPath === 'blog' ? 'active' : ''}>
          <Link to="/admin/blog">
          <FaBlog /> Blog
          </Link>
        </li>
        <li>
          <a href="/logout" onClick={handleLogout}>
          <FaSignOutAlt /> Çıkış Yap
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
