import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaTshirt, 
  FaCogs, 
  FaSignOutAlt, 
  FaLayerGroup, 
  FaTools, 
  FaBlog,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaUsersCog,
  FaPalette,
  FaRobot
} from 'react-icons/fa';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Tooltip, 
  Avatar, 
  IconButton, 
  Badge,
  useTheme,
  useMediaQuery,
  AppBar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import '../styles/AIVisualizationButton.css';
import api from '../api/axiosConfig';

// Responsive constants
const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

// Stillendirilmiş bileşenler
const SidebarContainer = styled(Box)(({ theme, iscollapsed, ismobile }) => ({
  width: iscollapsed === 'true' && ismobile !== 'true' ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
  height: '100vh',
  background: 'linear-gradient(180deg, #1A2C42 0%, #0B1625 100%)',
  color: '#fff',
  position: ismobile === 'true' ? 'relative' : 'fixed',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
}));

// Mobil AppBar
const MobileAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1A2C42 0%, #2D4A6B 100%)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

// Drawer için özel stil
const DrawerContent = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100%',
  background: 'linear-gradient(180deg, #1A2C42 0%, #0B1625 100%)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
}));

const Logo = styled(Box)(({ theme, iscollapsed, ismobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: (iscollapsed === 'true' && ismobile !== 'true') ? 'center' : 'flex-start',
  padding: (iscollapsed === 'true' && ismobile !== 'true') ? '20px 0' : '24px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  background: 'linear-gradient(90deg, rgba(40, 60, 80, 0.6) 0%, rgba(20, 30, 50, 0.3) 100%)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  height: '80px',
  [theme.breakpoints.down('md')]: {
    padding: '24px 20px',
    justifyContent: 'flex-start',
  },
}));

const LogoText = styled(Typography)(({ theme, iscollapsed, ismobile }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  backgroundImage: 'linear-gradient(90deg, #64B5F6 0%, #81C784 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginLeft: '16px',
  letterSpacing: '0.5px',
  display: (iscollapsed === 'true' && ismobile !== 'true') ? 'none' : 'block',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

const NavList = styled(List)(({ theme }) => ({
  padding: '10px 0',
  flexGrow: 1,
  [theme.breakpoints.down('md')]: {
    padding: '20px 0',
  },
}));

const NavItem = styled(ListItem)(({ theme, isactive, iscollapsed, ismobile }) => ({
  padding: (iscollapsed === 'true' && ismobile !== 'true') ? '12px 12px' : '12px 20px',
  margin: '4px 10px',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  backgroundColor: isactive === 'true' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  position: 'relative',
  minHeight: 48,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  ...(isactive === 'true' && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '60%',
      backgroundColor: '#4CAF50',
      borderRadius: '0 4px 4px 0'
    }
  }),
  [theme.breakpoints.down('md')]: {
    padding: '12px 20px',
    margin: '4px 10px',
  },
}));

const NavIcon = styled(ListItemIcon)(({ theme, iscollapsed, ismobile }) => ({
  minWidth: (iscollapsed === 'true' && ismobile !== 'true') ? 'auto' : '36px',
  color: '#4CAF50',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    minWidth: '36px',
  },
}));

const NavText = styled(ListItemText)(({ theme, iscollapsed, ismobile }) => ({
  '& .MuiListItemText-primary': {
    color: 'white',
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  display: (iscollapsed === 'true' && ismobile !== 'true') ? 'none' : 'block',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

const ToggleButton = styled(IconButton)(({ theme, ismobile }) => ({
  position: 'absolute',
  right: '6px',
  top: '20px',
  backgroundColor: '#1A2C42',
  color: 'white',
  border: '2px solid rgba(255,255,255,0.3)',
  width: '32px',
  height: '32px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  '&:hover': {
    backgroundColor: '#293E58',
    boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const ProfileSection = styled(Box)(({ theme, iscollapsed, ismobile }) => ({
  padding: (iscollapsed === 'true' && ismobile !== 'true') ? '10px 0' : '15px 20px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: (iscollapsed === 'true' && ismobile !== 'true') ? 'center' : 'flex-start',
  flexDirection: (iscollapsed === 'true' && ismobile !== 'true') ? 'column' : 'row',
  gap: (iscollapsed === 'true' && ismobile !== 'true') ? '8px' : '12px',
  [theme.breakpoints.down('md')]: {
    padding: '15px 20px',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: '12px',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: 'rgba(76, 175, 80, 0.2)',
  border: '2px solid #4CAF50',
  color: '#fff',
  width: 44,
  height: 44,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}));

const ProfileInfo = styled(Box)(({ theme, iscollapsed, ismobile }) => ({
  display: (iscollapsed === 'true' && ismobile !== 'true') ? 'none' : 'flex',
  flexDirection: 'column',
  flex: 1,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '0.9rem',
  fontWeight: 600,
  lineHeight: 1.2,
}));

const ProfileRole = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.75rem',
  lineHeight: 1.2,
}));

// Box bileşenine scrollbar'ı gizleyen CSS ekliyorum
const ScrollBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  flexGrow: 1, 
  marginTop: 2,
  '&::-webkit-scrollbar': {
    width: '0px',
    background: 'transparent', // Scrollbar'ı tamamen gizle
  },
  // Firefox için
  scrollbarWidth: 'none',
  // IE ve Edge için
  msOverflowStyle: 'none',
}));

const SideBar = ({ onToggle, isCollapsed = false, isMobile = false, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isTabletScreen = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  
  const currentPath = location.pathname.split('/admin/')[1] || 'dashboard';

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/giris');
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Okunmamış mesaj sayısını almak için
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/api/messages/count');
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Okunmamış mesaj sayısı alınamadı:', error);
      }
    };

    const fetchPendingUsersCount = async () => {
      try {
        const response = await api.get('/auth/admin/pending-users/count');
        setPendingUsersCount(response.data.pendingCount);
      } catch (error) {
        console.error('Onay bekleyen kullanıcı sayısı alınamadı:', error);
      }
    };

    fetchUnreadCount();
    if (user?.role === 'ADMIN') {
      fetchPendingUsersCount();
    }
    
    // Her 1 dakikada bir güncelle
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (user?.role === 'ADMIN') {
        fetchPendingUsersCount();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const toggleSidebar = () => {
    if (!isMobile) {
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onToggle(newCollapsed);
    }
  };

  const menuItems = [
    { path: '', icon: FaHome, label: 'Genel Bakış' },
    { path: 'customers', icon: FaUser, label: 'Müşteriler' },
    { path: 'orders', icon: FaTshirt, label: 'Siparişler' },
    ...(user?.role === 'ADMIN' ? [{ path: 'ai', icon: () => <span style={{fontSize: '20px'}}>✨</span>, label: 'AI Görselleştirme', special: true }] : []),
    { path: 'messages', icon: FaEnvelope, label: 'Mesajlar', badge: unreadCount },
    { path: 'blog', icon: FaBlog, label: 'Blog Yönetimi' },
    ...(user?.role === 'ADMIN' ? [{ path: 'managers', icon: FaUsersCog, label: 'Kullanıcı Yönetimi', badge: pendingUsersCount }] : []),
    { path: 'settings', icon: FaCogs, label: 'Ayarlar' },
  ];

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Yönetici';
      case 'USTA':
        return 'Usta';
      case 'MUHASEBECI':
        return 'Muhasebeci';
      default:
        return 'Kullanıcı';
    }
  };

  // Sidebar içeriğini oluşturan fonksiyon
  const renderSidebarContent = (isMobileDrawer = false) => (
    <>
      <Logo 
        iscollapsed={(!isMobileDrawer && collapsed).toString()} 
        ismobile={isMobileDrawer.toString()}
      >
        <Avatar
          src="/img/logo.png"
          alt="Erdal Güda"
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: '#4CAF50',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
        />
        <LogoText 
          variant="h6" 
          iscollapsed={(!isMobileDrawer && collapsed).toString()} 
          ismobile={isMobileDrawer.toString()}
        >
          Erdal Güda
        </LogoText>
      </Logo>

      {!isMobileDrawer && !isMobileScreen && (
        <ToggleButton 
          onClick={toggleSidebar}
          ismobile={isMobileDrawer.toString()}
        >
          {collapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </ToggleButton>
      )}

      <ScrollBox>
        <NavList>
          {menuItems.map((item, index) => (
            <Tooltip 
              key={index} 
              title={(!isMobileDrawer && collapsed) ? item.label : ""} 
              placement="right"
            >
              <NavItem
                component={Link}
                to={`/admin/${item.path}`}
                isactive={(currentPath === item.path).toString()}
                iscollapsed={(!isMobileDrawer && collapsed).toString()}
                ismobile={isMobileDrawer.toString()}
                onClick={handleNavClick}
                className={item.special ? 'ai-visualization-button' : ''}
              >
                <NavIcon 
                  iscollapsed={(!isMobileDrawer && collapsed).toString()}
                  ismobile={isMobileDrawer.toString()}
                >
                  {item.badge && item.badge > 0 ? (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      max={99}
                    >
                      <item.icon size={20} />
                    </Badge>
                  ) : (
                    <item.icon size={20} />
                  )}
                </NavIcon>
                <NavText 
                  primary={item.label}
                  iscollapsed={(!isMobileDrawer && collapsed).toString()}
                  ismobile={isMobileDrawer.toString()}
                />
              </NavItem>
            </Tooltip>
          ))}
        </NavList>
      </ScrollBox>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

      <ProfileSection 
        iscollapsed={(!isMobileDrawer && collapsed).toString()} 
        ismobile={isMobileDrawer.toString()}
      >
        <ProfileAvatar>
          {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'EG'}
        </ProfileAvatar>
        <ProfileInfo 
          iscollapsed={(!isMobileDrawer && collapsed).toString()} 
          ismobile={isMobileDrawer.toString()}
        >
          <ProfileName>
            {user?.firstName || 'Erdal'} {user?.lastName || 'Güda'}
          </ProfileName>
          <ProfileRole>
            {getRoleText(user?.role)}
          </ProfileRole>
        </ProfileInfo>
      </ProfileSection>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

      <Box sx={{ p: 1 }}>
        <Tooltip 
          title={(!isMobileDrawer && collapsed) ? "Çıkış Yap" : ""} 
          placement="right"
        >
          <NavItem 
            onClick={handleLogout}
            iscollapsed={(!isMobileDrawer && collapsed).toString()}
            ismobile={isMobileDrawer.toString()}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(244, 67, 54, 0.1)' 
              } 
            }}
          >
            <NavIcon 
              iscollapsed={(!isMobileDrawer && collapsed).toString()}
              ismobile={isMobileDrawer.toString()}
              sx={{ color: '#f44336' }}
            >
              <FaSignOutAlt size={20} />
            </NavIcon>
            <NavText 
              primary="Çıkış Yap"
              iscollapsed={(!isMobileDrawer && collapsed).toString()}
              ismobile={isMobileDrawer.toString()}
              sx={{ 
                '& .MuiListItemText-primary': { 
                  color: '#f44336' 
                } 
              }}
            />
          </NavItem>
        </Tooltip>
      </Box>
    </>
  );

  // Mobilde DashboardLayout AppBar'ini kullan, SideBar sadece drawer olarak çalışsın
  if (isMobileScreen) {
    // Mobil için sadece drawer content'i döndür
    return (
      <DrawerContent>
        {renderSidebarContent(true)}
      </DrawerContent>
    );
  }

  // Desktop için normal sidebar
  return (
    <SidebarContainer 
      iscollapsed={collapsed.toString()} 
      ismobile="false"
    >
      {renderSidebarContent(false)}
    </SidebarContainer>
  );
};

export default SideBar;
