import { IsString, IsNumber, IsOptional, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ 
    description: 'ID of the car being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  carId: string;

  @ApiProperty({ 
    description: 'ID of the user being reviewed (car owner)',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  revieweeId: string;

  @ApiProperty({ 
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ 
    description: 'Review title',
    example: 'Excellent car, highly recommended!',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    description: 'Detailed review comment',
    example: 'The car was in perfect condition, exactly as described. The owner was very professional and the pickup process was smooth.',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
