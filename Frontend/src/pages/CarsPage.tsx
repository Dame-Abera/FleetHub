import React, { useState } from 'react';
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
  Slide
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

const CarsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for demonstration
  const cars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 25000,
      rentalPrice: 120,
      image: '/api/placeholder/300/200',
      mileage: 15000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      type: 'buy'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      price: 22000,
      rentalPrice: 100,
      image: '/api/placeholder/300/200',
      mileage: 25000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      type: 'buy'
    },
    {
      id: 3,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 45000,
      rentalPrice: 200,
      image: '/api/placeholder/300/200',
      mileage: 5000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      type: 'rent'
    },
    {
      id: 4,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 55000,
      rentalPrice: 250,
      image: '/api/placeholder/300/200',
      mileage: 12000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      type: 'rent'
    },
    {
      id: 5,
      make: 'Audi',
      model: 'A4',
      year: 2021,
      price: 35000,
      rentalPrice: 150,
      image: '/api/placeholder/300/200',
      mileage: 18000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      type: 'buy'
    },
    {
      id: 6,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2023,
      price: 42000,
      rentalPrice: 180,
      image: '/api/placeholder/300/200',
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      type: 'rent'
    }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredCars = cars.filter(car => {
    const matchesTab = activeTab === 0 ? car.type === 'buy' : car.type === 'rent';
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
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

        {/* Cars Grid */}
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
                    <DirectionsCarIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                    <Chip
                      label={car.type === 'buy' ? 'For Sale' : 'For Rent'}
                      color={car.type === 'buy' ? 'success' : 'info'}
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
                      {car.year} {car.make} {car.model}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                        {activeTab === 0 ? `$${car.price.toLocaleString()}` : `$${car.rentalPrice}/day`}
                      </Typography>
                      {activeTab === 1 && (
                        <Typography variant="body2" color="text.secondary">
                          Purchase: ${car.price.toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        icon={<Speed />}
                        label={`${car.mileage.toLocaleString()} miles`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<LocalGasStation />}
                        label={car.fuelType} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<Settings />}
                        label={car.transmission} 
                        size="small" 
                        variant="outlined"
                      />
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
                      {activeTab === 0 ? 'View Details' : 'Rent Now'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Slide>

        {/* No Results */}
        {filteredCars.length === 0 && (
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
