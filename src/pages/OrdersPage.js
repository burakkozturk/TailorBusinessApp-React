import React, { useState, useEffect } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  // Sipariş verilerini API'den almak için useEffect kullanıyoruz.
  useEffect(() => {
    fetch('/api/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div>
      <h2>Sipariş Listesi</h2>
      <table>
        <thead>
          <tr>
            <th>Ürün Tipi</th>
            <th>Durum</th>
            <th>Tarih</th>
            <th>Müşteri</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.productType}</td>
              <td>{order.status}</td>
              <td>{order.orderDate}</td>
              <td>{order.customerName}</td>
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

export default OrdersPage;
