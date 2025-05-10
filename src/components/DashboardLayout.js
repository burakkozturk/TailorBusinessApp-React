import React from 'react';
import SideBar from './SideBar';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <SideBar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
