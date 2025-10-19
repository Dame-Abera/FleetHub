import React, { useState } from 'react';
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
  Divider,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { createSale } from '../services/saleService';

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
  rentalPricePerDay?: number;
  salePrice?: number;
  availableForRental?: boolean;
  availableForSale?: boolean;
  status?: string;
  images?: string[];
  features?: any;
  postedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  car: Car | null;
  onSuccess?: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ open, onClose, car, onSuccess }) => {
  const [price, setPrice] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial price when car changes
  React.useEffect(() => {
    if (car?.salePrice) {
      setPrice(car.salePrice);
    }
  }, [car]);

  const handleSubmit = async () => {
    if (!car) return;

    try {
      setLoading(true);
      setError(null);

      await createSale({
        carId: car.id,
        price,
        notes: notes.trim() || undefined
      });

      // Reset form
      setPrice(car.salePrice || 0);
      setNotes('');
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sale order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPrice(car?.salePrice || 0);
      setNotes('');
      setError(null);
      onClose();
    }
  };

  if (!car) return null;

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
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Purchase Vehicle
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a purchase order for this vehicle
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Car Information */}
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {car.year} {car.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip label={car.category} size="small" color="primary" variant="outlined" />
              <Chip label={`${car.mileage?.toLocaleString()} miles`} size="small" />
              <Chip label={car.fuelType} size="small" />
              <Chip label={car.transmission} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Listed by: {car.postedBy?.name}
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Purchase Price"
              type="number"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              placeholder="Enter your offer price"
              helperText="Enter the amount you're willing to pay"
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Listed Price"
              value={car.salePrice ? `$${car.salePrice.toLocaleString()}` : 'Not specified'}
              disabled
              helperText="Seller's asking price"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information or special requests..."
              disabled={loading}
              helperText="Optional: Add any special requests or additional information"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="body2" color="info.main" sx={{ fontWeight: 500, mb: 1 }}>
            📋 What happens next?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            1. Your purchase order will be sent to the seller<br/>
            2. The seller will review your offer<br/>
            3. You'll be notified of their decision<br/>
            4. If accepted, you can proceed with payment and pickup
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !price || price <= 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ 
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          {loading ? 'Creating Order...' : 'Create Purchase Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleForm;
