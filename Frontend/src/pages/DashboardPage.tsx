import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import SellIcon from '@mui/icons-material/Sell';

// Define interfaces for dashboard data
interface DashboardStats {
  totalCars: number;
  activeCars: number;
  soldCars: number;
  totalBookings: number;
  confirmedBookings: number;
  totalSales: number;
}

interface RecentCar {
  id: string;
  name: string;
  brand: string;
  year?: number;
  status: string;
  availableForRental: boolean;
  availableForSale: boolean;
  createdAt: string;
}

interface RecentBooking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  car: {
    name: string;
    brand: string;
    year?: number;
  };
}

interface RecentSale {
  id: string;
  price: number;
  date: string;
  buyer: {
    name: string;
    email: string;
  };
  car: {
    name: string;
    brand: string;
    year?: number;
  };
}

interface DashboardData {
  stats: DashboardStats;
  recentCars: RecentCar[];
  recentBookings: RecentBooking[];
  recentSales: RecentSale[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:3001/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={fetchDashboardData} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  const stats = dashboardData?.stats || {
    totalCars: 0,
    activeCars: 0,
    soldCars: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalSales: 0
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your cars and track your activity
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <DirectionsCarIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {stats.totalCars}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Cars
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {stats.activeCars}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Active Cars
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CalendarTodayIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {stats.confirmedBookings}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AttachMoneyIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                ${stats.totalSales.toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          component={Link} 
          to="/cars/new" 
          variant="contained" 
          startIcon={<AddIcon />}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Add New Car
        </Button>
        <Button 
          component={Link} 
          to="/cars" 
          variant="outlined" 
          startIcon={<SearchIcon />}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Browse Cars
        </Button>
      </Box>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Cars */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Recent Cars
                </Typography>
                <Button component={Link} to="/cars" size="small">
                  View All
                </Button>
              </Box>
              {dashboardData?.recentCars && dashboardData.recentCars.length > 0 ? (
                <List>
                  {dashboardData.recentCars.map((car, index) => (
                    <React.Fragment key={car.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <DirectionsCarIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${car.year} ${car.brand} ${car.name}`}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip 
                                label={car.status} 
                                size="small"
                                color={car.status === 'APPROVED' ? 'success' : 'warning'}
                              />
                              {car.availableForRental && (
                                <Chip label="Rental" size="small" color="info" />
                              )}
                              {car.availableForSale && (
                                <Chip label="Sale" size="small" color="secondary" />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.recentCars.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No cars yet. Add your first car to get started!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Recent Bookings
                </Typography>
                <Button size="small">
                  View All
                </Button>
              </Box>
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                <List>
                  {dashboardData.recentBookings.map((booking, index) => (
                    <React.Fragment key={booking.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            <CalendarTodayIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${booking.car.year} ${booking.car.brand} ${booking.car.name}`}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                by {booking.user.name}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={booking.status} 
                                  size="small"
                                  color={booking.status === 'CONFIRMED' ? 'success' : 'warning'}
                                />
                                <Chip 
                                  label={`$${booking.totalPrice}`} 
                                  size="small" 
                                  color="primary"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.recentBookings.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalendarTodayIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No bookings yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
