import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SecurityIcon from '@mui/icons-material/Security';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Find Your Perfect Car
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Rent or buy from thousands of verified listings with AI-powered recommendations
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/cars"
            sx={{ mr: 2 }}
          >
            Browse Cars
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
          >
            List Your Car
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ py: 8 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Smart Search
              </Typography>
              <Typography color="text.secondary">
                AI-powered search helps you find exactly what you're looking for
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AttachMoneyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Best Prices
              </Typography>
              <Typography color="text.secondary">
                AI pricing ensures you get the best deals on rentals and purchases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Verified Listings
              </Typography>
              <Typography color="text.secondary">
                All cars are verified and owners are background checked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;