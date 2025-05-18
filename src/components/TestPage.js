import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, Divider } from '@mui/material';
import axios from 'axios';

// Token kullanmadan direkt axios çağrısı
const api = axios.create({
  baseURL: 'http://localhost:6767',
  timeout: 5000
});

const TestPage = () => {
  const [publicResult, setPublicResult] = useState(null);
  const [customersResult, setCustomersResult] = useState(null);
  const [ordersResult, setOrdersResult] = useState(null);
  const [fabricsResult, setFabricsResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // LocalStorage'dan token bilgisini al
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedUsername = localStorage.getItem('username');
    
    console.log('LocalStorage token:', savedToken);
    console.log('LocalStorage role:', savedRole);
    console.log('LocalStorage username:', savedUsername);
    
    setToken(savedToken || '');
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setToken('');
    alert('LocalStorage temizlendi! Sayfayı yenileyiniz.');
  };

  const testPublicEndpoint = async () => {
    try {
      const response = await api.get('/test/public');
      setPublicResult(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error('Public endpoint hatası:', error);
      setErrorMsg(`Public endpoint hatası: ${error.message}`);
      setPublicResult(null);
    }
  };

  const testCustomersEndpoint = async () => {
    try {
      const response = await api.get('/test/customers');
      setCustomersResult(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error('Customers endpoint hatası:', error);
      setErrorMsg(`Customers endpoint hatası: ${error.message}`);
      setCustomersResult(null);
    }
  };

  const testOrdersEndpoint = async () => {
    try {
      const response = await api.get('/test/orders');
      setOrdersResult(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error('Orders endpoint hatası:', error);
      setErrorMsg(`Orders endpoint hatası: ${error.message}`);
      setOrdersResult(null);
    }
  };

  const testFabricsEndpoint = async () => {
    try {
      const response = await api.get('/test/fabrics');
      setFabricsResult(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error('Fabrics endpoint hatası:', error);
      setErrorMsg(`Fabrics endpoint hatası: ${error.message}`);
      setFabricsResult(null);
    }
  };

  const testRealEndpoints = async () => {
    try {
      // Token ile API çağrıları
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Müşteriler
      try {
        const customersResponse = await axios.get('http://localhost:6767/api/customers', { headers });
        console.log('Gerçek müşteriler endpoint yanıtı:', customersResponse.data);
      } catch (error) {
        console.error('Gerçek müşteriler endpoint hatası:', error);
      }
      
      // Siparişler
      try {
        const ordersResponse = await axios.get('http://localhost:6767/api/orders', { headers });
        console.log('Gerçek siparişler endpoint yanıtı:', ordersResponse.data);
      } catch (error) {
        console.error('Gerçek siparişler endpoint hatası:', error);
      }
      
      // Kumaşlar
      try {
        const fabricsResponse = await axios.get('http://localhost:6767/api/fabrics', { headers });
        console.log('Gerçek kumaşlar endpoint yanıtı:', fabricsResponse.data);
      } catch (error) {
        console.error('Gerçek kumaşlar endpoint hatası:', error);
      }
      
      setErrorMsg('Gerçek endpointler test edildi, konsolu kontrol edin!');
    } catch (error) {
      console.error('Genel hata:', error);
      setErrorMsg(`Genel hata: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>API Erişim Testi</Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Token Bilgisi</Typography>
        <Typography variant="body2" sx={{wordBreak: 'break-all', mb: 2}}>
          {token ? token : 'Token bulunamadı!'}
        </Typography>
        <Button variant="outlined" color="secondary" onClick={clearLocalStorage}>
          LocalStorage Temizle
        </Button>
      </Paper>

      {errorMsg && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{errorMsg}</Typography>
        </Paper>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={testPublicEndpoint}
            sx={{ mb: 1 }}
          >
            Public Endpoint Test
          </Button>
          {publicResult && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre>{JSON.stringify(publicResult, null, 2)}</pre>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={testCustomersEndpoint}
            sx={{ mb: 1 }}
          >
            Customers Endpoint Test
          </Button>
          {customersResult && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre>{JSON.stringify(customersResult, null, 2)}</pre>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={testOrdersEndpoint}
            sx={{ mb: 1 }}
          >
            Orders Endpoint Test
          </Button>
          {ordersResult && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre>{JSON.stringify(ordersResult, null, 2)}</pre>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={testFabricsEndpoint}
            sx={{ mb: 1 }}
          >
            Fabrics Endpoint Test
          </Button>
          {fabricsResult && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre>{JSON.stringify(fabricsResult, null, 2)}</pre>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Button 
        fullWidth 
        variant="contained" 
        color="warning"
        onClick={testRealEndpoints}
        sx={{ mt: 2 }}
      >
        Gerçek API Endpointlerini Test Et
      </Button>
    </Box>
  );
};

export default TestPage; 