import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip, Divider, CardMedia, Alert, CircularProgress, Stack } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  year?: number;
  color?: string;
  description?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  location?: string;
  availableForRental: boolean;
  rentalPricePerDay?: number;
  availableForSale: boolean;
  salePrice?: number;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  postedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  features?: unknown;
}

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3001/cars/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch car details');
        }
        const data: Car = await response.json();
        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const featureList: string[] = useMemo(() => {
    if (!car || car.features == null) return [];
    const f = car.features as any;
    if (Array.isArray(f)) return f.filter((x) => typeof x === 'string');
    if (typeof f === 'object') {
      return Object.entries(f)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k);
    }
    return [];
  }, [car]);

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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && car && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              {car.images && car.images.length > 0 ? (
                <CardMedia
                  component="img"
                  image={car.images[0]}
                  alt={`${car.brand} ${car.name}`}
                  sx={{ height: 420, objectFit: 'cover' }}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <DirectionsCarIcon sx={{ fontSize: 200, color: 'primary.main', mb: 2 }} />
                </Box>
              )}
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  {car.year ? `${car.year} ` : ''}{car.brand} {car.name}
                </Typography>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  {car.availableForSale && car.salePrice
                    ? `$${car.salePrice.toLocaleString()}`
                    : car.availableForRental && car.rentalPricePerDay
                      ? `$${car.rentalPricePerDay}/day`
                      : 'Price on request'}
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
                  {car.mileage != null && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Mileage</Typography>
                      <Typography variant="h6">{car.mileage.toLocaleString()} miles</Typography>
                    </Grid>
                  )}
                  {car.fuelType && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Fuel Type</Typography>
                      <Typography variant="h6">{car.fuelType}</Typography>
                    </Grid>
                  )}
                  {car.transmission && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Transmission</Typography>
                      <Typography variant="h6">{car.transmission}</Typography>
                    </Grid>
                  )}
                  {car.color && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Color</Typography>
                      <Typography variant="h6">{car.color}</Typography>
                    </Grid>
                  )}
                  {car.seats != null && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Seats</Typography>
                      <Typography variant="h6">{car.seats}</Typography>
                    </Grid>
                  )}
                  {car.location && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="h6">{car.location}</Typography>
                    </Grid>
                  )}
                </Grid>

                {featureList.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Features
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {featureList.map((feature, index) => (
                        <Chip key={index} label={feature} sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                  </>
                )}

                <Stack direction="row" spacing={2}>
                  {car.availableForSale && (
                    <Chip color="success" label="For Sale" />
                  )}
                  {car.availableForRental && (
                    <Chip color="info" label="For Rent" />
                  )}
                </Stack>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Contact Seller
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CarDetailPage;
