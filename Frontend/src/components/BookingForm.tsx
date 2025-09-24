import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { bookingService, type CreateBookingData } from '../services/bookingService';

interface Car {
  id: string;
  name: string;
  brand: string;
  year?: number;
  rentalPricePerDay?: number;
  images: string[];
  postedBy?: {
    id: string;
    name: string;
  };
}

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: any) => void;
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ open, onClose, onSuccess, car }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStartDate('');
      setEndDate('');
      setNotes('');
      setError(null);
      setTotalPrice(0);
    }
  }, [open]);

  // Calculate total price when dates change
  useEffect(() => {
    if (startDate && endDate && car.rentalPricePerDay) {
      const total = bookingService.calculateTotalPrice(
        car.rentalPricePerDay,
        startDate,
        endDate
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, car.rentalPricePerDay]);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (!user) {
      setError('Please log in to make a booking');
      return;
    }

    // Validate dates
    const validation = bookingService.validateDates(startDate, endDate);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingData: CreateBookingData = {
        carId: car.id,
        startDate,
        endDate,
        totalPrice,
        notes: notes.trim() || undefined
      };

      const booking = await bookingService.createBooking(bookingData);
      onSuccess(booking);
      onClose();
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Book This Car
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {car.year ? `${car.year} ` : ''}{car.brand} {car.name}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Car Info */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Car Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {car.images && car.images.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={car.images[0]}
                        alt={`${car.brand} ${car.name}`}
                        style={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                    </Box>
                  )}

                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Daily Rate
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${car.rentalPricePerDay?.toFixed(2) || '0.00'}/day
                    </Typography>
                    
                    {car.postedBy && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Owner
                        </Typography>
                        <Typography variant="body1">
                          {car.postedBy.name}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Booking Form */}
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: startDate || new Date().toISOString().split('T')[0]
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <TextField
                label="Additional Notes (Optional)"
                multiline
                rows={3}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or additional information..."
                sx={{ mb: 3 }}
              />

              {/* Price Summary */}
              {totalPrice > 0 && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Booking Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {days} day{days !== 1 ? 's' : ''} × ${car.rentalPricePerDay?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          ${(car.rentalPricePerDay || 0) * days}
                        </Typography>
                      </Box>
                      
                      <Divider />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">
                          Total
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !startDate || !endDate || totalPrice <= 0}
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating Booking...' : 'Book Now'}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default BookingForm;

