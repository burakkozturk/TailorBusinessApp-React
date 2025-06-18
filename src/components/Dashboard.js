import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  CircularProgress, 
  Paper, 
  Container,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  FaUsers, 
  FaShoppingBag, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaCut,
  FaTshirt, 
  FaClipboardCheck, 
  FaArrowUp, 
  FaArrowDown 
} from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend as RechartsLegend,
  AreaChart,
  Area 
} from 'recharts';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Stillendirilmiş bileşenler
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const GradientBackground = styled(Box)(({ startColor, endColor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
  opacity: 0.92,
  borderRadius: 20,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 20,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const IconAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  backgroundColor: bgcolor || alpha('#fff', 0.2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ProgressBar = styled(LinearProgress)(({ theme, color }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(color || theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    backgroundColor: color || theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const StatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  fontSize: 12,
  fontWeight: 600,
  color: statuscolor,
  backgroundColor: alpha(statuscolor, 0.1),
  border: `1px solid ${alpha(statuscolor, 0.3)}`,
  borderRadius: 20,
  padding: '2px 8px',
}));

// Pasta grafiği renkleri
const COLORS = ['#2196F3', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#45B39D', '#F39C12'];

const Dashboard = () => {
  useDocumentTitle('Genel Bakış');
  
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    growth: {
      customers: 12.5,
      orders: 8.3,
      revenue: 15.2,
      completedOrders: 9.7
    }
  });
  const [orderStatus, setOrderStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [productData, setProductData] = useState([]);

  // Browser uyumluluğu için CSS polyfill
  useEffect(() => {
    // Chart elemanlarının tüm tarayıcılarda görünürlüğünü sağlayacak CSS ayarları
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .recharts-wrapper {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        overflow: visible !important;
      }
      .recharts-surface {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        overflow: visible !important;
      }
      .recharts-legend-wrapper {
        position: absolute !important;
      }
      .recharts-default-tooltip {
        border-radius: 5px !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
      }
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke: rgba(0,0,0,0.1) !important;
      }
      
      /* Tarayıcı-spesifik çözümler */
      @supports (-webkit-appearance:none) {
        .recharts-surface {
          overflow: visible !important;
          position: absolute !important;
        }
        .recharts-wrapper {
          overflow: hidden !important;
        }
      }
      
      /* Chrome için özel düzeltmeler */
      @media screen and (-webkit-min-device-pixel-ratio:0) {
        .recharts-wrapper {
          contain: none !important;
        }
        .recharts-surface {
          contain: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gerçek API çağrınızı yapın, şu anda örnek veri kullanıyoruz
        // const response = await axios.get('http://localhost:8080/api/dashboard/stats');
        // setStats(response.data);
        
        // Örnek istatistikler
        setStats({
          totalCustomers: 328,
          totalOrders: 517,
          totalRevenue: 1785500,
          completedOrders: 423,
          growth: {
            customers: 12.5,
            orders: 8.3,
            revenue: 15.2,
            completedOrders: 9.7
          }
        });

        // Sipariş durumu dağılımı için örnek veri
        setOrderStatus([
          { name: 'Hazırlanıyor', value: 32 },
          { name: 'Kesim', value: 18 },
          { name: 'Dikim', value: 24 },
          { name: 'Prova', value: 16 },
          { name: 'Hazır', value: 28 },
          { name: 'Teslim Edildi', value: 10 },
        ]);

        // Son siparişler için örnek veri
        setRecentOrders([
          { id: 1245, productType: 'CEKET', customer: { firstName: 'Ahmet', lastName: 'Yılmaz' }, orderDate: '2025-05-12', status: 'PREPARING', totalPrice: 3200 },
          { id: 1244, productType: 'GÖMLEK', customer: { firstName: 'Mehmet', lastName: 'Demir' }, orderDate: '2025-05-10', status: 'CUTTING', totalPrice: 1500 },
          { id: 1243, productType: 'PANTOLON', customer: { firstName: 'Buğra', lastName: 'Kılıç' }, orderDate: '2025-05-08', status: 'SEWING', totalPrice: 1800 },
          { id: 1242, productType: 'TAKIM', customer: { firstName: 'Oğuz', lastName: 'Aktürk' }, orderDate: '2025-05-05', status: 'READY', totalPrice: 5500 },
          { id: 1241, productType: 'PANTOLON', customer: { firstName: 'Serkan', lastName: 'Öz' }, orderDate: '2025-05-03', status: 'DELIVERED', totalPrice: 2200 },
        ]);

        // Aylık veriler için örnek
        setMonthlyData([
          { name: 'Oca', siparişler: 45, ciro: 125000 },
          { name: 'Şub', siparişler: 58, ciro: 168000 },
          { name: 'Mar', siparişler: 62, ciro: 197000 },
          { name: 'Nis', siparişler: 75, ciro: 238000 },
          { name: 'May', siparişler: 72, ciro: 225000 },
          { name: 'Haz', siparişler: 80, ciro: 267000 },
          { name: 'Tem', siparişler: 82, ciro: 280000 },
          { name: 'Ağu', siparişler: 78, ciro: 255000 },
        ]);

        // Ürün dağılımı için örnek veriler
        setProductData([
          { name: 'Takım Elbise', value: 28 },
          { name: 'Ceket', value: 35 },
          { name: 'Pantolon', value: 22 },
          { name: 'Gömlek', value: 10 },
          { name: 'Yelek', value: 5 },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Dashboard verisi yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  // Büyüme göstergesini renk ve icon olarak döndürür
  const renderGrowth = (value) => {
    const isPositive = value >= 0;
    const color = isPositive ? '#FFFFFF' : '#FFCDD2';
    const ArrowIcon = isPositive ? FaArrowUp : FaArrowDown;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ArrowIcon size={12} color={color} style={{ marginRight: '2px' }} />
        <Typography 
          variant="caption" 
          sx={{ 
            color: color, 
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.3px'
          }}
        >
          {Math.abs(value).toFixed(1)}%
        </Typography>
      </Box>
    );
  };

  // İstatistik kartı
  const StatCardItem = ({ title, value, icon, startColor, endColor, subtitle, growth }) => (
    <StatCard>
      <GradientBackground startColor={startColor} endColor={endColor} />
      <CardContent sx={{ position: 'relative', zIndex: 10, p: 3.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500, mb: 1, opacity: 0.9, fontSize: '1rem' }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2, letterSpacing: '-0.5px' }}>
              {value}
            </Typography>
            {subtitle && (
              <Box display="flex" alignItems="center" spacing={1}>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, fontWeight: 500 }}>
                  {subtitle}
                </Typography>
                {growth !== undefined && (
                  <Box 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha('#fff', 0.2), 
                      borderRadius: 10, 
                      px: 1.5, 
                      py: 0.5, 
                      display: 'flex', 
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {renderGrowth(growth)}
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <IconAvatar bgcolor={alpha('#fff', 0.2)} sx={{ boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
            {icon}
          </IconAvatar>
        </Box>
      </CardContent>
    </StatCard>
  );

  // Recharts Wrapper bileşeni - tüm tarayıcılarda tutarlı render için
  const ChartWrapper = ({ children, height }) => {
    return (
      <Box 
        sx={{ 
          height: height || 360, 
          width: '100%', 
          position: 'relative',
          '& .recharts-wrapper': {
            position: 'absolute !important',
            left: 0,
            top: 0,
            width: '100% !important', 
            height: '100% !important'
          }
        }}
      >
        {children}
      </Box>
    );
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 800,
          position: 'relative',
          display: 'inline-block',
          background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '60px',
            height: '4px',
            bottom: '-10px',
            left: '0',
            background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
            borderRadius: '10px'
          }
        }}>
           Genel Bakış
        </Typography>
        
        <Box>
          <IconButton onClick={handleMenuClick}>
            <BsThreeDotsVertical />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>Yenile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Rapor Oluştur</MenuItem>
            <MenuItem onClick={handleMenuClose}>Ayarlar</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCardItem 
            title="Toplam Müşteri" 
            value={stats.totalCustomers.toLocaleString('tr-TR')}
            icon={<FaUsers size={30} color="white" />}
            startColor="#4CAF50"
            endColor="#2E7D32"
            subtitle="Son 30 günde"
            growth={stats.growth.customers}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCardItem 
            title="Toplam Sipariş" 
            value={stats.totalOrders.toLocaleString('tr-TR')}
            icon={<FaShoppingBag size={30} color="white" />}
            startColor="#2196F3"
            endColor="#0D47A1"
            subtitle="Son 30 günde"
            growth={stats.growth.orders}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCardItem 
            title="Toplam Ciro" 
            value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(stats.totalRevenue)}
            icon={<FaMoneyBillWave size={30} color="white" />}
            startColor="#FF9800"
            endColor="#E65100"
            subtitle="Son 30 günde"
            growth={stats.growth.revenue}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCardItem 
            title="Tamamlanan Siparişler" 
            value={stats.completedOrders.toLocaleString('tr-TR')}
            icon={<FaCheckCircle size={30} color="white" />}
            startColor="#9C27B0"
            endColor="#4A148C"
            subtitle="Toplam siparişlerin %82'si"
            growth={stats.growth.completedOrders}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCardItem 
            title="Bekleyen Siparişler" 
            value={94}
            icon={<FaClipboardCheck size={30} color="white" />}
            startColor="#00BCD4"
            endColor="#006064"
            subtitle="Toplam siparişlerin %18'i"
            growth={7.2}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCardItem 
            title="Ortalama Sipariş" 
            value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(3450)}
            icon={<FaCut size={30} color="white" />}
            startColor="#3F51B5"
            endColor="#1A237E"
            subtitle="Son 30 günde"
            growth={5.8}
          />
        </Grid>
      </Grid>
      
      {/* Ana İçerik */}
      <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
            <StyledPaper sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#2196F3',
                  borderRadius: '4px',
                  marginRight: '12px'
                }
              }}>
                Aylık Sipariş ve Ciro Analizi
              </Typography>
              <Tooltip title="Bu yıla ait aylık sipariş ve ciro verilerini gösterir">
                <IconButton>
                  <BsThreeDotsVertical size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <ChartWrapper height={360}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} yAxisId="left" />
                  <YAxis axisLine={false} tickLine={false} yAxisId="right" orientation="right" />
                  <RechartsTooltip 
                    formatter={(value, name) => {
                      if (name === "siparişler") return [`${value} sipariş`, "Sipariş Sayısı"];
                      return [`₺${value.toLocaleString('tr-TR')}`, "Toplam Ciro"];
                    }}
                  />
                  <RechartsLegend />
                  <Area
                    type="monotone"
                    dataKey="siparişler"
                    name="siparişler"
                    stroke="#2196F3"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="ciro"
                    name="ciro"
                    stroke="#4CAF50"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    yAxisId="right"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </StyledPaper>
        </Grid>

        {/* Sipariş Durumu Pasta Grafiği */}
        <Grid item xs={12} lg={4}>
          <StyledPaper sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#FF9800',
                  borderRadius: '4px',
                  marginRight: '12px'
                }
              }}>
                Sipariş Durumu Dağılımı
              </Typography>
              <Tooltip title="Aktif siparişlerin durum dağılımı">
                <IconButton>
                  <BsThreeDotsVertical size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <ChartWrapper height={360}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value, name, props) => {
                      const percent = ((value / orderStatus.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                      return [`${value} sipariş (${percent}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                {orderStatus.map((status, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: COLORS[index % COLORS.length],
                          mr: 1 
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {status.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Ürün Dağılımı */}
        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#9C27B0',
                  borderRadius: '4px',
                  marginRight: '12px'
                }
              }}>
                Ürün Dağılımı
              </Typography>
              <Tooltip title="Ürünlerin satış dağılımı">
                <IconButton>
                  <BsThreeDotsVertical size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <ChartWrapper height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <RechartsTooltip formatter={(value) => [`${value} sipariş`, 'Miktar']} />
                  <Bar 
                    dataKey="value" 
                    fill="#9C27B0" 
                    radius={[0, 6, 6, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </StyledPaper>
        </Grid>

        {/* En Son Siparişler */}
        <Grid item xs={12} md={8}>
          <StyledPaper sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#2196F3',
                  borderRadius: '4px',
                  marginRight: '12px'
                }
              }}>
                Son Siparişler
              </Typography>
              <Tooltip title="En son alınan siparişler">
                <IconButton>
                  <BsThreeDotsVertical size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ overflowX: 'auto' }}>
              <Box component="table" sx={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: '0 8px',
                '& tr': {
                  transition: 'all 0.2s'
                },
                '& tr:hover': {
                  transform: 'translateX(5px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                },
                '& th': {
                  padding: '12px 16px',
                  borderBottom: '2px solid #f0f0f0',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#666'
                },
                '& td': {
                  padding: '12px 16px',
                  backgroundColor: '#fafafa',
                  '&:first-of-type': { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
                  '&:last-of-type': { borderTopRightRadius: 10, borderBottomRightRadius: 10 }
                }
              }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Müşteri</th>
                    <th>Ürün</th>
                    <th>Tarih</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: '#2196F3', 
                              mr: 1,
                              fontSize: '0.875rem'
                            }}
                          >
                            {order.customer.firstName.charAt(0)}{order.customer.lastName.charAt(0)}
                          </Avatar>
                          {order.customer.firstName} {order.customer.lastName}
                        </Box>
                      </td>
                      <td>{order.productType}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <Typography fontWeight="600">
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalPrice)}
                        </Typography>
                      </td>
                      <td>
                        <StatusChip 
                          label={getStatusText(order.status)}
                          statuscolor={getStatusColor(order.status)}
                          size="small"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
