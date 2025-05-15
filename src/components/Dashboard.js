import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  People,
  ShoppingBag,
  Inventory,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  Person,
  AccessTime,
  AttachMoney,
  KeyboardArrowRight,
  Done,
  LocalShipping,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';
import '../styles/Dashboard.css';

const getStatusChip = (status) => {
  const statusConfig = {
    PENDING: { color: 'warning', icon: <AccessTime sx={{ fontSize: 16 }} />, label: 'Beklemede' },
    IN_PROGRESS: { color: 'info', icon: <LocalShipping sx={{ fontSize: 16 }} />, label: 'Hazırlanıyor' },
    COMPLETED: { color: 'success', icon: <Done sx={{ fontSize: 16 }} />, label: 'Tamamlandı' },
    CANCELLED: { color: 'error', icon: <Cancel sx={{ fontSize: 16 }} />, label: 'İptal' }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      sx={{ '& .MuiChip-icon': { ml: '4px' } }}
    />
  );
};

const StatCard = ({ title, value, icon, trend, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 48, height: 48 }}>
          {icon}
        </Avatar>
        {trend && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              {trend}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Geçen Aya Göre
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 0.5, fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const RecentCustomers = ({ customers }) => (
  <Card 
    elevation={0}
    sx={{ 
      height: '100%',
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 3
    }}
  >
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Son Eklenen Müşteriler
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Müşteri</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Tarih</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

const RecentOrders = ({ orders }) => (
  <Card 
    elevation={0}
    sx={{ 
      height: '100%',
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 3
    }}
  >
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Son Siparişler
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sipariş No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{`${order.customer.firstName} ${order.customer.lastName}`}</TableCell>
                <TableCell>{`${order.totalAmount} ₺`}</TableCell>
                <TableCell>{getStatusChip(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    customerGrowth: 15,
    orderGrowth: 8,
    revenueGrowth: 12
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Bu endpoint'ler backend'de oluşturulmalı
        const [statsRes, customersRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:6767/api/dashboard/stats'),
          axios.get('http://localhost:6767/api/customers?limit=5'),
          axios.get('http://localhost:6767/api/orders?limit=5')
        ]);

        setStats(statsRes.data);
        setRecentCustomers(customersRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div className="dashboard-container">
      {/* Hoşgeldin Mesajı */}
      <Box className="welcome-section">
        <Typography variant="h4" component="h1" gutterBottom>
          Hoş Geldiniz, Erdal Güda!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          İşletmenizin güncel durumuna genel bir bakış:
        </Typography>
      </Box>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Müşteri"
            value={stats.totalCustomers}
            icon={<People />}
            trend={stats.customerGrowth}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Sipariş"
            value={stats.totalOrders}
            icon={<ShoppingBag />}
            trend={stats.orderGrowth}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aylık Gelir"
            value={`${stats.monthlyRevenue.toLocaleString('tr-TR')} ₺`}
            icon={<AttachMoney />}
            trend={stats.revenueGrowth}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bekleyen Siparişler"
            value="12"
            icon={<LocalShipping />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Son Eklenenler ve Siparişler */}
      <Grid container spacing={3}>
        {/* Son Eklenen Müşteriler */}
        <Grid item xs={12} md={6}>
          <RecentCustomers customers={recentCustomers} />
        </Grid>

        {/* Son Siparişler */}
        <Grid item xs={12} md={6}>
          <RecentOrders orders={recentOrders} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 