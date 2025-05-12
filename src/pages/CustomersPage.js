import React, { useState, useEffect } from 'react';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);

  // Müşteri verilerini API'den almak için useEffect kullanıyoruz.
  useEffect(() => {
    fetch('/api/customers')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  return (
    <div>
      <h2>Müşteri Listesi</h2>
      <table>
        <thead>
          <tr>
            <th>Adı</th>
            <th>Soyadı</th>
            <th>Telefon</th>
            <th>Adres</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <button>Detaylar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersPage;
