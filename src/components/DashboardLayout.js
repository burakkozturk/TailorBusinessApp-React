import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import { 
  Box, 
  styled, 
  useTheme, 
  useMediaQuery, 
  Drawer, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography 
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Responsive constants
const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: SIDEBAR_WIDTH,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

const MainContentCollapsed = styled(MainContent)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginLeft: SIDEBAR_COLLAPSED_WIDTH,
    width: `calc(100% - ${SIDEBAR_COLLAPSED_WIDTH}px)`,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const MobileAppBar = styled(AppBar)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
  background: 'linear-gradient(180deg, #1A2C42 0%, #0B1625 100%)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}));

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Top Bar */}
      <MobileAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Erdal Güda
          </Typography>
        </Toolbar>
      </MobileAppBar>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <SideBar 
          onToggle={handleSidebarCollapseChange}
          isCollapsed={sidebarCollapsed}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleSidebarClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_WIDTH,
              border: 'none',
            },
          }}
        >
          <SideBar 
            onToggle={handleSidebarCollapseChange}
            isCollapsed={false}
            isMobile={true}
            onClose={handleSidebarClose}
          />
        </Drawer>
      )}

      {/* Main Content */}
      {sidebarCollapsed && !isMobile ? (
        <MainContentCollapsed>
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
        </MainContentCollapsed>
      ) : (
        <MainContent>
          <ContentWrapper>
            {/* Mobile için top bar yüksekliği kadar boşluk */}
            {isMobile && <Box sx={{ height: 64 }} />}
            <Outlet />
          </ContentWrapper>
        </MainContent>
      )}
    </Box>
  );
};

export default DashboardLayout;
