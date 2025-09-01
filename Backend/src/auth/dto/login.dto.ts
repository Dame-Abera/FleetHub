import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'User email address',
    example: 'john@example.com',
    format: 'email'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'password123'
  })
  @IsString()
  password!: string;
}
