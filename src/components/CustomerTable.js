import React from 'react';
import '../styles/CustomerTable.css'; // Estetik için stil dosyasını ekliyoruz

const CustomerTable = ({ customers }) => {
  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Ad</th>
          <th>Soyad</th>
          <th>Email</th>
          <th>Telefon</th>
          <th>Yükseklik (cm)</th>
          <th>Kilogram (kg)</th>
        </tr>
      </thead>
      <tbody>
        {customers.length > 0 ? (
          customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.height}</td>
              <td>{customer.weight}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Henüz müşteri yok</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomerTable;
