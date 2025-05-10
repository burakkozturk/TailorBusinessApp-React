import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AdminPage = () => {
  return (
    <DashboardLayout>
      <h1>Hoşgeldin, Erdal Güda!</h1>
      <p>Bugün seni bekleyen görevler aşağıda:</p>
      {/* Buraya dinamik kartlar vs. koyarız istersen */}
    </DashboardLayout>
  );
};

export default AdminPage;
