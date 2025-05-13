import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <SideBar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
