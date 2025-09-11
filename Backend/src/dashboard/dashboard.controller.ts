import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get user dashboard statistics' })
  async getUserStats(@GetUser() user: User) {
    return this.dashboardService.getUserStats(user.id);
  }

  @Get('admin-stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getAdminStats(@GetUser() user: User) {
    // Only allow admin users to access admin stats
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.dashboardService.getAdminStats();
  }
}
