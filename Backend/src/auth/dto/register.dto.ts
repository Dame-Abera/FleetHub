import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ 
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'john@example.com',
    format: 'email'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'password123',
    minLength: 6,
    maxLength: 50
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password!: string;

  @ApiPropertyOptional({ 
    description: 'User role in the system',
    enum: UserRole,
    example: 'CUSTOMER',
    default: 'CUSTOMER'
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'User phone number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'User address',
    example: '123 Main St'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ 
    description: 'User city',
    example: 'New York'
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ 
    description: 'User state',
    example: 'NY'
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ 
    description: 'User ZIP code',
    example: '10001'
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ 
    description: 'User country',
    example: 'USA'
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ 
    description: 'User website',
    example: 'https://example.com'
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ 
    description: 'User bio',
    example: 'Car enthusiast and dealer'
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
