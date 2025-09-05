import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const CarsPage: React.FC = () => {
  // Mock data for demonstration
  const cars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 25000,
      image: '/api/placeholder/300/200',
      mileage: 15000,
      fuelType: 'Hybrid',
      transmission: 'Automatic'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      price: 22000,
      image: '/api/placeholder/300/200',
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Manual'
    },
    {
      id: 3,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 45000,
      image: '/api/placeholder/300/200',
      mileage: 5000,
      fuelType: 'Electric',
      transmission: 'Automatic'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Browse Cars
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover your perfect vehicle from our extensive collection
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {car.year} {car.make} {car.model}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                  ${car.price.toLocaleString()}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={`${car.mileage.toLocaleString()} miles`} size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label={car.fuelType} size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label={car.transmission} size="small" sx={{ mb: 1 }} />
                </Box>
                <Button
                  component={Link}
                  to={`/cars/${car.id}`}
                  variant="contained"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CarsPage;
