import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsArray, IsObject, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CarCategory } from '@prisma/client';

export class CreateCarDto {
  @ApiProperty({ example: '2023 Toyota Camry' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  brand: string;

  @ApiProperty({ enum: CarCategory, example: 'Sedan' })
  @IsEnum(CarCategory)
  category: CarCategory;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  availableForRental?: boolean = false;

  @ApiPropertyOptional({ example: 75.00 })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return Number(value);
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rentalPricePerDay?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  availableForSale?: boolean = false;

  @ApiPropertyOptional({ example: 25000.00 })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return Number(value);
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ type: [String], example: ['https://example.com/car1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[] = [];

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return Number(value);
  })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiPropertyOptional({ example: 'White' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'Excellent condition, low mileage' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return Number(value);
  })
  @IsNumber()
  @Min(0)
  mileage?: number;

  @ApiPropertyOptional({ example: 'Gasoline' })
  @IsOptional()
  @IsString()
  fuelType?: string;

  @ApiPropertyOptional({ example: 'Automatic' })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return Number(value);
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  seats?: number;

  @ApiPropertyOptional({ example: 'New York, NY' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: {
      bluetooth: true,
      backupCamera: true,
      leatherSeats: false,
      sunroof: true
    }
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;
}
