import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UploadedFiles, UseInterceptors, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { SearchCarsDto } from './dto/search-cars.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import type { Express } from 'express';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  private readonly logger = new Logger(CarsController.name);

  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car listing' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBody({
    description: 'Car details with optional images[] uploads',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        brand: { type: 'string' },
        category: { type: 'string' },
        availableForRental: { type: 'boolean' },
        rentalPricePerDay: { type: 'number' },
        availableForSale: { type: 'boolean' },
        salePrice: { type: 'number' },
        year: { type: 'number' },
        color: { type: 'string' },
        description: { type: 'string' },
        mileage: { type: 'number' },
        fuelType: { type: 'string' },
        transmission: { type: 'string' },
        seats: { type: 'number' },
        location: { type: 'string' },
        features: { type: 'object', additionalProperties: true },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['name', 'brand', 'category'],
    },
  })
  async create(
    @Body() createCarDto: CreateCarDto,
    @GetUser() user: User,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    try {
      this.logger.log(`Creating car listing for user ${user.id}: ${createCarDto.name}`);
      
      const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3001';
      
      // Handle file uploads
      if (files && files.length > 0) {
        this.logger.log(`Processing ${files.length} uploaded files`);
        const urls = files.map((f) => {
          const rel = f.path.split('uploads').pop()?.replace(/\\/g, '/');
          return `${baseUrl}/uploads${rel}`;
        });
        createCarDto.images = urls;
      } else {
        createCarDto.images = [];
      }

      // Validate that at least one option is selected
      if (!createCarDto.availableForRental && !createCarDto.availableForSale) {
        throw new BadRequestException('Car must be available for either rental or sale');
      }

      // Validate prices based on availability
      if (createCarDto.availableForRental && (!createCarDto.rentalPricePerDay || createCarDto.rentalPricePerDay <= 0)) {
        throw new BadRequestException('Rental price per day is required when car is available for rental');
      }

      if (createCarDto.availableForSale && (!createCarDto.salePrice || createCarDto.salePrice <= 0)) {
        throw new BadRequestException('Sale price is required when car is available for sale');
      }

      const result = await this.carsService.create(createCarDto, user);
      this.logger.log(`Successfully created car listing with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create car listing for user ${user.id}:`, error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars with optional filters' })
  findAll(@Query() searchDto: SearchCarsDto) {
    this.logger.log(`Fetching cars with filters: ${JSON.stringify(searchDto)}`);
    return this.carsService.findAll(searchDto);
  }

  @Get('debug/count')
  @ApiOperation({ summary: 'Get total car count for debugging' })
  async getCarCount() {
    const total = await this.carsService.getTotalCount();
    const approved = await this.carsService.getApprovedCount();
    return {
      total,
      approved,
      message: `Total cars: ${total}, Approved cars: ${approved}`
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update car listing' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto, @GetUser() user: User) {
    return this.carsService.update(id, updateCarDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car listing' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.carsService.remove(id, user);
  }
}