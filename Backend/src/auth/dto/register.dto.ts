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
}
