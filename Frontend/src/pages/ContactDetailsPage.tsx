import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, Chip, Divider, Alert, CircularProgress, Stack } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

const ContactDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const getFullAddress = () => {
    if (!user) return '';
    const parts = [user.address, user.city, user.state, user.zipCode, user.country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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

      {!loading && !error && user && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                  {user.name}
                </Typography>
                <Chip 
                  label={user.role} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                {user.bio && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    {user.bio}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">
                      <a href={`mailto:${user.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {user.email}
                      </a>
                    </Typography>
                  </Box>
                  
                  {user.phone && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">
                        <a href={`tel:${user.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {user.phone}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  
                  {user.website && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">Website</Typography>
                      <Typography variant="body1">
                        <a 
                          href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: 'primary.main' }}
                        >
                          {user.website}
                        </a>
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  Location
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {getFullAddress() ? (
                  <Stack spacing={1}>
                    {user.address && (
                      <Typography variant="body1">{user.address}</Typography>
                    )}
                    {(user.city || user.state) && (
                      <Typography variant="body1">
                        {[user.city, user.state].filter(Boolean).join(', ')}
                      </Typography>
                    )}
                    {(user.zipCode || user.country) && (
                      <Typography variant="body1">
                        {[user.zipCode, user.country].filter(Boolean).join(' ')}
                      </Typography>
                    )}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No location information provided
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {user.email && (
                    <Button
                      variant="contained"
                      startIcon={<EmailIcon />}
                      href={`mailto:${user.email}`}
                      sx={{ mb: 1 }}
                    >
                      Send Email
                    </Button>
                  )}
                  
                  {user.phone && (
                    <Button
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      href={`tel:${user.phone}`}
                      sx={{ mb: 1 }}
                    >
                      Call Now
                    </Button>
                  )}
                  
                  {user.website && (
                    <Button
                      variant="outlined"
                      startIcon={<LanguageIcon />}
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mb: 1 }}
                    >
                      Visit Website
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ContactDetailsPage;
