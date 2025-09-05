import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data for demonstration
  const car = {
    id: parseInt(id || '1'),
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    color: 'Silver',
    bodyType: 'Sedan',
    engine: '2.5L 4-Cylinder',
    features: ['Bluetooth', 'Backup Camera', 'Lane Assist', 'Cruise Control', 'Heated Seats']
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/cars"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Cars
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <DirectionsCarIcon sx={{ fontSize: 200, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                {car.year} {car.make} {car.model}
              </Typography>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                ${car.price.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Vehicle Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Mileage</Typography>
                  <Typography variant="h6">{car.mileage.toLocaleString()} miles</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Fuel Type</Typography>
                  <Typography variant="h6">{car.fuelType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Transmission</Typography>
                  <Typography variant="h6">{car.transmission}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Color</Typography>
                  <Typography variant="h6">{car.color}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Body Type</Typography>
                  <Typography variant="h6">{car.bodyType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Engine</Typography>
                  <Typography variant="h6">{car.engine}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Features
              </Typography>
              <Box sx={{ mb: 3 }}>
                {car.features.map((feature, index) => (
                  <Chip key={index} label={feature} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Contact Seller
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CarDetailPage;
