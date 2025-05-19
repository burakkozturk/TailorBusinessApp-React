import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  CircularProgress,
  Divider 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '500px',
  boxShadow: 'none',
  background: 'transparent'
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Doğrulama kontrolleri
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifre ve tekrarı eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/change-password', {
        username: user.username,
        currentPassword,
        newPassword
      });

      setSuccess('Şifreniz başarıyla değiştirildi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Mevcut şifreniz hatalı');
      } else {
        setError('Şifre değiştirme işlemi sırasında bir hata oluştu');
      }
      console.error('Şifre değiştirme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Şifre Değiştir</Typography>
      <Divider sx={{ mb: 3 }} />
      
      <FormContainer>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <StyledForm onSubmit={handleSubmit}>
          <TextField
            label="Mevcut Şifre"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            label="Yeni Şifre"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            helperText="En az 6 karakter olmalıdır"
          />

          <TextField
            label="Yeni Şifre (Tekrar)"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ 
              height: '48px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              maxWidth: '250px'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Şifreyi Değiştir'
            )}
          </Button>
        </StyledForm>
      </FormContainer>
    </Box>
  );
};

export default ChangePassword; 