import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit, Delete, Search, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import '../styles/Customers.css';

const Row = ({ customer, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        className="customer-row"
        onClick={() => setOpen(!open)}
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.firstName}</TableCell>
        <TableCell>{customer.lastName}</TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.address}</TableCell>
        <TableCell>{customer.height} cm</TableCell>
        <TableCell>{customer.weight} kg</TableCell>
        <TableCell>
          <IconButton 
            color="primary" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Edit işlemi buraya gelecek
            }}
          >
            <Edit />
          </IconButton>
          <IconButton 
            color="error" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(customer.id);
            }}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detaylı Ölçüler
              </Typography>
              <pre className="measurement-text">
                {customer.ocrMeasurementText || 'Ölçü bilgisi bulunmuyor'}
              </pre>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const customersPerPage = 8;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6767/api/customers');
      setCustomers(response.data);
      setTotalPages(Math.ceil(response.data.length / customersPerPage));
      setLoading(false);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Müşteriler yüklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (customerId) => {
    setSelectedCustomerId(customerId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:6767/api/customers/safe/${selectedCustomerId}`);
      
      if (response.status === 204) {
        setCustomers(customers.filter(c => c.id !== selectedCustomerId));
        setSnackbar({
          open: true,
          message: 'Müşteri başarıyla silindi',
          severity: 'success'
        });
      } else {
        throw new Error('Müşteri silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Müşteri silinirken hata oluştu:', error);
      let errorMessage = 'Müşteri silinirken bir hata oluştu';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Müşteri bulunamadı';
        } else if (error.response.data && typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCustomerId(null);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * customersPerPage,
    page * customersPerPage
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCustomers.length / customersPerPage));
    if (page > Math.ceil(filteredCustomers.length / customersPerPage)) {
      setPage(1);
    }
  }, [filteredCustomers]);

  return (
    <div className="customers-container">
      <Box className="customers-header">
        <Typography variant="h4" component="h1">
          Müşteri Listesi
        </Typography>
        <TextField
          className="search-field"
          variant="outlined"
          placeholder="Müşteri Ara..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50px' }} />
              <TableCell>Ad</TableCell>
              <TableCell>Soyad</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell>Boy</TableCell>
              <TableCell>Kilo</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Müşteri bulunamadı</TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <Row key={customer.id} customer={customer} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && filteredCustomers.length > 0 && (
        <Box className="pagination-container">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Müşteriyi Sil</DialogTitle>
        <DialogContent>
          Bu müşteriyi silmek istediğinizden emin misiniz?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Customers; 