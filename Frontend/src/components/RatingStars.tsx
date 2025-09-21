import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showTooltip?: boolean;
  color?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  interactive = false,
  onRatingChange,
  showTooltip = false,
  color = '#ffc107'
}) => {
  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getTooltipText = (starRating: number) => {
    const ratings = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return ratings[starRating - 1] || '';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        
        const StarComponent = (
          <IconButton
            key={index}
            onClick={() => handleStarClick(starRating)}
            disabled={!interactive}
            sx={{
              padding: 0,
              cursor: interactive ? 'pointer' : 'default',
              '&:hover': interactive ? {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              } : {},
            }}
          >
            {isFilled ? (
              <Star 
                sx={{ 
                  fontSize: getStarSize(), 
                  color: color,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }} 
              />
            ) : (
              <StarBorder 
                sx={{ 
                  fontSize: getStarSize(), 
                  color: color,
                  opacity: 0.3
                }} 
              />
            )}
          </IconButton>
        );

        if (showTooltip && interactive) {
          return (
            <Tooltip key={index} title={getTooltipText(starRating)} arrow>
              {StarComponent}
            </Tooltip>
          );
        }

        return StarComponent;
      })}
    </Box>
  );
};

export default RatingStars;
