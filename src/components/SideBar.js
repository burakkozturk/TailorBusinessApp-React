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
  FaTags
} from 'react-icons/fa';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Tooltip, Avatar, IconButton, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Stillendirilmiş bileşenler
const SidebarContainer = styled(Box)(({ theme, isCollapsed }) => ({
  width: isCollapsed ? '80px' : '280px',
  height: '100vh',
  background: 'linear-gradient(180deg, #1A2C42 0%, #0B1625 100%)',
  color: '#fff',
  position: 'fixed',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.3s ease',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  overflow: 'hidden'
}));

const Logo = styled(Box)(({ theme, isCollapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  padding: isCollapsed ? '20px 0' : '24px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  background: 'linear-gradient(90deg, rgba(40, 60, 80, 0.6) 0%, rgba(20, 30, 50, 0.3) 100%)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  height: '80px',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  backgroundImage: 'linear-gradient(90deg, #64B5F6 0%, #81C784 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginLeft: '16px',
  letterSpacing: '0.5px',
}));

const NavList = styled(List)({
  padding: '10px 0',
  flexGrow: 1
});

const NavItem = styled(ListItem)(({ theme, isActive }) => ({
  padding: '12px 20px',
  margin: '4px 10px',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  ...(isActive && {
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
  })
}));

const NavIcon = styled(ListItemIcon)({
  minWidth: '36px',
  color: '#4CAF50'
});

const NavText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    color: 'white',
    fontWeight: 500
  }
});

const ToggleButton = styled(IconButton)({
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
  }
});

const ProfileSection = styled(Box)(({ theme, isCollapsed }) => ({
  padding: isCollapsed ? '10px 0' : '15px 20px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: isCollapsed ? 'center' : 'flex-start',
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
  '-ms-overflow-style': 'none',
}));

const SideBar = ({ onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  // Okunmamış mesaj sayısını almak için
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://localhost:6767/api/messages/count');
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Okunmamış mesaj sayısı alınamadı:', error);
      }
    };

    fetchUnreadCount();
    // Her 1 dakikada bir güncelle
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { path: '', label: 'Genel Bakış', icon: <FaHome size={18} /> },
    { path: 'customers', label: 'Müşteriler', icon: <FaUser size={18} /> },
    { path: 'orders', label: 'Siparişler', icon: <FaTshirt size={18} /> },
    { path: 'fabrics', label: 'Kumaşlar', icon: <FaLayerGroup size={18} /> },
    { path: 'templates', label: 'Şablonlar', icon: <FaTools size={18} /> },
    { 
      path: 'messages', 
      label: 'Mesajlar', 
      icon: 
        <Badge badgeContent={unreadCount} color="error" max={99} sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
          <FaEnvelope size={18} />
        </Badge> 
    },
    { path: 'blog', label: 'Blog', icon: <FaBlog size={18} /> },
    { path: 'categories', label: 'Kategoriler', icon: <FaTags size={18} /> },
    { path: 'settings', label: 'Ayarlar', icon: <FaCogs size={18} /> },
  ];

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState ? '80px' : '280px');
    }
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <Logo isCollapsed={isCollapsed}>
        {isCollapsed ? (
          <ProfileAvatar sx={{ width: 40, height: 40, fontSize: '1rem' }}>EG</ProfileAvatar>
        ) : (
          <>
            <ProfileAvatar>EG</ProfileAvatar>
            <LogoText variant="h6">Erdal Güda</LogoText>
          </>
        )}
      </Logo>

      <ToggleButton size="small" onClick={toggleSidebar}>
        {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
      </ToggleButton>
      
      <ScrollBox>
        <NavList>
          {menuItems.map((item) => (
            <Tooltip 
              key={item.path} 
              title={isCollapsed ? item.label : ""}
              placement="right"
              arrow
              disableHoverListener={!isCollapsed}
            >
              <NavItem 
                isActive={currentPath === item.path}
                component={Link} 
                to={`/admin/${item.path}`}
                button
              >
                <NavIcon>{item.icon}</NavIcon>
                {!isCollapsed && <NavText primary={item.label} />}
              </NavItem>
            </Tooltip>
          ))}
        </NavList>
      </ScrollBox>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      
      <ProfileSection isCollapsed={isCollapsed}>
        <Tooltip 
          title={isCollapsed ? "Çıkış Yap" : ""}
          placement="right"
          arrow
          disableHoverListener={!isCollapsed}
        >
          <NavItem 
            button
            onClick={handleLogout}
            isActive={false}
          >
            <NavIcon><FaSignOutAlt size={18} /></NavIcon>
            {!isCollapsed && <NavText primary="Çıkış Yap" />}
          </NavItem>
        </Tooltip>
      </ProfileSection>
    </SidebarContainer>
  );
};

export default SideBar;
