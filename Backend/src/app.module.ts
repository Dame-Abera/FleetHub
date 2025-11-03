import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BookingsModule } from './bookings/bookings.module';
import { SalesModule } from './sales/sales.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AiModule } from './ai/ai.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';

@Controller()
export class HealthController {
  @Get()
  root() {
    return { 
      message: 'FleetHub API is running! 🚗',
      docs: '/api',
      health: '/health',
      timestamp: new Date().toISOString() 
    };
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CarsModule,
    BookingsModule,
    SalesModule,
    PaymentsModule,
    ReviewsModule,
    AiModule,
    DashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}