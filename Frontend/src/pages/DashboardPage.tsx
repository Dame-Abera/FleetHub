import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const recentCars = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2022, status: 'Active' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2021, status: 'Sold' },
    { id: 3, make: 'Tesla', model: 'Model 3', year: 2023, status: 'Pending' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your cars and track your activity
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                3
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Cars Listed
              </Typography>
              <Button component={Link} to="/cars/new" variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                Add New Car
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                12
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Views This Month
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                1
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Cars Sold
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                View Sales
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Cars
              </Typography>
              <Box sx={{ mt: 2 }}>
                {recentCars.map((car) => (
                  <Box
                    key={car.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <Box>
                      <Typography variant="h6">
                        {car.year} {car.make} {car.model}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Car ID: {car.id}
                      </Typography>
                    </Box>
                    <Chip
                      label={car.status}
                      color={car.status === 'Active' ? 'success' : car.status === 'Sold' ? 'default' : 'warning'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
