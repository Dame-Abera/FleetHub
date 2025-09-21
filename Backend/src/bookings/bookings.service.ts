import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, user: User) {
    const { carId, startDate, endDate, totalPrice, notes } = createBookingDto;

    // Check if car exists and is available for rental
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: { postedBy: true }
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (!car.availableForRental) {
      throw new BadRequestException('This car is not available for rental');
    }

    // Check if user is not booking their own car
    if (car.postedById === user.id) {
      throw new BadRequestException('You cannot book your own car');
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check for overlapping bookings
    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } }
            ]
          },
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } }
            ]
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } }
            ]
          }
        ]
      }
    });

    if (overlappingBooking) {
      throw new BadRequestException('Car is not available for the selected dates');
    }

    // Calculate total price if not provided
    let calculatedPrice = totalPrice;
    if (!calculatedPrice && car.rentalPricePerDay) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      calculatedPrice = Number(car.rentalPricePerDay) * days;
    }

    // Create the booking
    const booking = await this.prisma.booking.create({
      data: {
        carId,
        userId: user.id,
        startDate: start,
        endDate: end,
        totalPrice: calculatedPrice,
        notes,
        status: 'PENDING'
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return booking;
  }

  async findAll(user: User, filters?: {
    status?: string;
    carId?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, carId, page = 1, limit = 20 } = filters || {};

    const where: any = {};

    // If user is not admin, only show their bookings or bookings for their cars
    if (user.role !== 'ADMIN') {
      where.OR = [
        { userId: user.id }, // User's own bookings
        { car: { postedById: user.id } } // Bookings for user's cars
      ];
    }

    if (status) {
      where.status = status;
    }

    if (carId) {
      where.carId = carId;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              year: true,
              images: true,
              postedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has access to this booking
    if (user.role !== 'ADMIN' && booking.userId !== user.id && booking.car.postedById !== user.id) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { car: true }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user can update this booking
    const canUpdate = user.role === 'ADMIN' || 
                     booking.userId === user.id || 
                     booking.car.postedById === user.id;

    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this booking');
    }

    // If updating status, only car owner or admin can do it
    if (updateBookingDto.status && user.role !== 'ADMIN' && booking.car.postedById !== user.id) {
      throw new ForbiddenException('Only the car owner can update booking status');
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
  }

  async remove(id: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { car: true }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user can delete this booking
    const canDelete = user.role === 'ADMIN' || 
                     booking.userId === user.id || 
                     booking.car.postedById === user.id;

    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this booking');
    }

    // Only allow deletion if booking is pending
    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Only pending bookings can be deleted');
    }

    return this.prisma.booking.delete({
      where: { id }
    });
  }

  async getCarAvailability(carId: string, startDate?: string, endDate?: string) {
    const where: any = {
      carId,
      status: { in: ['PENDING', 'CONFIRMED'] }
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      where.OR = [
        {
          AND: [
            { startDate: { lte: start } },
            { endDate: { gt: start } }
          ]
        },
        {
          AND: [
            { startDate: { lt: end } },
            { endDate: { gte: end } }
          ]
        },
        {
          AND: [
            { startDate: { gte: start } },
            { endDate: { lte: end } }
          ]
        }
      ];
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true
      },
      orderBy: { startDate: 'asc' }
    });

    return bookings;
  }
}

