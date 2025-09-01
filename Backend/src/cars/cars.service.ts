import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { SearchCarsDto } from './dto/search-cars.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CarsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(createCarDto: CreateCarDto, user: User) {
    // Generate AI description if not provided
    if (!createCarDto.description) {
      const features = Object.keys(createCarDto.features || {}).filter(
        key => createCarDto.features[key] === true
      );
      
      createCarDto.description = await this.aiService.generateCarDescription(
        createCarDto.brand,
        createCarDto.name,
        createCarDto.year,
        features
      );
    }

    // AI price suggestions if not provided
    if (!createCarDto.rentalPricePerDay && createCarDto.availableForRental) {
      createCarDto.rentalPricePerDay = await this.aiService.suggestCarPrice(
        createCarDto.brand,
        createCarDto.name,
        createCarDto.year,
        createCarDto.mileage || 0,
        'rental'
      );
    }

    if (!createCarDto.salePrice && createCarDto.availableForSale) {
      createCarDto.salePrice = await this.aiService.suggestCarPrice(
        createCarDto.brand,
        createCarDto.name,
        createCarDto.year,
        createCarDto.mileage || 0,
        'sale'
      );
    }

    return this.prisma.car.create({
      data: {
        ...createCarDto,
        postedById: user.id,
      },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });
  }

  async findAll(searchDto: SearchCarsDto) {
    const {
      category,
      brand,
      availableForRental,
      availableForSale,
      minPrice,
      maxPrice,
      location,
      ownerId,
      page = 1,
      limit = 20
    } = searchDto;

    const where: any = {};

    if (category) where.category = category;
    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    if (availableForRental !== undefined) where.availableForRental = availableForRental;
    if (availableForSale !== undefined) where.availableForSale = availableForSale;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (ownerId) where.postedById = ownerId;

    // Price filtering (rental or sale)
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.gte = minPrice;
      if (maxPrice) priceFilter.lte = maxPrice;
      
      where.OR = [
        { rentalPricePerDay: priceFilter },
        { salePrice: priceFilter }
      ];
    }

    const [cars, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        include: {
          postedBy: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.car.count({ where })
    ]);

    return {
      data: cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true, role: true }
        },
        bookings: {
          where: { status: 'CONFIRMED' },
          select: { startDate: true, endDate: true }
        }
      }
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto, user: User) {
    const car = await this.prisma.car.findUnique({
      where: { id }
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.postedById !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own cars');
    }

    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
      include: {
        postedBy: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });
  }

  async remove(id: string, user: User) {
    const car = await this.prisma.car.findUnique({
      where: { id }
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.postedById !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own cars');
    }

    return this.prisma.car.delete({
      where: { id }
    });
  }
}
