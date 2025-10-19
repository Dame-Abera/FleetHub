import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  DirectionsCar as DirectionsCarIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import BookingCard from '../components/BookingCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { bookingService, type Booking } from '../services/bookingService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'warning' | 'error' | 'info' | 'success';
    confirmText: string;
    onConfirm: () => void;
    loading: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    onConfirm: () => {},
    loading: false
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch all bookings
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings
  } = useQuery(
    ['bookings', statusFilter],
    () => bookingService.getBookings({ 
      status: statusFilter || undefined,
      limit: 50 
    }),
    {
      enabled: !!user,
      retry: 2,
      retryDelay: 1000,
    }
  );

  // Filter bookings based on user role
  const myBookings = bookingsData?.data.filter(booking => booking.userId === user?.id) || [];
  const ownerBookings = bookingsData?.data.filter(booking => booking.car.postedBy.id === user?.id) || [];

  // Debug logging
  console.log('Bookings Data:', bookingsData);
  console.log('My Bookings:', myBookings);
  console.log('Owner Bookings:', ownerBookings);
  console.log('Current User ID:', user?.id);
  console.log('GitHub commit test - booking functionality working!');

  // Calculate booking statistics
  const totalBookings = myBookings.length + ownerBookings.length;
  const pendingBookings = [...myBookings, ...ownerBookings].filter(b => b.status === 'PENDING').length;
  const confirmedBookings = [...myBookings, ...ownerBookings].filter(b => b.status === 'CONFIRMED').length;

  const handleRefresh = () => {
    refetchBookings();
  };

  const handleBookingEdit = (booking: Booking) => {
    // TODO: Implement booking edit functionality
    console.log('Edit booking:', booking);
  };

  const showConfirmationDialog = (
    title: string,
    message: string,
    type: 'warning' | 'error' | 'info' | 'success',
    confirmText: string,
    onConfirm: () => void
  ) => {
    setConfirmationDialog({
      open: true,
      title,
      message,
      type,
      confirmText,
      onConfirm,
      loading: false
    });
  };

  const handleBookingDelete = (booking: Booking) => {
    showConfirmationDialog(
      'Cancel Booking',
      `Are you sure you want to cancel this booking for ${booking.car.name}? This action cannot be undone.`,
      'warning',
      'Yes, Cancel Booking',
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }));
        try {
          await bookingService.deleteBooking(booking.id);
          handleRefresh();
          setConfirmationDialog(prev => ({ ...prev, open: false }));
        } catch (error) {
          console.error('Failed to delete booking:', error);
          setConfirmationDialog(prev => ({ ...prev, loading: false }));
        }
      }
    );
  };

  const handleStatusChange = (booking: Booking, newStatus: string) => {
    const actionText = newStatus === 'CONFIRMED' ? 'confirm' : 'cancel';
    const carName = booking.car.name;
    
    showConfirmationDialog(
      `${newStatus === 'CONFIRMED' ? 'Confirm' : 'Cancel'} Booking`,
      `Are you sure you want to ${actionText} this booking for ${carName}?`,
      newStatus === 'CONFIRMED' ? 'success' : 'warning',
      `Yes, ${newStatus === 'CONFIRMED' ? 'Confirm' : 'Cancel'}`,
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }));
        try {
          await bookingService.updateBooking(booking.id, { status: newStatus as any });
          handleRefresh();
          setConfirmationDialog(prev => ({ ...prev, open: false }));
        } catch (error) {
          console.error('Failed to update booking status:', error);
          setConfirmationDialog(prev => ({ ...prev, loading: false }));
        }
      }
    );
  };

  const handleCloseConfirmationDialog = () => {
    if (!confirmationDialog.loading) {
      setConfirmationDialog(prev => ({ ...prev, open: false }));
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ textAlign: 'center' }}>
          Please log in to view your bookings.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Bookings
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={bookingsLoading}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Booking Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {totalBookings}
            </Typography>
            <Typography variant="body2">
              Total Bookings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {pendingBookings}
            </Typography>
            <Typography variant="body2">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {confirmedBookings}
            </Typography>
            <Typography variant="body2">
              Confirmed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            },
          }}
        >
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label={`My Bookings (${myBookings.length})`}
            id="bookings-tab-0"
            aria-controls="bookings-tabpanel-0"
          />
          <Tab
            icon={<CalendarIcon />}
            iconPosition="start"
            label={`Car Owner Bookings (${ownerBookings.length})`}
            id="bookings-tab-1"
            aria-controls="bookings-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* My Bookings as Renter */}
          {bookingsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : bookingsError ? (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRefresh}
                >
                  Retry
                </Button>
              }
            >
              Failed to load bookings. Please try again.
            </Alert>
          ) : myBookings.length > 0 ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Your Car Bookings
              </Typography>
              {myBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={true}
                  onEdit={handleBookingEdit}
                  onDelete={handleBookingDelete}
                  onStatusChange={handleStatusChange}
                  currentUserId={user.id}
                  isOwner={false}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <DirectionsCarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {statusFilter 
                  ? `No ${statusFilter.toLowerCase()} bookings found.`
                  : "You haven't made any car bookings yet."
                }
              </Typography>
              <Button
                variant="contained"
                href="/cars"
                size="large"
              >
                Browse Cars
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Bookings for My Cars */}
          {bookingsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : bookingsError ? (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRefresh}
                >
                  Retry
                </Button>
              }
            >
              Failed to load bookings. Please try again.
            </Alert>
          ) : ownerBookings.length > 0 ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Bookings for Your Cars
              </Typography>
              {ownerBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={true}
                  onEdit={handleBookingEdit}
                  onDelete={handleBookingDelete}
                  onStatusChange={handleStatusChange}
                  currentUserId={user.id}
                  isOwner={true}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CalendarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No bookings for your cars
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {statusFilter 
                  ? `No ${statusFilter.toLowerCase()} bookings found for your cars.`
                  : "No one has booked your cars yet."
                }
              </Typography>
              <Button
                variant="contained"
                href="/cars/new"
                size="large"
              >
                Add a Car
              </Button>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={handleCloseConfirmationDialog}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        type={confirmationDialog.type}
        confirmText={confirmationDialog.confirmText}
        loading={confirmationDialog.loading}
      />
    </Container>
  );
};

export default BookingsPage;

