import { IsString, IsDateString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({ 
    description: 'ID of the car to book',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  carId: string;

  @ApiProperty({ 
    description: 'Start date of the booking',
    example: '2024-01-15',
    format: 'date'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'End date of the booking',
    example: '2024-01-20',
    format: 'date'
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({ 
    description: 'Total price for the booking',
    example: 375.00
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return Number(value);
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalPrice: number;

  @ApiPropertyOptional({ 
    description: 'Additional notes for the booking',
    example: 'Business trip booking'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

