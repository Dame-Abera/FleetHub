import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DirectionsCar as DirectionsCarIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { bookingService, type Booking } from '../services/bookingService';

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
  onStatusChange?: (booking: Booking, status: string) => void;
  currentUserId?: string;
  isOwner?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  showActions = false,
  onEdit,
  onDelete,
  onStatusChange,
  currentUserId,
  isOwner = false
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <PendingIcon />;
      case 'CONFIRMED':
        return <CheckCircleIcon />;
      case 'CANCELLED':
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    return bookingService.getStatusColor(status);
  };

  const canEdit = showActions && (
    currentUserId === booking.userId || 
    isOwner || 
    currentUserId === booking.car.postedBy.id
  );

  const canDelete = showActions && (
    currentUserId === booking.userId || 
    isOwner || 
    currentUserId === booking.car.postedBy.id
  ) && booking.status === 'PENDING';

  const canChangeStatus = showActions && isOwner && booking.status !== 'CANCELLED';

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(booking, newStatus);
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        '&:hover': {
          boxShadow: 2
        }
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          {/* Car Image */}
          <Grid item xs={12} sm={3} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              {booking.car.images && booking.car.images.length > 0 ? (
                <img
                  src={booking.car.images[0]}
                  alt={`${booking.car.brand} ${booking.car.name}`}
                  style={{
                    width: '100%',
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
              ) : (
                <Avatar sx={{ width: 80, height: 80, mx: 'auto' }}>
                  <DirectionsCarIcon />
                </Avatar>
              )}
            </Box>
          </Grid>

          {/* Booking Details */}
          <Grid item xs={12} sm={9} md={10}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {booking.car.year ? `${booking.car.year} ` : ''}{booking.car.brand} {booking.car.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Booking ID: {booking.id.slice(0, 8)}...
                </Typography>
              </Box>
              
              <Chip
                icon={getStatusIcon(booking.status)}
                label={booking.status}
                color={getStatusColor(booking.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {bookingService.formatDate(booking.startDate)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {bookingService.formatDate(booking.endDate)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MoneyIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Price
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      ${booking.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {currentUserId === booking.userId ? 'Owner' : 'Renter'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {currentUserId === booking.userId ? booking.car.postedBy.name : booking.user.name}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {booking.notes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Notes:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {booking.notes}
                </Typography>
              </Box>
            )}

            {/* Actions */}
            {showActions && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created: {bookingService.formatDate(booking.createdAt)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {canChangeStatus && (
                    <>
                      {booking.status === 'PENDING' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleStatusChange('CONFIRMED')}
                        >
                          Confirm
                        </Button>
                      )}
                      {booking.status !== 'CANCELLED' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleStatusChange('CANCELLED')}
                        >
                          Cancel
                        </Button>
                      )}
                    </>
                  )}

                  {canEdit && (
                    <Tooltip title="Edit booking">
                      <IconButton
                        size="small"
                        onClick={() => onEdit?.(booking)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  {canDelete && (
                    <Tooltip title="Delete booking">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete?.(booking)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

