import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  DirectionsCar as DirectionsCarIcon,
  Search,
  AttachMoney,
  CalendarToday,
  Speed,
  LocalGasStation,
  Settings
} from '@mui/icons-material';

// Define the car interface based on backend response
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
  postedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface CarsResponse {
  data: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const CarsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (activeTab === 0) {
        params.append('availableForSale', 'true');
      } else {
        params.append('availableForRental', 'true');
      }
      
      if (searchTerm) {
        params.append('brand', searchTerm);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cars?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      
      const data: CarsResponse = await response.json();
      setCars(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars when component mounts or filters change
  useEffect(() => {
    fetchCars();
  }, [activeTab, searchTerm]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredCars = cars.filter(car => {
    const matchesTab = activeTab === 0 ? car.availableForSale : car.availableForRental;
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuel = !fuelType || car.fuelType === fuelType;
    const matchesTransmission = !transmission || car.transmission === transmission;
    
    return matchesTab && matchesSearch && matchesFuel && matchesTransmission;
  });

  return (
    <Box>
    

      {/* Sub Navigation Tabs */}
      <Slide direction="down" in timeout={1000}>
        <Paper sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 0
        }}>
          <Container maxWidth="lg">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  py: 2,
                  minHeight: 60,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: 2,
                }
              }}
            >
              <Tab 
                label="Buy Cars" 
                icon={<AttachMoney />}
                iconPosition="start"
              />
              <Tab 
                label="Rent Cars" 
                icon={<CalendarToday />}
                iconPosition="start"
              />
            </Tabs>
          </Container>
        </Paper>
      </Slide>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search and Filters */}
        <Slide direction="up" in timeout={1200}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select
                    value={fuelType}
                    label="Fuel Type"
                    onChange={(e) => setFuelType(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Gasoline">Gasoline</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Transmission</InputLabel>
                  <Select
                    value={transmission}
                    label="Transmission"
                    onChange={(e) => setTransmission(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Chip
                    label={`${filteredCars.length} cars found`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Slide>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Cars Grid */}
        {!loading && !error && (
          <Slide direction="up" in timeout={1400}>
            <Grid container spacing={3}>
              {filteredCars.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.brand} ${car.name}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Box sx={{ 
                        display: car.images && car.images.length > 0 ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}>
                        <DirectionsCarIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                      </Box>
                      <Chip
                        label={activeTab === 0 ? 'For Sale' : 'For Rent'}
                        color={activeTab === 0 ? 'success' : 'info'}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          fontWeight: 600
                        }}
                      />
                    </CardMedia>
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                        {car.year} {car.brand} {car.name}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                          {activeTab === 0 
                            ? `$${car.salePrice?.toLocaleString() || 'N/A'}` 
                            : `$${car.rentalPricePerDay || 'N/A'}/day`
                          }
                        </Typography>
                        {activeTab === 1 && car.salePrice && (
                          <Typography variant="body2" color="text.secondary">
                            Purchase: ${car.salePrice.toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                        {car.mileage && (
                          <Chip 
                            icon={<Speed />}
                            label={`${car.mileage.toLocaleString()} miles`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                        {car.fuelType && (
                          <Chip 
                            icon={<LocalGasStation />}
                            label={car.fuelType} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                        {car.transmission && (
                          <Chip 
                            icon={<Settings />}
                            label={car.transmission} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      <Button
                        component={Link}
                        to={`/cars/${car.id}`}
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                          mt: 'auto',
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        {activeTab === 0 ? 'Buy Now' : 'Rent Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Slide>
        )}

        {/* No Results */}
        {!loading && !error && filteredCars.length === 0 && (
          <Fade in timeout={1600}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <DirectionsCarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No cars found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default CarsPage;
