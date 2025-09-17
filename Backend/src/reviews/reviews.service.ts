import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    const { carId, revieweeId, rating, title, comment } = createReviewDto;

    // Check if car exists
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: { postedBy: true }
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // Check if reviewee exists
    const reviewee = await this.prisma.user.findUnique({
      where: { id: revieweeId }
    });

    if (!reviewee) {
      throw new NotFoundException('Reviewee not found');
    }

    // Check if user has already reviewed this car
    const existingReview = await this.prisma.review.findUnique({
      where: {
        carId_reviewerId: {
          carId,
          reviewerId: user.id
        }
      }
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this car');
    }

    // Validate that reviewee is the car owner
    if (car.postedById !== revieweeId) {
      throw new BadRequestException('Reviewee must be the car owner');
    }

    // Create the review
    const review = await this.prisma.review.create({
      data: {
        carId,
        reviewerId: user.id,
        revieweeId,
        rating,
        title,
        comment,
        isVerified: false
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      }
    });

    // Update car owner's average rating
    await this.updateUserAverageRating(revieweeId);

    return review;
  }

  async findAll(filters: {
    carId?: string;
    revieweeId?: string;
    reviewerId?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }) {
    const { carId, revieweeId, reviewerId, rating, page = 1, limit = 20 } = filters;

    const where: any = {};

    if (carId) where.carId = carId;
    if (revieweeId) where.revieweeId = revieweeId;
    if (reviewerId) where.reviewerId = reviewerId;
    if (rating) where.rating = { gte: rating };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              year: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.review.count({ where })
    ]);

    return {
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findByCar(carId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { carId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reviews;
  }

  async findByUser(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reviews;
  }

  async getUserReviewStats(userId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { revieweeId: userId },
      _count: { id: true },
      _avg: { rating: true },
      _min: { rating: true },
      _max: { rating: true }
    });

    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { revieweeId: userId },
      _count: { rating: true }
    });

    return {
      totalReviews: stats._count.id,
      averageRating: stats._avg.rating || 0,
      minRating: stats._min.rating || 0,
      maxRating: stats._max.rating || 0,
      ratingDistribution: ratingDistribution.map(item => ({
        rating: item.rating,
        count: item._count.rating
      }))
    };
  }

  async getCarReviewStats(carId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { carId },
      _count: { id: true },
      _avg: { rating: true },
      _min: { rating: true },
      _max: { rating: true }
    });

    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { carId },
      _count: { rating: true }
    });

    return {
      totalReviews: stats._count.id,
      averageRating: stats._avg.rating || 0,
      minRating: stats._min.rating || 0,
      maxRating: stats._max.rating || 0,
      ratingDistribution: ratingDistribution.map(item => ({
        rating: item.rating,
        count: item._count.rating
      }))
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      }
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: User) {
    const review = await this.prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only the reviewer or admin can update the review
    if (review.reviewerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      }
    });

    // Update car owner's average rating if rating changed
    if (updateReviewDto.rating && updateReviewDto.rating !== review.rating) {
      await this.updateUserAverageRating(review.revieweeId);
    }

    return updatedReview;
  }

  async remove(id: string, user: User) {
    const review = await this.prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only the reviewer or admin can delete the review
    if (review.reviewerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const deletedReview = await this.prisma.review.delete({
      where: { id }
    });

    // Update car owner's average rating
    await this.updateUserAverageRating(review.revieweeId);

    return deletedReview;
  }

  async verifyReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isVerified: true },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      }
    });
  }

  async getFeaturedReviews(limit: number = 5) {
    return this.prisma.review.findMany({
      where: { isVerified: true },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
  }

  private async updateUserAverageRating(userId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: { id: true }
    });

    // You could store this in a user profile table or calculate it on-demand
    // For now, we'll just log it
    console.log(`User ${userId} now has ${stats._count.id} reviews with average rating ${stats._avg.rating}`);
  }
}
