import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiPropertyOptional({ 
    description: 'Booking status',
    enum: BookingStatus,
    example: 'CONFIRMED'
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

