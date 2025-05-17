import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, Divider, List, ListItem, ListItemText, CircularProgress, Paper, Avatar, Chip, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaUsers, FaShoppingBag, FaMoneyBill, FaCheckCircle } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const StatCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '100%',
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: '#fff',
  borderRadius: 16,
  boxShadow: `0 6px 20px ${bgcolor}40`,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: `0 8px 25px ${bgcolor}60`,
  },
}));

const IconAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  backgroundColor: 'rgba(255,255,255,0.15)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateX(5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  marginBottom: theme.spacing(2),
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gerçek API çağrınızı yapın, şu anda mock data kullanıyoruz
        // const response = await axios.get('http://localhost:8080/api/dashboard/stats');
        // setStats(response.data);
        
        // Örnek istatistikler
        setStats({
          totalCustomers: 45,
          totalOrders: 128,
          totalRevenue: 235000,
          completedOrders: 96
        });

        // Son siparişler için örnek veri
        setRecentOrders([
          { id: 12, productType: 'CEKET', customer: { firstName: 'Ahmet', lastName: 'Yılmaz' }, orderDate: '2025-05-12', status: 'PREPARING', totalPrice: 3200 },
          { id: 11, productType: 'GÖMLEK', customer: { firstName: 'Mehmet', lastName: 'Demir' }, orderDate: '2025-05-10', status: 'CUTTING', totalPrice: 1500 },
          { id: 10, productType: 'PANTOLON', customer: { firstName: 'Buğra', lastName: 'Kılıç' }, orderDate: '2025-05-08', status: 'SEWING', totalPrice: 1800 },
          { id: 9, productType: 'TAKIM', customer: { firstName: 'Oğuz', lastName: 'Aktürk' }, orderDate: '2025-05-05', status: 'READY', totalPrice: 5500 },
        ]);

        // Sipariş durumu dağılımı için örnek veri
        setOrderStatus([
          { name: 'Hazırlanıyor', value: 32 },
          { name: 'Kesim', value: 18 },
          { name: 'Dikim', value: 24 },
          { name: 'Prova', value: 16 },
          { name: 'Hazır', value: 28 },
          { name: 'Teslim Edildi', value: 10 },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Dashboard verisi yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'PREPARING': return '#FFC107';
      case 'CUTTING': return '#2196F3';
      case 'SEWING': return '#9C27B0';
      case 'FITTING': return '#3F51B5';
      case 'READY': return '#4CAF50';
      case 'DELIVERED': return '#8BC34A';
      case 'CANCELLED': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PREPARING': return 'Hazırlanıyor';
      case 'CUTTING': return 'Kesim';
      case 'SEWING': return 'Dikim';
      case 'FITTING': return 'Prova';
      case 'READY': return 'Hazır';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'CANCELLED': return 'İptal';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        mb: 4, 
        fontWeight: 'bold',
        position: 'relative',
        display: 'inline-block',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '60px',
          height: '4px',
          bottom: '-10px',
          left: '0',
          backgroundColor: '#4CAF50',
          borderRadius: '10px'
        }
      }}>
        Hoş Geldiniz!
      </Typography>
      
      {/* İstatistik Kartları */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard bgcolor="#4CAF50">
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1, opacity: 0.9 }}>
                    Toplam Müşteri
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalCustomers}
                  </Typography>
                </Box>
                <IconAvatar>
                  <FaUsers size={30} />
                </IconAvatar>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard bgcolor="#2196F3">
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1, opacity: 0.9 }}>
                    Toplam Sipariş
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalOrders}
                  </Typography>
                </Box>
                <IconAvatar>
                  <FaShoppingBag size={30} />
                </IconAvatar>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard bgcolor="#FF9800">
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1, opacity: 0.9 }}>
                    Toplam Ciro
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' } }}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(stats.totalRevenue)}
                  </Typography>
                </Box>
                <IconAvatar>
                  <FaMoneyBill size={30} />
                </IconAvatar>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard bgcolor="#9C27B0">
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1, opacity: 0.9 }}>
                    Tamamlanan
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.completedOrders}
                  </Typography>
                </Box>
                <IconAvatar>
                  <FaCheckCircle size={30} />
                </IconAvatar>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>
      
      {/* Ana İçerik */}
      <Grid container spacing={4}>
        {/* Son Siparişler */}
        <Grid item xs={12} md={7}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '12px',
                  height: '24px',
                  backgroundColor: '#2196F3',
                  borderRadius: '4px',
                  marginRight: '12px'
                }
              }}>
                Son Siparişler
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List sx={{ px: 1 }}>
                {recentOrders.map((order) => (
                  <StyledPaper key={order.id}>
                    <ListItem sx={{ px: 2, py: 1 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {order.customer.firstName} {order.customer.lastName}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalPrice)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                <b>Sipariş No:</b> {order.id} - <b>Ürün:</b> {order.productType}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                <b>Tarih:</b> {order.orderDate}
                              </Typography>
                            </Box>
                            <Chip 
                              label={getStatusText(order.status)} 
                              size="small" 
                              sx={{ 
                                bgcolor: getStatusColor(order.status),
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                padding: '4px 0'
                              }} 
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </StyledPaper>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
        
        {/* Sipariş Durumu Pasta Grafiği */}
        <Grid item xs={12} md={5}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '12px',
                  height: '24px',
                  backgroundColor: '#FF9800',
                  borderRadius: '4px',
                  marginRight: '12px'
                }
              }}>
                Sipariş Durumu Dağılımı
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ height: 320, mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      paddingAngle={2}
                    >
                      {orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sipariş`, 'Miktar']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
