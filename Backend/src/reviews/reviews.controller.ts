import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Logger,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  private readonly logger = new Logger(ReviewsController.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  async create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {
    try {
      this.logger.log(`Creating review for car ${createReviewDto.carId} by user ${user.id}`);
      
      // Validate that user is not reviewing themselves
      if (createReviewDto.revieweeId === user.id) {
        throw new BadRequestException('You cannot review yourself');
      }

      const review = await this.reviewsService.create(createReviewDto, user);
      this.logger.log(`Successfully created review with ID: ${review.id}`);
      return review;
    } catch (error) {
      this.logger.error(`Failed to create review for user ${user.id}:`, error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with optional filters' })
  @ApiQuery({ name: 'carId', required: false, description: 'Filter by car ID' })
  @ApiQuery({ name: 'revieweeId', required: false, description: 'Filter by reviewee ID' })
  @ApiQuery({ name: 'reviewerId', required: false, description: 'Filter by reviewer ID' })
  @ApiQuery({ name: 'rating', required: false, description: 'Filter by minimum rating' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async findAll(
    @Query('carId') carId?: string,
    @Query('revieweeId') revieweeId?: string,
    @Query('reviewerId') reviewerId?: string,
    @Query('rating') rating?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.reviewsService.findAll({
      carId,
      revieweeId,
      reviewerId,
      rating,
      page,
      limit
    });
  }

  @Get('car/:carId')
  @ApiOperation({ summary: 'Get all reviews for a specific car' })
  async findByCar(@Param('carId') carId: string) {
    return this.reviewsService.findByCar(carId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews for a specific user' })
  async findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get review statistics for a user' })
  async getUserReviewStats(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviewStats(userId);
  }

  @Get('car-stats/:carId')
  @ApiOperation({ summary: 'Get review statistics for a car' })
  async getCarReviewStats(@Param('carId') carId: string) {
    return this.reviewsService.getCarReviewStats(carId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review' })
  async update(
    @Param('id') id: string, 
    @Body() updateReviewDto: UpdateReviewDto, 
    @GetUser() user: User
  ) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.reviewsService.remove(id, user);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a review (Admin only)' })
  async verifyReview(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== 'ADMIN') {
      throw new BadRequestException('Only admins can verify reviews');
    }
    return this.reviewsService.verifyReview(id);
  }

  @Get('recent/featured')
  @ApiOperation({ summary: 'Get recent featured reviews' })
  async getFeaturedReviews(@Query('limit') limit: number = 5) {
    return this.reviewsService.getFeaturedReviews(limit);
  }
}
