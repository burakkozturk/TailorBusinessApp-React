import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Divider } from '@mui/material';
import { FaUsersCog, FaCogs } from 'react-icons/fa';
import AdminManagers from './AdminManagers';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AdminSettings() {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Ayarlar</Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 150,
            }
          }}
        >
          <Tab 
            icon={<FaUsersCog style={{ marginRight: '8px' }} />} 
            iconPosition="start"
            label="Yöneticiler" 
            id="settings-tab-0" 
            aria-controls="settings-tabpanel-0" 
          />
          <Tab 
            icon={<FaCogs style={{ marginRight: '8px' }} />} 
            iconPosition="start"
            label="Genel Ayarlar" 
            id="settings-tab-1" 
            aria-controls="settings-tabpanel-1" 
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AdminManagers />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>Genel Ayarlar</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1">
              Sistem ayarları burada görüntülenecek.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default AdminSettings; 