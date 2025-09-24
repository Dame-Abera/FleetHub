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
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  async create(@Body() createBookingDto: CreateBookingDto, @GetUser() user: User) {
    try {
      this.logger.log(`Creating booking for car ${createBookingDto.carId} by user ${user.id}`);
      
      const booking = await this.bookingsService.create(createBookingDto, user);
      this.logger.log(`Successfully created booking with ID: ${booking.id}`);
      return booking;
    } catch (error) {
      this.logger.error(`Failed to create booking for user ${user.id}:`, error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status' })
  @ApiQuery({ name: 'carId', required: false, description: 'Filter by car ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async findAll(
    @GetUser() user: User,
    @Query('status') status?: string,
    @Query('carId') carId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.bookingsService.findAll(user, {
      status,
      carId,
      page,
      limit
    });
  }

  @Get('car/:carId/availability')
  @ApiOperation({ summary: 'Get car availability for a date range' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for availability check' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for availability check' })
  async getCarAvailability(
    @Param('carId') carId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.bookingsService.getCarAvailability(carId, startDate, endDate);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking' })
  async update(
    @Param('id') id: string, 
    @Body() updateBookingDto: UpdateBookingDto, 
    @GetUser() user: User
  ) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel/Delete booking' })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingsService.remove(id, user);
  }
}

