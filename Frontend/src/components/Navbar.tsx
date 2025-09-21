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
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Fade
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import StarIcon from '@mui/icons-material/Star';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonIcon from '@mui/icons-material/Person';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isRental, setIsRental] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleUserMenuAction = (action: () => void) => {
    action();
    handleUserMenuClose();
  };

  // Get breadcrumb data based on current location
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: 'Home', href: '/', icon: <HomeIcon /> }];

    if (path === '/cars') {
      breadcrumbs.push({ label: 'Browse Cars', href: '/cars', icon: <DirectionsCarOutlinedIcon /> });
    } else if (path.startsWith('/cars/')) {
      breadcrumbs.push(
        { label: 'Browse Cars', href: '/cars', icon: <DirectionsCarOutlinedIcon /> },
        { label: 'Car Details', href: path, icon: <DirectionsCarIcon /> }
      );
    } else if (path === '/reviews') {
      breadcrumbs.push({ label: 'Reviews', href: '/reviews', icon: <StarIcon /> });
    } else if (path === '/dashboard') {
      breadcrumbs.push({ label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> });
    } else if (path === '/login') {
      breadcrumbs.push({ label: 'Login', href: '/login', icon: <LoginIcon /> });
    } else if (path === '/register') {
      breadcrumbs.push({ label: 'Register', href: '/register', icon: <PersonAddIcon /> });
    } else if (path === '/account') {
      breadcrumbs.push({ label: 'Account', href: '/account', icon: <PersonIcon /> });
    }

    return breadcrumbs;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Browse Cars', href: '/cars', icon: <DirectionsCarOutlinedIcon /> },
    { label: 'Reviews', href: '/reviews', icon: <StarIcon /> },
  ];

  const authItems = user
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Account', href: '/account', icon: <PersonAddIcon /> },
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
        {user ? (
          <>
            {/* User Info in Mobile */}
            <ListItem sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            <Divider />
            
            {/* Mobile Menu Items */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                selected={isActive('/dashboard')}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/account"
                onClick={() => setMobileOpen(false)}
                selected={isActive('/account')}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Account Settings" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText',
                  },
                }}
              >
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          authItems.map((item) => (
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
          ))
        )}
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

              <Button 
                component={Link} 
                to="/reviews"
                startIcon={<StarIcon />}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActive('/reviews') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Reviews
              </Button>
            </>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />


          {/* Auth Section - Desktop Only */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  {/* User Avatar Button */}
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      p: 0,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease'
                      }
                    }}
                  >
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 40,
                        height: 40,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        '&:hover': {
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>

                  {/* User Menu */}
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                          borderRadius: 1,
                          mx: 1,
                          my: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          }
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {/* User Info Header */}
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.email}
                      </Typography>
                    </Box>

                    {/* Menu Items */}
                    <MenuItem onClick={() => handleUserMenuAction(() => navigate('/dashboard'))}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleUserMenuAction(() => navigate('/account'))}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Account Settings</ListItemText>
                    </MenuItem>

                    <Divider sx={{ my: 1 }} />

                    <MenuItem onClick={() => handleUserMenuAction(handleLogout)}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
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
              {getBreadcrumbs().map((breadcrumb, index) => (
                <Button
                  key={breadcrumb.label}
                  component={Link}
                  to={breadcrumb.href}
                  startIcon={breadcrumb.icon}
                  sx={{
                    color: index === getBreadcrumbs().length - 1 ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: index === getBreadcrumbs().length - 1 ? 600 : 400,
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
