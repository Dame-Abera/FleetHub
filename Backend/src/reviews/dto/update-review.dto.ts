import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiPropertyOptional({ 
    description: 'Updated rating from 1 to 5 stars',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ 
    description: 'Updated review title',
    example: 'Good car with minor issues',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    description: 'Updated detailed review comment',
    example: 'The car was mostly in good condition, but there were some minor scratches that weren\'t mentioned in the listing.',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
