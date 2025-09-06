import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Switch, 
  FormControlLabel,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Chip,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isRental, setIsRental] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get breadcrumb data based on current location
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: 'Home', href: '/', icon: <HomeIcon /> }];
    
    if (path === '/cars') {
      breadcrumbs.push({ label: 'Browse Cars', href: '/cars', icon: <DirectionsCarOutlinedIcon /> });
    } else if (path.startsWith('/cars/')) {
      breadcrumbs.push({ label: 'Browse Cars', href: '/cars', icon: <DirectionsCarOutlinedIcon /> });
      breadcrumbs.push({ label: 'Car Details', href: path, icon: <DirectionsCarIcon /> });
    } else if (path === '/dashboard') {
      breadcrumbs.push({ label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> });
    } else if (path === '/login') {
      breadcrumbs.push({ label: 'Login', href: '/login', icon: <LoginIcon /> });
    } else if (path === '/register') {
      breadcrumbs.push({ label: 'Register', href: '/register', icon: <PersonAddIcon /> });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Browse Cars', href: '/cars', icon: <DirectionsCarOutlinedIcon /> },
  ];

  const authItems = user 
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Logout', action: handleLogout, icon: <LogoutIcon /> }
      ]
    : [
        { label: 'Login', href: '/login', icon: <LoginIcon /> },
        { label: 'Register', href: '/register', icon: <PersonAddIcon /> }
      ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            FleetHub
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isRental}
              onChange={(e) => setIsRental(e.target.checked)}
              color="primary"
            />
          }
          label={isRental ? "Rental Mode" : "Sale Mode"}
          sx={{ mb: 2 }}
        />
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              selected={isActive(item.href)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        {authItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={item.href ? Link : 'div'}
              to={item.href}
              onClick={() => {
                if (item.action) item.action();
                setMobileOpen(false);
              }}
              selected={item.href ? isActive(item.href) : false}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <DirectionsCarIcon sx={{ mr: 1, fontSize: 32, color: 'white' }} />
            <Typography 
              variant="h5" 
              component={Link}
              to="/"
              sx={{ 
                fontWeight: 700,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: 'white',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              FleetHub
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {/* Home Button - Always Visible */}
              <Button 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Home
              </Button>

              {/* Other Navigation Items */}
              <Button 
                component={Link} 
                to="/cars"
                startIcon={<DirectionsCarOutlinedIcon />}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActive('/cars') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Browse Cars
              </Button>
            </>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Rental/Sale Toggle - Desktop Only */}
          {!isMobile && (
            <FormControlLabel
              control={
                <Switch
                  checked={isRental}
                  onChange={(e) => setIsRental(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff9800',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#ff9800',
                      },
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                />
              }
              label={
                <Chip 
                  label={isRental ? "Rental" : "Sale"} 
                  size="small"
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontWeight: 500
                  }} 
                />
              }
              sx={{ 
                mr: 3,
                '& .MuiFormControlLabel-label': {
                  margin: 0
                }
              }}
            />
          )}

          {/* Auth Buttons - Desktop Only */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {user ? (
                <>
                  <Button 
                    component={Link} 
                    to="/dashboard"
                    startIcon={<DashboardIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    component={Link} 
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: isActive('/login') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register"
                    startIcon={<PersonAddIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>

        {/* Breadcrumbs - Show on desktop when not on home page */}
        {!isMobile && location.pathname !== '/' && (
          <Box sx={{ px: 3, pb: 1 }}>
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
              sx={{ 
                '& .MuiBreadcrumbs-separator': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              {breadcrumbs.map((breadcrumb, index) => (
                <Button
                  key={breadcrumb.label}
                  component={Link}
                  to={breadcrumb.href}
                  startIcon={breadcrumb.icon}
                  sx={{
                    color: index === breadcrumbs.length - 1 ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }
                  }}
                >
                  {breadcrumb.label}
                </Button>
              ))}
            </Breadcrumbs>
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;