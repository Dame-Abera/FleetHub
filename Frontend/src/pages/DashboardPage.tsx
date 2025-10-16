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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  useMediaQuery,
  TextField,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SaveIcon from '@mui/icons-material/Save';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

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
  date: string | null;
  notes?: string;
  createdAt: string;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
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
  const { user, updateProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [contactForm, setContactForm] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
    website: user?.website || '',
    bio: user?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/dashboard/stats`, {
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
  }, [user]);

  // Update contact form when user data changes
  useEffect(() => {
    if (user) {
      setContactForm({
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
        website: user.website || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveContact = async () => {
    try {
      setSaving(true);
      await updateProfile(contactForm);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to save contact details:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              Fleet Management Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Welcome back, {user?.name || 'User'} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton 
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                  position: 'relative'
                }}
              >
                <NotificationsNoneIcon />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    border: '2px solid white'
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={fetchDashboardData} 
                disabled={loading}
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button 
              component={Link} 
              to="/cars/new" 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2
              }}
            >
              Add New Vehicle
            </Button>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white',
              boxShadow: 3,
              borderRadius: 2
            }}>
              <DirectionsCarIcon sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.totalCars}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Total Vehicles
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              color: 'white',
              boxShadow: 3,
              borderRadius: 2
            }}>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.activeCars}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Active Fleet
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              color: 'white',
              boxShadow: 3,
              borderRadius: 2
            }}>
              <CalendarTodayIcon sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.confirmedBookings}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Active Bookings
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
              color: 'white',
              boxShadow: 3,
              borderRadius: 2
            }}>
              <AttachMoneyIcon sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                ${stats.totalSales.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Total Revenue
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Overview" 
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
          <Tab 
            icon={<PersonIcon />} 
            label="Profile" 
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
          <Tab 
            icon={<DirectionsCarIcon />} 
            label="My Cars" 
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Fleet Overview */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                    <DirectionsCarIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 24 }} />
                    Fleet Overview
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/cars" 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Manage Fleet
                  </Button>
                </Box>
                {dashboardData?.recentCars && dashboardData.recentCars.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {dashboardData.recentCars.slice(0, 4).map((car, index) => (
                      <React.Fragment key={car.id}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                              <DirectionsCarIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {car.year} {car.brand} {car.name}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip 
                                  label={car.status} 
                                  size="small"
                                  color={car.status === 'APPROVED' ? 'success' : 'warning'}
                                  variant="outlined"
                                />
                                {car.availableForRental && (
                                  <Chip label="Rental" size="small" color="info" variant="outlined" />
                                )}
                                {car.availableForSale && (
                                  <Chip label="Sale" size="small" color="secondary" variant="outlined" />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < Math.min(dashboardData.recentCars.length, 4) - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                 ) : (
                   <Box sx={{ textAlign: 'center', py: 6 }}>
                     <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3, opacity: 0.6 }} />
                     <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                       No vehicles in your fleet
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                       Start building your fleet by adding your first vehicle to the marketplace
                     </Typography>
                     <Button 
                       component={Link} 
                       to="/cars/new" 
                       variant="contained" 
                       size="large"
                       startIcon={<AddIcon />}
                       sx={{ 
                         borderRadius: 2,
                         px: 4,
                         py: 1.5,
                         fontWeight: 600,
                         textTransform: 'none'
                       }}
                     >
                       Add Your First Vehicle
                     </Button>
                   </Box>
                 )}
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Management */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                    <CalendarTodayIcon sx={{ mr: 1.5, color: 'info.main', fontSize: 24 }} />
                    Booking Management
                    {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 && (
                      <Chip 
                        label={dashboardData.recentBookings.length} 
                        size="small" 
                        color="info" 
                        sx={{ ml: 1.5, fontWeight: 600 }}
                      />
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh Bookings">
                      <IconButton 
                        size="small" 
                        onClick={fetchDashboardData} 
                        disabled={loading}
                        sx={{ 
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Button 
                      size="small" 
                      variant="outlined"
                      component={Link}
                      to="/bookings"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                </Box>
                {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {dashboardData.recentBookings.slice(0, 4).map((booking, index) => (
                      <React.Fragment key={booking.id}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
                              <CalendarTodayIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {booking.car.year} {booking.car.brand} {booking.car.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                 <Typography variant="body2" color="text.secondary">
                                   {booking.user.email === user?.email ? 'You rented this car' : `Rented by ${booking.user.name}`}
                                 </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                </Typography>
                                 <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                   <Chip 
                                     label={booking.status} 
                                     size="small"
                                     color={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'PENDING' ? 'warning' : 'error'}
                                     variant="outlined"
                                   />
                                   <Chip 
                                     label={`$${booking.totalPrice}`} 
                                     size="small" 
                                     color="primary"
                                     variant="outlined"
                                   />
                                   <Chip 
                                     label={`${Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`}
                                     size="small" 
                                     color="info"
                                     variant="outlined"
                                   />
                                 </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < Math.min(dashboardData.recentBookings.length, 4) - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                 ) : (
                   <Box sx={{ textAlign: 'center', py: 6 }}>
                     <CalendarTodayIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3, opacity: 0.6 }} />
                     <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                       No bookings found
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                       {user?.role === 'COMPANY_USER' 
                         ? 'Your vehicles will appear here once customers start booking them'
                         : 'Start exploring our fleet to find your perfect vehicle'
                       }
                     </Typography>
                     <Button 
                       component={Link} 
                       to="/cars" 
                       variant="contained" 
                       size="large"
                       startIcon={<DirectionsCarIcon />}
                       sx={{ 
                         borderRadius: 2,
                         px: 4,
                         py: 1.5,
                         fontWeight: 600,
                         textTransform: 'none'
                       }}
                     >
                       {user?.role === 'COMPANY_USER' ? 'Manage Fleet' : 'Browse Vehicles'}
                     </Button>
                   </Box>
                 )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sales Orders */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                    <AttachMoneyIcon sx={{ mr: 1.5, color: 'success.main', fontSize: 24 }} />
                    Sales Orders
                    {dashboardData?.recentSales && dashboardData.recentSales.length > 0 && (
                      <Chip 
                        label={dashboardData.recentSales.length} 
                        size="small" 
                        color="success" 
                        sx={{ ml: 1.5, fontWeight: 600 }}
                      />
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh Sales">
                      <IconButton 
                        size="small" 
                        onClick={fetchDashboardData} 
                        disabled={loading}
                        sx={{ 
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Button 
                      size="small" 
                      variant="outlined"
                      component={Link}
                      to="/sales"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                </Box>
                {dashboardData?.recentSales && dashboardData.recentSales.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {dashboardData.recentSales.slice(0, 5).map((sale, index) => (
                      <React.Fragment key={sale.id}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                              <AttachMoneyIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {sale.car.year} {sale.car.brand} {sale.car.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {sale.buyer.email === user?.email ? 'You purchased this car' : `Purchase offer from ${sale.buyer.name}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Order Date: {new Date(sale.createdAt).toLocaleDateString()}
                                  {sale.date && ` • Completed: ${new Date(sale.date).toLocaleDateString()}`}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                  <Chip 
                                    label={sale.date ? 'Completed' : 'Pending'} 
                                    size="small"
                                    color={sale.date ? 'success' : 'warning'}
                                    variant="outlined"
                                  />
                                  <Chip 
                                    label={`$${sale.price.toLocaleString()}`} 
                                    size="small" 
                                    color="primary"
                                    variant="outlined"
                                  />
                                  {!sale.date && sale.seller.email === user?.email && (
                                    <Chip 
                                      label="Action Required" 
                                      size="small" 
                                      color="error"
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < Math.min(dashboardData.recentSales.length, 5) - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <AttachMoneyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3, opacity: 0.6 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                      No sales orders found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                      {user?.role === 'COMPANY_USER' 
                        ? 'Your vehicle sales will appear here once customers make purchase offers'
                        : 'Your purchase orders will appear here once you make offers'
                      }
                    </Typography>
                    <Button 
                      component={Link} 
                      to="/cars" 
                      variant="contained" 
                      size="large"
                      startIcon={<DirectionsCarIcon />}
                      sx={{ 
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      {user?.role === 'COMPANY_USER' ? 'Manage Fleet' : 'Browse Vehicles'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ContactPhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Contact Information
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Complete your contact details to help potential buyers and renters reach you easily.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  placeholder="+1 (555) 123-4567"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={contactForm.website}
                  onChange={handleContactChange}
                  placeholder="https://example.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={contactForm.address}
                  onChange={handleContactChange}
                  placeholder="123 Main Street"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={contactForm.city}
                  onChange={handleContactChange}
                  placeholder="New York"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={contactForm.state}
                  onChange={handleContactChange}
                  placeholder="NY"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={contactForm.zipCode}
                  onChange={handleContactChange}
                  placeholder="10001"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={contactForm.country}
                  onChange={handleContactChange}
                  placeholder="United States"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={contactForm.bio}
                  onChange={handleContactChange}
                  placeholder="Tell us about yourself..."
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveContact}
                    disabled={saving}
                    sx={{ minWidth: 120 }}
                  >
                    {saving ? 'Saving...' : 'Save Details'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                My Cars
              </Typography>
              <Button 
                component={Link} 
                to="/cars/new" 
                variant="contained" 
                startIcon={<AddIcon />}
              >
                Add New Car
              </Button>
            </Box>
            {dashboardData?.recentCars && dashboardData.recentCars.length > 0 ? (
              <List sx={{ p: 0 }}>
                {dashboardData.recentCars.map((car, index) => (
                  <React.Fragment key={car.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                          <DirectionsCarIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                              {car.year} {car.brand} {car.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
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
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Added {new Date(car.createdAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                      <Button 
                        component={Link} 
                        to={`/cars/${car.id}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </ListItem>
                    {index < dashboardData.recentCars.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No cars yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start by adding your first car to the marketplace
                </Typography>
                <Button 
                  component={Link} 
                  to="/cars/new" 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  size="large"
                >
                  Add Your First Car
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        message="Contact details saved successfully!"
      />
    </Container>
  );
};

export default DashboardPage;
