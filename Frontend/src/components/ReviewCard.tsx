import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  Verified,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { format } from 'date-fns';
import RatingStars from './RatingStars';
import type { Review } from '../services/reviewService';

interface ReviewCardProps {
  review: Review;
  showCarInfo?: boolean;
  showActions?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  currentUserId?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showCarInfo = false,
  showActions = false,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(review);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(review.id);
    handleMenuClose();
  };

  const canEdit = showActions && currentUserId === review.reviewerId;
  const isVerified = review.isVerified;

  return (
    <Card 
      sx={{ 
        mb: 2, 
        boxShadow: 2,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={review.reviewer.avatar}
              sx={{ 
                width: 48, 
                height: 48,
                bgcolor: 'primary.main',
                boxShadow: 2
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {review.reviewer.name}
                </Typography>
                {isVerified && (
                  <Chip
                    icon={<Verified />}
                    label="Verified"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RatingStars rating={review.rating} size="small" />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {canEdit && (
            <IconButton
              onClick={handleMenuClick}
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>

        {showCarInfo && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Review for:
            </Typography>
            <Chip
              label={`${review.car.brand} ${review.car.name} (${review.car.year})`}
              variant="outlined"
              size="small"
              sx={{ 
                backgroundColor: 'primary.50',
                borderColor: 'primary.200',
                color: 'primary.700'
              }}
            />
          </Box>
        )}

        {review.title && (
          <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
            {review.title}
          </Typography>
        )}

        {review.comment && (
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {review.comment}
          </Typography>
        )}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <Edit fontSize="small" />
            Edit Review
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ gap: 1, color: 'error.main' }}>
            <Delete fontSize="small" />
            Delete Review
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
