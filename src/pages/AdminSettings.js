import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableContainer, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Divider,
  Stack,
  Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaUsersCog, FaKey, FaCogs, FaChevronRight } from 'react-icons/fa';
import AdminManagers from './AdminManagers';
import ChangePassword from '../components/ChangePassword';

// Stillendirilmiş bileşenler
const SettingsCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }
}));

const SettingsCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const IconContainer = styled(Box)(({ theme, bgcolor }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: bgcolor || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  marginRight: theme.spacing(2),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(2),
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

function AdminSettings() {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'managers':
        return <AdminManagers />;
      case 'password':
        return <ChangePassword />;
      case 'general':
        return (
          <Box p={2}>
            <Typography variant="h6" gutterBottom>Genel Ayarlar</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1">
              Sistem ayarları burada görüntülenecek.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box p={2} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              Lütfen sol taraftan bir ayar seçeneği seçin
            </Typography>
          </Box>
        );
    }
  };

  const settingsOptions = [
    { 
      id: 'managers', 
      title: 'Yöneticiler', 
      icon: <FaUsersCog size={22} />, 
      description: 'Yönetici hesaplarını ekle, düzenle veya sil',
      color: '#3F51B5' 
    },
    { 
      id: 'password', 
      title: 'Şifre Değiştir', 
      icon: <FaKey size={22} />, 
      description: 'Hesap şifrenizi güncelleyin',
      color: '#009688' 
    },
    { 
      id: 'general', 
      title: 'Genel Ayarlar', 
      icon: <FaCogs size={22} />, 
      description: 'Sistem ayarlarını yapılandırın',
      color: '#FF9800' 
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Ayarlar</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Ayar Seçenekleri</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell align="right">İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settingsOptions.map((option) => (
              <TableRow 
                key={option.id}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  ...(activeSection === option.id && { backgroundColor: 'rgba(33, 150, 243, 0.08)' })
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconContainer bgcolor={option.color}>
                      {option.icon}
                    </IconContainer>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {option.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant={activeSection === option.id ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleSectionChange(option.id)}
                    endIcon={<FaChevronRight />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      minWidth: '120px'
                    }}
                  >
                    {activeSection === option.id ? 'Seçildi' : 'Seç'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      {activeSection && (
        <ContentArea>
          {renderContent()}
        </ContentArea>
      )}
    </Box>
  );
}

export default AdminSettings; 