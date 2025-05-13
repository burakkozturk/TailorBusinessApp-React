import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaTshirt, FaCogs, FaSignOutAlt, FaLayerGroup, FaTools } from 'react-icons/fa';
import '../styles/SideBar.css';

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';

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
        <li>
          <Link to="/logout">
            <FaSignOutAlt /> Çıkış Yap
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
