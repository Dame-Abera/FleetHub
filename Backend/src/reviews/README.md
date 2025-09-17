# 📝 Reviews Module

The Reviews module provides a comprehensive rating and review system for the FleetHub platform, allowing users to rate and review cars and car owners.

## 🏗️ Features

### Core Functionality
- **Car Reviews**: Users can review cars they've rented or purchased
- **User Reviews**: Rate and review car owners/dealers
- **Rating System**: 1-5 star rating system
- **Review Management**: Create, read, update, and delete reviews
- **Review Verification**: Admin verification system for reviews
- **Statistics**: Comprehensive review statistics for users and cars

### Advanced Features
- **Duplicate Prevention**: Users can only review each car once
- **Ownership Validation**: Ensures reviews are for the correct car owner
- **Self-Review Prevention**: Users cannot review themselves
- **Featured Reviews**: Highlight verified, high-rated reviews
- **Rating Distribution**: Detailed breakdown of rating patterns

## 🚀 API Endpoints

### Review Management
- `POST /reviews` - Create a new review
- `GET /reviews` - Get all reviews with filters
- `GET /reviews/:id` - Get specific review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Car-Specific Reviews
- `GET /reviews/car/:carId` - Get all reviews for a car
- `GET /reviews/car-stats/:carId` - Get review statistics for a car

### User-Specific Reviews
- `GET /reviews/user/:userId` - Get all reviews for a user
- `GET /reviews/stats/:userId` - Get review statistics for a user

### Admin Features
- `POST /reviews/:id/verify` - Verify a review (Admin only)
- `GET /reviews/recent/featured` - Get featured reviews

## 📊 Data Models

### Review Entity
```typescript
{
  id: string;
  carId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review Statistics
```typescript
{
  totalReviews: number;
  averageRating: number;
  minRating: number;
  maxRating: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
}
```

## 🔒 Security & Validation

### Access Control
- **Authentication Required**: All review operations require JWT authentication
- **Ownership Validation**: Users can only modify their own reviews
- **Admin Privileges**: Only admins can verify reviews
- **Self-Review Prevention**: Users cannot review themselves

### Data Validation
- **Rating Range**: 1-5 stars only
- **Text Limits**: Title (100 chars), Comment (1000 chars)
- **UUID Validation**: All IDs must be valid UUIDs
- **Duplicate Prevention**: One review per user per car

## 🎯 Business Logic

### Review Creation
1. Validate car and reviewee exist
2. Check if user has already reviewed this car
3. Ensure reviewee is the car owner
4. Prevent self-reviews
5. Create review and update statistics

### Review Updates
1. Verify user owns the review or is admin
2. Update review data
3. Recalculate user statistics if rating changed

### Review Deletion
1. Verify user owns the review or is admin
2. Delete review
3. Recalculate user statistics

## 📈 Statistics & Analytics

### User Statistics
- Total number of reviews received
- Average rating
- Rating distribution (1-5 stars)
- Min/max ratings

### Car Statistics
- Total number of reviews for the car
- Average rating for the car
- Rating distribution
- Min/max ratings

## 🔄 Integration Points

### With Cars Module
- Reviews are linked to specific cars
- Car statistics include review data
- Car listings can display average ratings

### With Users Module
- Reviews are linked to specific users
- User profiles can display review statistics
- User reputation based on reviews

### With Auth Module
- JWT authentication for all operations
- Role-based access control
- User context for review ownership

## 🧪 Testing

### Test Cases
- ✅ Create review with valid data
- ✅ Prevent duplicate reviews
- ✅ Prevent self-reviews
- ✅ Validate rating range
- ✅ Update own reviews only
- ✅ Delete own reviews only
- ✅ Admin verification
- ✅ Statistics calculation
- ✅ Featured reviews filtering

### Error Handling
- Car not found
- User not found
- Duplicate review
- Self-review attempt
- Invalid rating
- Unauthorized access
- Review not found

## 🚀 Usage Examples

### Create a Review
```typescript
const review = await reviewsService.create({
  carId: 'car-uuid',
  revieweeId: 'owner-uuid',
  rating: 5,
  title: 'Excellent car!',
  comment: 'Perfect condition, great owner!'
}, user);
```

### Get Car Reviews
```typescript
const reviews = await reviewsService.findByCar('car-uuid');
```

### Get User Statistics
```typescript
const stats = await reviewsService.getUserReviewStats('user-uuid');
```

## 🔮 Future Enhancements

- **Review Images**: Allow users to attach photos to reviews
- **Review Responses**: Allow car owners to respond to reviews
- **Review Helpfulness**: Let users vote on review helpfulness
- **Review Categories**: Categorize reviews (cleanliness, condition, etc.)
- **Review Moderation**: AI-powered review content moderation
- **Review Analytics**: Advanced analytics and insights
