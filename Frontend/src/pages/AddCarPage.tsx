import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, MenuItem, Button, Paper, Stack, Chip, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon', 'Other'
];

const AddCarPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    availableForRental: false as boolean | undefined,
    rentalPricePerDay: '' as string | number,
    availableForSale: false as boolean | undefined,
    salePrice: '' as string | number,
    year: '' as string | number,
    color: '',
    description: '',
    mileage: '' as string | number,
    fuelType: '',
    transmission: '',
    seats: '' as string | number,
    location: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value ? Number(value) : '' }));
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

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          data.append(key, String(value));
        }
      });
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
      setError(err?.response?.data?.message || 'Failed to create car');
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
              <TextField name="rentalPricePerDay" label="Rental Price / Day" type="number" fullWidth value={form.rentalPricePerDay} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="salePrice" label="Sale Price" type="number" fullWidth value={form.salePrice} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="mileage" label="Mileage" type="number" fullWidth value={form.mileage} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="seats" label="Seats" type="number" fullWidth value={form.seats} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="fuelType" label="Fuel Type" fullWidth value={form.fuelType} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="transmission" label="Transmission" fullWidth value={form.transmission} onChange={handleChange} />
            </Grid>
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
