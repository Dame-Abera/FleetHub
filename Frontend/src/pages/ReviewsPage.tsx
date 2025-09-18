import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  Verified,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import ReviewCard from '../components/ReviewCard';
import { reviewService } from '../services/reviewService';
import type { Review } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps): React.JSX.Element {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reviews-tabpanel-${index}`}
      aria-labelledby={`reviews-tab-${index}`}
    >
      {value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null}
    </div>
  );
}

const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [page, setPage] = useState(1);
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);

  const limit = 10;

  // Fetch all reviews with filters
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery(
    ['reviews', page, ratingFilter],
    () =>
      reviewService.getReviews({
        rating: ratingFilter || undefined,
        page,
        limit,
      }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch featured reviews
  const {
    isLoading: featuredLoading,
    error: featuredError,
  } = useQuery(
    'featured-reviews',
    () => reviewService.getFeaturedReviews(6),
    {
      onSuccess: (data) => setFeaturedReviews(data),
      onError: (error) => {
        console.error('Failed to load featured reviews:', error);
        setFeaturedReviews([]);
      },
    }
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRatingFilterChange = (event: SelectChangeEvent<number | ''>) => {
    setRatingFilter(event.target.value as number | '');
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRatingFilter('');
    setPage(1);
  };

  const filteredReviews = reviewsData?.data?.filter((review) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      review.reviewer.name.toLowerCase().includes(searchLower) ||
      review.car.name.toLowerCase().includes(searchLower) ||
      review.car.brand.toLowerCase().includes(searchLower) ||
      review.title?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const hasActiveFilters = searchTerm || ratingFilter;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Reviews & Ratings
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover what our community says about cars and their owners. 
          Read authentic reviews from real users.
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
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
            icon={<Star />}
            iconPosition="start"
            label="All Reviews"
            id="reviews-tab-0"
            aria-controls="reviews-tabpanel-0"
          />
          <Tab
            icon={<Verified />}
            iconPosition="start"
            label="Featured Reviews"
            id="reviews-tab-1"
            aria-controls="reviews-tabpanel-1"
          />
        </Tabs>
      </Paper>

      {/* All Reviews Tab */}
      <TabPanel value={tabValue} index={0}>
        <>
          {/* Filters */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search reviews, cars, or users..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Minimum Rating</InputLabel>
                  <Select
                    value={ratingFilter}
                    label="Minimum Rating"
                    onChange={handleRatingFilterChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Ratings</MenuItem>
                    <MenuItem value={5}>5 Stars</MenuItem>
                    <MenuItem value={4}>4+ Stars</MenuItem>
                    <MenuItem value={3}>3+ Stars</MenuItem>
                    <MenuItem value={2}>2+ Stars</MenuItem>
                    <MenuItem value={1}>1+ Stars</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                {hasActiveFilters ? (
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    startIcon={<FilterList />}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                  {reviewsData?.pagination.total || 0} reviews found
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {reviewsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load reviews. Please try again.
          </Alert>
        )}

        {reviewsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {filteredReviews.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 4, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No reviews found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hasActiveFilters
                      ? 'Try adjusting your search criteria'
                      : 'Be the first to write a review!'}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <>
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    showCarInfo={true}
                    showActions={user?.id === review.reviewerId}
                    currentUserId={user?.id}
                  />
                ))}

                {/* Pagination */}
                {reviewsData?.pagination.pages && reviewsData.pagination.pages > 1 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={reviewsData.pagination.pages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                ) : null}
              </>
            )}
          </>
        )}
        </>
      </TabPanel>

      {/* Featured Reviews Tab */}
      <TabPanel value={tabValue} index={1}>
        <>
          {featuredError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load featured reviews. Please try again.
          </Alert>
        )}
        
        {featuredLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {featuredReviews.map((review) => (
              <Grid item xs={12} md={6} key={review.id}>
                <ReviewCard
                  review={review}
                  showCarInfo={true}
                  showActions={user?.id === review.reviewerId}
                  currentUserId={user?.id}
                />
              </Grid>
            ))}
            {featuredReviews.length === 0 && !featuredError ? (
              <Grid item xs={12}>
                <Card sx={{ textAlign: 'center', py: 4, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No featured reviews yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Featured reviews will appear here once they are verified by our team.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : null}
          </Grid>
        )}
        </>
      </TabPanel>
    </Container>
  );
};

export default ReviewsPage;
