import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Card, CardContent, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    bio: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        website: formData.website,
        bio: formData.bio
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Join FleetHub
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Create your account to get started
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="phone"
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                name="zipCode"
                label="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
              />
            </Box>
            <TextField
              margin="normal"
              fullWidth
              name="website"
              label="Website (optional)"
              type="url"
              value={formData.website}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="bio"
              label="Bio (optional)"
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ py: 1.5, mb: 2 }}
            >
              Create Account
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" variant="body2">
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;
