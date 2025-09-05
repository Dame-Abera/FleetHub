import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  Chip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Search as SearchIcon,
  DirectionsCar as DirectionsCarIcon,
  AttachMoney as AttachMoneyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: "AI-Powered Search",
      description: "Find your perfect car with intelligent recommendations based on your preferences and budget."
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: "Best Market Prices",
      description: "Get the most competitive prices with our AI-driven pricing algorithm that ensures fair deals."
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: "Verified & Secure",
      description: "All vehicles and owners are thoroughly verified with comprehensive background checks."
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: "Instant Booking",
      description: "Book your car instantly with our streamlined process and instant confirmation."
    },
    {
      icon: <SupportIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any questions or issues."
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: "Market Insights",
      description: "Get real-time market data and trends to make informed decisions about your car."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Cars Available" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Car Owner",
      avatar: "SJ",
      content: "FleetHub made selling my car so easy! The AI pricing was spot-on and I got a great deal.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Car Buyer",
      avatar: "MC",
      content: "Found my dream car in just 2 days. The search filters and AI recommendations were incredible.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Frequent Renter",
      avatar: "ED",
      content: "The rental process is seamless. I've been using FleetHub for all my business trips.",
      rating: 5
    }
  ];

  return (
    <Box>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
          }
        `}
      </style>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          minHeight: { xs: '70vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Video Background */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2
          }}
        >
          <source src="/20250905-2136-14.1033037.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </Box>
        
        {/* Fallback Background for browsers that don't support video */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: -3
          }}
        />
        
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            zIndex: -1
          }}
        />
            <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="fade-in-up">
                <Typography 
                  variant={isMobile ? "h3" : "h2"} 
                  component="h1" 
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Your Perfect Car Awaits
                </Typography>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  paragraph
                  sx={{ mb: 4, opacity: 0.9 }}
                >
                  Discover, rent, or buy from thousands of verified vehicles with AI-powered recommendations and the best market prices.
                </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 4 }}
              >
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/cars"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
          >
            Browse Cars
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
          >
            List Your Car
          </Button>
              </Stack>
              
              {/* Trust Indicators */}
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Verified Listings" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500
                  }} 
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Secure Payments" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500
                  }} 
                />
                <Chip 
                  icon={<SupportIcon />} 
                  label="24/7 Support" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500
                  }} 
                />
              </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Box
                  className="fade-in-up"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    p: 4,
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <DirectionsCarIcon 
                    sx={{ 
                      fontSize: { xs: 80, md: 120 }, 
                      mb: 2,
                      opacity: 0.9
                    }} 
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, opacity: 0.9 }}>
                    Your Journey Starts Here
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {stat.number}
              </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
              </Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Why Choose FleetHub?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            We combine cutting-edge AI technology with exceptional service to revolutionize your car buying and renting experience.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
            <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
              </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              What Our Customers Say
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join thousands of satisfied customers who trust FleetHub
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
              </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.content}"
              </Typography>
                </Paper>
        </Grid>
            ))}
      </Grid>
    </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of satisfied customers and find your perfect car today
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/cars"
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Browse Cars
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;