import React from 'react';
import { FaHome, FaUser, FaTshirt, FaCogs, FaSignOutAlt, FaLayerGroup, FaTools } from 'react-icons/fa';
import '../styles/SideBar.css';

const SideBar = ({ active }) => {
  return (
    <div className="sidebar">
      <h2>Admin Paneli</h2>
      <ul>
        <li className={active === 'dashboard' ? 'active' : ''}>
          <FaHome /> Genel Bakış
        </li>
        <li className={active === 'customers' ? 'active' : ''}>
          <FaUser /> Müşteriler
        </li>
        <li className={active === 'orders' ? 'active' : ''}>
          <FaTshirt /> Siparişler
        </li>
        <li className={active === 'fabrics' ? 'active' : ''}>
          <FaLayerGroup /> Kumaşlar
        </li>
        <li className={active === 'templates' ? 'active' : ''}>
          <FaTools /> Şablonlar
        </li>
        <li className={active === 'settings' ? 'active' : ''}>
          <FaCogs /> Ayarlar
        </li>
        <li>
          <FaSignOutAlt /> Çıkış Yap
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
