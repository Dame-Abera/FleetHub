import { Controller, Post, Body, Get, UseGuards, Patch, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  async login(@Body() loginDto: LoginDto, @GetUser() user: User) {
    this.logger.log(`Login attempt for user: ${loginDto.email}`);
    this.logger.debug('Login DTO:', loginDto);
    this.logger.debug('Authenticated user:', user);
    
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Login successful for user: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for user: ${loginDto.email}`, error);
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@GetUser() user: User, @Body() updateData: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, updateData);
  }
}
