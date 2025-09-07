import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, MenuItem, Button, Paper, Stack, Chip, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon', 'Other'
];

const fuelTypes = [
  'Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid', 'Other'
];

const transmissions = [
  'Automatic', 'Manual', 'CVT', 'Semi-Automatic', 'Other'
];

const AddCarPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    availableForRental: false,
    rentalPricePerDay: 0,
    availableForSale: false,
    salePrice: 0,
    year: new Date().getFullYear(),
    color: '',
    description: '',
    mileage: 0,
    fuelType: '',
    transmission: '',
    seats: 5,
    location: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value ? Number(value) : 0 }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!form.name || !form.brand || !form.category) {
      setError('Please fill in name, brand and category');
      return;
    }

    if (!form.availableForRental && !form.availableForSale) {
      setError('Please select at least one option: Available for Rental or Available for Sale');
      return;
    }

    if (form.availableForRental && (!form.rentalPricePerDay || form.rentalPricePerDay <= 0)) {
      setError('Rental price per day is required when car is available for rental');
      return;
    }

    if (form.availableForSale && (!form.salePrice || form.salePrice <= 0)) {
      setError('Sale price is required when car is available for sale');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      
      // Add all form fields
      data.append('name', form.name);
      data.append('brand', form.brand);
      data.append('category', form.category);
      data.append('availableForRental', String(form.availableForRental));
      data.append('availableForSale', String(form.availableForSale));
      
      if (form.rentalPricePerDay > 0) {
        data.append('rentalPricePerDay', String(form.rentalPricePerDay));
      }
      if (form.salePrice > 0) {
        data.append('salePrice', String(form.salePrice));
      }
      if (form.year) {
        data.append('year', String(form.year));
      }
      if (form.color) {
        data.append('color', form.color);
      }
      if (form.description) {
        data.append('description', form.description);
      }
      if (form.mileage > 0) {
        data.append('mileage', String(form.mileage));
      }
      if (form.fuelType) {
        data.append('fuelType', form.fuelType);
      }
      if (form.transmission) {
        data.append('transmission', form.transmission);
      }
      if (form.seats > 0) {
        data.append('seats', String(form.seats));
      }
      if (form.location) {
        data.append('location', form.location);
      }
      
      // Add images
      if (files) {
        Array.from(files).forEach((file) => data.append('images', file));
      }

      const token = localStorage.getItem('token');
      const res = await axios.post('/cars', data, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      });

      const carId = res.data?.id;
      if (carId) navigate(`/cars/${carId}`);
      else navigate('/cars');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error || 
                          'Failed to create car';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Add New Car
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField name="name" label="Name" fullWidth required value={form.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="brand" label="Brand" fullWidth required value={form.brand} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="category" label="Category" select fullWidth required value={form.category} onChange={handleChange}>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="year" label="Year" type="number" fullWidth value={form.year} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="mileage" label="Mileage" type="number" fullWidth value={form.mileage} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="seats" label="Seats" type="number" fullWidth value={form.seats} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="fuelType" label="Fuel Type" select fullWidth value={form.fuelType} onChange={handleChange}>
                {fuelTypes.map((fuel) => (
                  <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="transmission" label="Transmission" select fullWidth value={form.transmission} onChange={handleChange}>
                {transmissions.map((trans) => (
                  <MenuItem key={trans} value={trans}>{trans}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.availableForRental}
                      onChange={handleChange}
                      name="availableForRental"
                    />
                  }
                  label="Available for Rental"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.availableForSale}
                      onChange={handleChange}
                      name="availableForSale"
                    />
                  }
                  label="Available for Sale"
                />
              </Stack>
            </Grid>
            {form.availableForRental && (
              <Grid item xs={12} md={6}>
                <TextField name="rentalPricePerDay" label="Rental Price / Day" type="number" fullWidth value={form.rentalPricePerDay} onChange={handleNumberChange} />
              </Grid>
            )}
            {form.availableForSale && (
              <Grid item xs={12} md={6}>
                <TextField name="salePrice" label="Sale Price" type="number" fullWidth value={form.salePrice} onChange={handleNumberChange} />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField name="color" label="Color" fullWidth value={form.color} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="location" label="Location" fullWidth value={form.location} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="description" label="Description" fullWidth multiline minRows={3} value={form.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" component="label">
                  Upload Images
                  <input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
                </Button>
                {files && <Chip label={`${files.length} file(s) selected`} />}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={submitting}>Create</Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddCarPage;
