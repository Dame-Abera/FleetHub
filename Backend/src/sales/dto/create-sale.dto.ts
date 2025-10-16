import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ description: 'Car ID to purchase' })
  @IsString()
  @IsUUID()
  carId: string;

  @ApiProperty({ description: 'Sale price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
