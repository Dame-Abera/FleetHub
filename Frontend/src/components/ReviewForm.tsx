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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import RatingStars from './RatingStars';
import type { CreateReviewData, UpdateReviewData, Review } from '../services/reviewService';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewData | UpdateReviewData) => Promise<void>;
  review?: Review | null;
  carName?: string;
  ownerName?: string;
  loading?: boolean;
  error?: string;
}

interface FormData {
  rating: number;
  title: string;
  comment: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  onSubmit,
  review,
  carName,
  ownerName,
  loading = false,
  error,
}) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const isEditing = !!review;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      rating: review?.rating || 0,
      title: review?.title || '',
      comment: review?.comment || '',
    },
    mode: 'onChange',
  });

  const handleClose = () => {
    reset();
    setRating(0);
    onClose();
  };

  const handleFormSubmit = async (data: FormData) => {
    if (rating === 0) {
      return;
    }

    const submitData = {
      ...data,
      rating,
    };

    await onSubmit(submitData);
    handleClose();
  };

  const getRatingText = (rating: number) => {
    const ratings = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return ratings[rating] || '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {isEditing ? 'Edit Review' : 'Write a Review'}
        </Typography>
        {carName && ownerName && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Reviewing {carName} by {ownerName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Rating Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Rating *
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RatingStars
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
                size="large"
                showTooltip={true}
              />
              {rating > 0 && (
                <Typography variant="body1" color="primary.main" sx={{ fontWeight: 500 }}>
                  {getRatingText(rating)}
                </Typography>
              )}
            </Box>
            {rating === 0 && (
              <Typography variant="caption" color="error">
                Please select a rating
              </Typography>
            )}
          </Box>

          {/* Title Field */}
          <Controller
            name="title"
            control={control}
            rules={{
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Review Title (Optional)"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message || `${field.value?.length || 0}/100 characters`}
                placeholder="Summarize your experience..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}
          />

          {/* Comment Field */}
          <Controller
            name="comment"
            control={control}
            rules={{
              maxLength: {
                value: 1000,
                message: 'Comment must be less than 1000 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Detailed Review (Optional)"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                error={!!errors.comment}
                helperText={errors.comment?.message || `${field.value?.length || 0}/1000 characters`}
                placeholder="Share your detailed experience with this car and owner..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}
          />

          {/* Review Guidelines */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Review Guidelines:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Be honest and constructive in your feedback</li>
              <li>Focus on the car condition and owner's service</li>
              <li>Avoid personal attacks or inappropriate language</li>
              <li>Your review will help other users make informed decisions</li>
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading || rating === 0}
          sx={{ 
            borderRadius: 2,
            minWidth: 120,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            isEditing ? 'Update Review' : 'Submit Review'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;
