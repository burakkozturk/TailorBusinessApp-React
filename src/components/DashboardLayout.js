import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import { Box, styled } from '@mui/material';

const MainContent = styled(Box)(({ theme, sidebarWidth }) => ({
  marginLeft: sidebarWidth,
  width: `calc(100% - ${sidebarWidth})`,
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: '1.5rem 2rem',
  transition: 'margin-left 0.3s ease, width 0.3s ease',
}));

const DashboardLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState('280px');

  const handleSidebarToggle = (width) => {
    setSidebarWidth(width);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar onToggle={handleSidebarToggle} />
      <MainContent sidebarWidth={sidebarWidth}>
        <Outlet />
      </MainContent>
    </Box>
  );
};

export default DashboardLayout;
