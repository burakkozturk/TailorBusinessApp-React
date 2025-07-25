import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider,
  Card,
  CardContent,
  Grid,
  Avatar,
  Fade,
  Slide
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  FaUsersCog, 
  FaKey, 
  FaCogs, 
  FaChevronRight,
  FaShieldAlt,
  FaTools
} from 'react-icons/fa';
import useDocumentTitle from '../hooks/useDocumentTitle';
import AdminManagers from './AdminManagers';
import ChangePassword from '../components/ChangePassword';

// Styled Components
const SettingsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.primary.main,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
  },
  '&:hover:before': {
    transform: 'scaleX(1)',
  }
}));

const SelectedCard = styled(SettingsCard)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  boxShadow: '0 8px 24px rgba(33, 150, 243, 0.25)',
  '&:before': {
    transform: 'scaleX(1)',
  }
}));

const IconContainer = styled(Avatar)(({ theme, bgcolor }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.8)} 100%)`,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  marginBottom: theme.spacing(2),
  fontSize: '1.5rem',
}));

const ContentArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 16,
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
  }
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  minWidth: 140,
  transition: 'all 0.3s ease',
  ...(variant === 'gradient' && {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
    }
  }),
  ...(variant === 'outlined' && {
    borderColor: theme.palette.divider,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }
  })
}));

function AdminSettings() {
  useDocumentTitle('Ayarlar');
  
  const [activeSection, setActiveSection] = useState('password');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'password':
        return <ChangePassword />;
      default:
        return <ChangePassword />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <HeaderCard>
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Ayarlar
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Hesap ayarlarınızı yönetin
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <FaKey size={32} />
            </Avatar>
          </Box>
        </CardContent>
      </HeaderCard>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={600}>
            <SelectedCard onClick={() => handleSectionChange('password')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <IconContainer bgcolor="#e53e3e">
                  <FaKey />
                </IconContainer>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Şifre Yenileme
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Hesap şifrenizi güvenli bir şekilde değiştirin
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    Şifre Güncelle
                  </Typography>
                  <FaChevronRight />
                </Box>
              </CardContent>
            </SelectedCard>
          </Fade>
        </Grid>
      </Grid>

      <ContentArea>
        <Fade in={true} timeout={800}>
          <div>
            {renderContent()}
          </div>
        </Fade>
      </ContentArea>
    </Box>
  );
}

export default AdminSettings; 