import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  CircularProgress, 
  Container,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  FaUsers, 
  FaShoppingBag, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaTshirt, 
  FaClipboardCheck, 
  FaArrowUp, 
  FaArrowDown 
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie 
} from 'recharts';

import api from '../api/axiosConfig';
import useDocumentTitle from '../hooks/useDocumentTitle';

const StatsContainer = styled(Box)({
  minHeight: '100vh',
  padding: '2rem 0',
  backgroundColor: '#f8fafc',
});

const StatItem = styled(Box)(({ theme, gradient }) => ({
  padding: '1.5rem',
  borderRadius: '20px',
  background: gradient || 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '140px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    pointerEvents: 'none',
  },
  '&:hover': {
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px) scale(1.01)',
    '& .icon-box': {
      transform: 'rotate(3deg) scale(1.05)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
    }
  }
}));

const IconBox = styled(Box)(({ bgcolor }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${bgcolor}, ${bgcolor}dd)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '20px',
  right: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
    borderRadius: '16px',
    pointerEvents: 'none',
  }
}));

const ModernPaper = styled(Paper)({
  borderRadius: 20,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
});

const Dashboard = () => {
  useDocumentTitle('Genel Bakış');
  
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    fittingOrders: 0,
    deliveriesThisWeek: 0,
    growth: {
      customers: 12.5,
      orders: 8.3,
      revenue: 15.2,
      completed: 9.7,
      fitting: -5.2,
      deliveries: 15.7
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsResponse, recentOrdersResponse, statusDistributionResponse] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/dashboard/recent-orders'),
          api.get('/api/dashboard/order-status-distribution')
        ]);
        
        const statsData = statsResponse.data;
        
        setStats({
          totalCustomers: statsData.totalCustomers,
          totalOrders: statsData.ordersLast30Days,
          totalRevenue: statsData.revenueLastMonth,
          completedOrders: statsData.completedLastMonth,
          fittingOrders: statsData.fittingOrders,
          deliveriesThisWeek: statsData.deliveriesThisWeek,
          growth: {
            customers: statsData.customersGrowth,
            orders: statsData.ordersGrowth,
            revenue: statsData.revenueGrowth,
            completed: 12.3,
            fitting: -5.2,
            deliveries: 15.7
          }
        });

        setRecentOrders(recentOrdersResponse.data.slice(0, 10));
        
        // Sipariş durum verilerini işle
        const statusData = statusDistributionResponse.data.map(item => ({
          status: getStatusText(item.status),
          siparisSayisi: item.count,
          fill: getStatusColor(item.status)
        }));
        setOrderStatusData(statusData);
        
        setLoading(false);
      } catch (error) {
        console.error('Dashboard verisi yüklenirken hata oluştu:', error);
        
        setStats({
          totalCustomers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          completedOrders: 0,
          fittingOrders: 0,
          deliveriesThisWeek: 0,
          growth: {
            customers: 0,
            orders: 0,
            revenue: 0,
            completed: 0,
            fitting: 0,
            deliveries: 0
          }
        });
        setRecentOrders([]);
        setOrderStatusData([]);
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

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₺0';
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderGrowth = (value) => {
    const isPositive = value >= 0;
    const color = isPositive ? '#10B981' : '#EF4444';
    const ArrowIcon = isPositive ? FaArrowUp : FaArrowDown;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ArrowIcon size={12} color={color} />
        <Typography 
          variant="caption" 
          sx={{ 
            color: color, 
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          {Math.abs(value).toFixed(1)}%
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <StatsContainer>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '60vh',
            gap: 3
          }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
              Dashboard veriler yükleniyor...
            </Typography>
          </Box>
        </Container>
      </StatsContainer>
    );
  }

  return (
    <StatsContainer>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            color: '#1e293b',
            mb: 1
          }}>
            Genel Bakış
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
            İşletmenizin genel performans özeti
          </Typography>
        </Box>

        {/* İstatistik Özetleri */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
            Önemli Metriklerin Özeti
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <StatItem gradient="linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)">
                <IconBox bgcolor="#10B981" className="icon-box">
                  <FaUsers size={22} color="white" />
                </IconBox>
                <Box sx={{ position: 'relative', zIndex: 1, pr: 8 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46', mb: 0.5, lineHeight: 1 }}>
                    {stats.totalCustomers.toLocaleString('tr-TR')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#16a34a', fontWeight: 600, mb: 1.5 }}>
                    Toplam Müşteri
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#4ade80', fontWeight: 500 }}>
                      Son 30 günde
                    </Typography>
                    {renderGrowth(stats.growth.customers)}
                  </Box>
                </Box>
              </StatItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatItem gradient="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)">
                <IconBox bgcolor="#3B82F6" className="icon-box">
                  <FaShoppingBag size={22} color="white" />
                </IconBox>
                <Box sx={{ position: 'relative', zIndex: 1, pr: 8 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e40af', mb: 0.5, lineHeight: 1 }}>
                    {stats.totalOrders.toLocaleString('tr-TR')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#2563eb', fontWeight: 600, mb: 1.5 }}>
                    Toplam Sipariş (30 gün)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 500 }}>
                      Önceki aya göre
                    </Typography>
                    {renderGrowth(stats.growth.orders)}
                  </Box>
                </Box>
              </StatItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatItem gradient="linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)">
                <IconBox bgcolor="#F59E0B" className="icon-box">
                  <FaMoneyBillWave size={22} color="white" />
                </IconBox>
                <Box sx={{ position: 'relative', zIndex: 1, pr: 8 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#92400e', mb: 0.5, lineHeight: 1 }}>
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#d97706', fontWeight: 600, mb: 1.5 }}>
                    Aylık Toplam Ciro
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 500 }}>
                      Önceki aya göre
                    </Typography>
                    {renderGrowth(stats.growth.revenue)}
                  </Box>
                </Box>
              </StatItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatItem gradient="linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)">
                <IconBox bgcolor="#9C27B0" className="icon-box">
                  <FaTshirt size={22} color="white" />
                </IconBox>
                <Box sx={{ position: 'relative', zIndex: 1, pr: 8 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#6b21a8', mb: 0.5, lineHeight: 1 }}>
                    {stats.fittingOrders.toLocaleString('tr-TR')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#a855f7', fontWeight: 600, mb: 1.5 }}>
                    Prova Bekleyen Sipariş
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#c084fc', fontWeight: 500 }}>
                      Aktif durumda
                    </Typography>
                    {renderGrowth(stats.growth.fitting)}
                  </Box>
                </Box>
              </StatItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatItem gradient="linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)">
                <IconBox bgcolor="#00BCD4" className="icon-box">
                  <FaCheckCircle size={22} color="white" />
                </IconBox>
                <Box sx={{ position: 'relative', zIndex: 1, pr: 8 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#115e59', mb: 0.5, lineHeight: 1 }}>
                    {stats.completedOrders.toLocaleString('tr-TR')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#0891b2', fontWeight: 600, mb: 1.5 }}>
                    Tamamlanan Sipariş (30 gün)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#22d3ee', fontWeight: 500 }}>
                      Geçen aya göre
                    </Typography>
                    {renderGrowth(stats.growth.completed)}
                  </Box>
                </Box>
              </StatItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatItem gradient="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
                <IconBox bgcolor="#3F51B5" className="icon-box">
                  <FaClipboardCheck size={22} color="white" />
                </IconBox>
                <Box sx={{ position: 'relative', zIndex: 1, pr: 8 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, lineHeight: 1 }}>
                    {stats.deliveriesThisWeek.toLocaleString('tr-TR')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#475569', fontWeight: 600, mb: 1.5 }}>
                    Bu Hafta Teslim Edilecek
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Haftalık trend
                    </Typography>
                    {renderGrowth(stats.growth.deliveries)}
                  </Box>
                </Box>
              </StatItem>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Son Siparişler Tablosu */}
        <ModernPaper sx={{ mb: 6 }}>
          <Box sx={{ p: 4, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              color: '#1e293b',
              mb: 1
            }}>
              Son Eklenen Siparişler
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              En son alınan 10 sipariş
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>Sipariş No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>Müşteri</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>Ürün Tipi</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>Tutar</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} sx={{ 
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                      '&:last-child td': { border: 0 },
                      transition: 'all 0.2s ease'
                    }}>
                      <TableCell sx={{ fontWeight: 600, color: '#1e293b', borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>#{order.id}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              bgcolor: '#667eea', 
                              mr: 2,
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {order.customerName ? order.customerName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) : 'BM'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                            {order.customerName || 'Bilinmeyen Müşteri'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {order.productType || 'Belirtilmemiş'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString('tr-TR') : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                          {order.totalPrice ? formatCurrency(order.totalPrice) : '₺0'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                        <Chip 
                          label={getStatusText(order.status)}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: getStatusColor(order.status),
                            backgroundColor: alpha(getStatusColor(order.status), 0.1),
                            border: `1px solid ${alpha(getStatusColor(order.status), 0.3)}`,
                            borderRadius: 2
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, border: 0 }}>
                      <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Henüz sipariş bulunmuyor
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </ModernPaper>

        {/* Sipariş Durumları Grafiği */}
        <ModernPaper sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
            pointerEvents: 'none',
          }
        }}>
          <Box sx={{ 
            p: 4, 
            borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(255, 255, 255, 0.5) 100%)',
            position: 'relative',
            zIndex: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{
                width: 6,
                height: 28,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '3px'
              }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Sipariş Durumları 
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              color: '#64748b',
              fontWeight: 500,
              opacity: 0.9
            }}>
              Sipariş durumlarının oransal dağılımı ve detaylı analizi
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 4, 
            height: 450,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.8) 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
              pointerEvents: 'none',
            }
          }}>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" style={{ position: 'relative', zIndex: 1 }}>
                <PieChart>
                  <defs>
                    <linearGradient id="pieGradient1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#764ba2" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="pieGradient2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f093fb" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f5576c" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="pieGradient3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4facfe" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#00f2fe" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="pieGradient4" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#43e97b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#38f9d7" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="pieGradient5" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fa709a" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#fee140" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="pieGradient6" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0.9}/>
                    </linearGradient>
                    <filter id="dropshadow" height="130%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="2" dy="2" result="offset"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                                     <Pie
                     data={orderStatusData}
                     cx="50%"
                     cy="50%"
                     innerRadius={70}
                     outerRadius={160}
                     paddingAngle={4}
                     dataKey="siparisSayisi"
                     stroke="rgba(255, 255, 255, 0.8)"
                     strokeWidth={3}
                     filter="url(#dropshadow)"
                     label={({ percent }) => `%${(percent * 100).toFixed(1)}`}
                     labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pieGradient${(index % 6) + 1})`}
                      />
                    ))}
                  </Pie>
                                     <Tooltip
                     contentStyle={{
                       backgroundColor: 'rgba(255, 255, 255, 0.98)',
                       border: 'none',
                       borderRadius: '20px',
                       boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.9)',
                       fontSize: '15px',
                       fontWeight: 500,
                       backdropFilter: 'blur(25px)',
                       padding: '20px 24px',
                       minWidth: '220px',
                       textAlign: 'center'
                     }}
                     formatter={(value, name, props) => {
                       const total = orderStatusData.reduce((sum, item) => sum + item.siparisSayisi, 0);
                       const percentage = ((value / total) * 100).toFixed(1);
                       return [
                         <div style={{textAlign: 'center'}}>
                           <div style={{ 
                             fontSize: '18px', 
                             fontWeight: 700, 
                             color: '#1e293b',
                             marginBottom: '12px',
                             textTransform: 'uppercase',
                             letterSpacing: '0.5px'
                           }}>
                             📊 {props.payload.status}
                           </div>
                           <div style={{ 
                             fontSize: '20px', 
                             fontWeight: 800, 
                             color: '#667eea',
                             marginBottom: '8px'
                           }}>
                             {value} Sipariş
                           </div>
                           <div style={{ 
                             fontSize: '16px', 
                             fontWeight: 600, 
                             color: '#10b981',
                             background: 'rgba(16, 185, 129, 0.15)',
                             padding: '8px 16px',
                             borderRadius: '12px',
                             display: 'inline-block'
                           }}>
                             🎯 %{percentage}
                           </div>
                         </div>
                       ];
                     }}
                     labelStyle={{ display: 'none' }}
                   />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                flexDirection: 'column',
                gap: 3,
                position: 'relative',
                zIndex: 1
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0.3
                  }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  color: '#64748b', 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Henüz veri bulunmuyor
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#94a3b8',
                  textAlign: 'center',
                  maxWidth: 280,
                  lineHeight: 1.6,
                  fontWeight: 500
                }}>
                  Sipariş durumu verileri yüklendiğinde bu grafik otomatik olarak güncellecek
                </Typography>
              </Box>
            )}
          </Box>
        </ModernPaper>
      </Container>
    </StatsContainer>
  );
};

export default Dashboard;
