import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Switch, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isRental, setIsRental] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <DirectionsCarIcon sx={{ mr: 2, fontSize: 32, color: 'white' }} />
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            FleetHub
          </Link>
        </Typography>
        
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
          label={isRental ? "Rental" : "Sale"}
          sx={{ 
            mr: 3, 
            color: 'white',
            fontWeight: 500,
            '& .MuiFormControlLabel-label': {
              fontSize: '0.9rem'
            }
          }}
        />

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            component={Link} 
            to="/cars"
            sx={{
              color: 'white',
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            Browse Cars
          </Button>
          
          {user ? (
            <>
              <Button 
                component={Link} 
                to="/dashboard"
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
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
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;