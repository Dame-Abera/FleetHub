import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { SearchCarsDto } from './dto/search-cars.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car listing' })
  create(@Body() createCarDto: CreateCarDto, @GetUser() user: User) {
    return this.carsService.create(createCarDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars with optional filters' })
  findAll(@Query() searchDto: SearchCarsDto) {
    return this.carsService.findAll(searchDto);
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