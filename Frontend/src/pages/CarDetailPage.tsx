import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip, Divider, CardMedia, Alert, CircularProgress, Stack, Tabs, Tab, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ReviewCard from '../components/ReviewCard';
import ReviewStats from '../components/ReviewStats';
import ReviewForm from '../components/ReviewForm';
import { reviewService } from '../services/reviewService';
import type { Review, CreateReviewData, UpdateReviewData } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

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
  availableForRental: boolean;
  rentalPricePerDay?: number;
  availableForSale: boolean;
  salePrice?: number;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  postedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  features?: unknown;
}

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
      id={`car-tabpanel-${index}`}
      aria-labelledby={`car-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewFormLoading, setReviewFormLoading] = useState(false);
  const [reviewFormError, setReviewFormError] = useState<string | null>(null);

  // Fetch car details
  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cars/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch car details');
        }
        const data: Car = await response.json();
        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // Fetch reviews for this car
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery(
    ['car-reviews', id],
    () => reviewService.getReviewsByCar(id!),
    {
      enabled: !!id,
    }
  );

  // Fetch review stats for this car
  const {
    data: reviewStats,
  } = useQuery(
    ['car-review-stats', id],
    () => reviewService.getCarReviewStats(id!),
    {
      enabled: !!id,
    }
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleWriteReview = () => {
    setEditingReview(null);
    setReviewFormError(null);
    setReviewFormOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewFormError(null);
    setReviewFormOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        refetchReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const handleReviewSubmit = async (data: CreateReviewData | UpdateReviewData) => {
    if (!id || !car?.postedBy?.id) return;

    setReviewFormLoading(true);
    setReviewFormError(null);

    try {
      if (editingReview) {
        // Update existing review
        await reviewService.updateReview(editingReview.id, data as UpdateReviewData);
      } else {
        // Create new review
        await reviewService.createReview({
          ...data as CreateReviewData,
          carId: id,
          revieweeId: car.postedBy.id,
        });
      }
      
      refetchReviews();
      setReviewFormOpen(false);
    } catch (error: any) {
      setReviewFormError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewFormLoading(false);
    }
  };

  const userReview = reviews?.find(review => review.reviewerId === user?.id);

  const featureList: string[] = useMemo(() => {
    if (!car || car.features == null) return [];
    const f = car.features as any;
    if (Array.isArray(f)) return f.filter((x) => typeof x === 'string');
    if (typeof f === 'object') {
      return Object.entries(f)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k);
    }
    return [];
  }, [car]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/cars"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Cars
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && car && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                {car.images && car.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    image={car.images[0]}
                    alt={`${car.brand} ${car.name}`}
                    sx={{ height: 420, objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <DirectionsCarIcon sx={{ fontSize: 200, color: 'primary.main', mb: 2 }} />
                  </Box>
                )}
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom>
                    {car.year ? `${car.year} ` : ''}{car.brand} {car.name}
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    {car.availableForSale && car.salePrice
                      ? `$${car.salePrice.toLocaleString()}`
                      : car.availableForRental && car.rentalPricePerDay
                        ? `$${car.rentalPricePerDay}/day`
                        : 'Price on request'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Vehicle Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {car.mileage != null && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Mileage</Typography>
                        <Typography variant="h6">{car.mileage.toLocaleString()} miles</Typography>
                      </Grid>
                    )}
                    {car.fuelType && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Fuel Type</Typography>
                        <Typography variant="h6">{car.fuelType}</Typography>
                      </Grid>
                    )}
                    {car.transmission && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Transmission</Typography>
                        <Typography variant="h6">{car.transmission}</Typography>
                      </Grid>
                    )}
                    {car.color && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Color</Typography>
                        <Typography variant="h6">{car.color}</Typography>
                      </Grid>
                    )}
                    {car.seats != null && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Seats</Typography>
                        <Typography variant="h6">{car.seats}</Typography>
                      </Grid>
                    )}
                    {car.location && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Location</Typography>
                        <Typography variant="h6">{car.location}</Typography>
                      </Grid>
                    )}
                  </Grid>

                  {featureList.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Features
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        {featureList.map((feature, index) => (
                          <Chip key={index} label={feature} sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    </>
                  )}

                  <Stack direction="row" spacing={2}>
                    {car.availableForSale && (
                      <Chip color="success" label="For Sale" />
                    )}
                    {car.availableForRental && (
                      <Chip color="info" label="For Rent" />
                    )}
                  </Stack>

                  <Box sx={{ mt: 3 }}>
                    <Button
                      component={Link}
                      to={`/contact/${car.postedBy?.id}`}
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Contact Seller
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Reviews Section */}
          <Box sx={{ mt: 4 }}>
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
                  icon={<StarIcon />}
                  iconPosition="start"
                  label="Reviews & Ratings"
                  id="car-tab-0"
                  aria-controls="car-tabpanel-0"
                />
                <Tab
                  icon={<RateReviewIcon />}
                  iconPosition="start"
                  label="Write Review"
                  id="car-tab-1"
                  aria-controls="car-tabpanel-1"
                />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                {/* Review Stats */}
                {reviewStats && (
                  <Box sx={{ mb: 4 }}>
                    <ReviewStats stats={reviewStats} title="Car Reviews" />
                  </Box>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : reviewsError ? (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load reviews. Please try again.
                  </Alert>
                ) : reviews && reviews.length > 0 ? (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Customer Reviews ({reviews.length})
                    </Typography>
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        showCarInfo={false}
                        showActions={user?.id === review.reviewerId}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                        currentUserId={user?.id}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No reviews yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Be the first to review this car!
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {!user ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Please log in to write a review
                    </Typography>
                    <Button
                      component={Link}
                      to="/login"
                      variant="contained"
                      size="large"
                    >
                      Log In
                    </Button>
                  </Box>
                ) : user.id === car.postedBy?.id ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      You cannot review your own car
                    </Typography>
                  </Box>
                ) : userReview ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      You have already reviewed this car
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditReview(userReview)}
                    >
                      Edit Your Review
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Share Your Experience
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Help other users by sharing your experience with this car and its owner.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleWriteReview}
                    >
                      Write a Review
                    </Button>
                  </Box>
                )}
              </TabPanel>
            </Paper>
          </Box>

          {/* Review Form Dialog */}
          <ReviewForm
            open={reviewFormOpen}
            onClose={() => setReviewFormOpen(false)}
            onSubmit={handleReviewSubmit}
            review={editingReview}
            carName={`${car.brand} ${car.name}`}
            ownerName={car.postedBy?.name}
            loading={reviewFormLoading}
            error={reviewFormError || undefined}
          />
        </>
      )}
    </Container>
  );
};

export default CarDetailPage;
