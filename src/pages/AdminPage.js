import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CustomerTable from '../components/CustomerTable'; // Müşteri tablosu bileşenini import ediyoruz

const AdminPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Verileri çekmek için API çağrısı
    fetch('/api/customers')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Veri alımı hatası:', error));
  }, []);

  return (
    <DashboardLayout>
      <h1>Hoşgeldin, Erdal Güda!</h1>
      <p>Bugün seni bekleyen görevler aşağıda:</p>
      <h2>Müşteri Listesi</h2>
      {/* Dinamik içerikler buraya gelecek */}
      <CustomerTable customers={customers} />
    </DashboardLayout>
  );
};

export default AdminPage;
