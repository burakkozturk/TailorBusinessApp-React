import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SideBar.css';

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Paneli</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard">Genel Bakış</Link>
        </li>
        <li>
          <Link to="/admin/customers">Müşteriler</Link>
        </li>
        <li>
          <Link to="/admin/orders">Siparişler</Link>
        </li>
        <li>
          <Link to="/admin/fabrics">Kumaşlar</Link>
        </li>
        <li>
          <Link to="/admin/templates">Şablonlar</Link>
        </li>
        <li>
          <Link to="/admin/settings">Ayarlar</Link>
        </li>
        <li>
          <Link to="/admin/logout">Çıkış Yap</Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
