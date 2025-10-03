import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { Star, People } from '@mui/icons-material';
import RatingStars from './RatingStars';
import type { ReviewStats as ReviewStatsType } from '../services/reviewService';

interface ReviewStatsProps {
  stats: ReviewStatsType;
  title?: string;
  showDistribution?: boolean;
  compact?: boolean;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({
  stats,
  title = "Review Statistics",
  showDistribution = true,
  compact = false,
}) => {
  const { totalReviews, averageRating, ratingDistribution } = stats;

  const getRatingPercentage = (rating: number) => {
    const distribution = ratingDistribution.find(d => d.rating === rating);
    return distribution ? (distribution.count / totalReviews) * 100 : 0;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#4caf50';
    if (rating >= 3.5) return '#8bc34a';
    if (rating >= 2.5) return '#ff9800';
    if (rating >= 1.5) return '#ff5722';
    return '#f44336';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    if (rating >= 1.5) return 'Below Average';
    return 'Poor';
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RatingStars rating={Math.round(averageRating)} size="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {averageRating.toFixed(1)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>

        <Grid container spacing={3}>
          {/* Overall Rating */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <RatingStars rating={Math.round(averageRating)} size="large" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: getRatingColor(averageRating) }}>
                {averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {getRatingLabel(averageRating)}
              </Typography>
              <Chip
                icon={<People />}
                label={`${totalReviews} review${totalReviews !== 1 ? 's' : ''}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Rating Distribution */}
          {showDistribution && (
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Rating Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const percentage = getRatingPercentage(rating);
                  const count = ratingDistribution.find(d => d.rating === rating)?.count || 0;
                  
                  return (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 60 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {rating}
                        </Typography>
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getRatingColor(rating),
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40, textAlign: 'right' }}>
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Additional Stats */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {stats.maxRating}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Highest Rating
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {stats.minRating}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Lowest Rating
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {totalReviews}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Reviews
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewStats;
