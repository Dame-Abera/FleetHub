import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const [
      totalCars,
      activeCars,
      soldCars,
      totalBookings,
      confirmedBookings,
      totalSales,
      recentCars,
      recentBookings,
      recentSales
    ] = await Promise.all([
      // Total cars posted by user
      this.prisma.car.count({
        where: { postedById: userId }
      }),
      
      // Active cars (not sold, not rented)
      this.prisma.car.count({
        where: { 
          postedById: userId,
          status: 'APPROVED',
          availableForSale: true
        }
      }),
      
      // Cars sold
      this.prisma.car.count({
        where: { 
          postedById: userId,
          status: 'SOLD'
        }
      }),
      
      // Total bookings for user's cars
      this.prisma.booking.count({
        where: {
          car: { postedById: userId }
        }
      }),
      
      // Confirmed bookings
      this.prisma.booking.count({
        where: {
          car: { postedById: userId },
          status: 'CONFIRMED'
        }
      }),
      
      // Total sales amount
      this.prisma.saleTransaction.aggregate({
        where: { sellerId: userId },
        _sum: { price: true }
      }),
      
      // Recent cars
      this.prisma.car.findMany({
        where: { postedById: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          brand: true,
          year: true,
          status: true,
          availableForRental: true,
          availableForSale: true,
          createdAt: true
        }
      }),
      
      // Recent bookings
      this.prisma.booking.findMany({
        where: { car: { postedById: userId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          startDate: true,
          endDate: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          user: {
            select: { name: true, email: true }
          },
          car: {
            select: { name: true, brand: true, year: true }
          }
        }
      }),
      
      // Recent sales
      this.prisma.saleTransaction.findMany({
        where: { sellerId: userId },
        orderBy: { date: 'desc' },
        take: 5,
        select: {
          id: true,
          price: true,
          date: true,
          buyer: {
            select: { name: true, email: true }
          },
          car: {
            select: { name: true, brand: true, year: true }
          }
        }
      })
    ]);

    return {
      stats: {
        totalCars,
        activeCars,
        soldCars,
        totalBookings,
        confirmedBookings,
        totalSales: totalSales._sum.price || 0
      },
      recentCars,
      recentBookings,
      recentSales
    };
  }

  async getAdminStats() {
    const [
      totalUsers,
      totalCars,
      totalBookings,
      totalSales,
      pendingApprovals,
      recentUsers,
      recentCars
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.car.count(),
      this.prisma.booking.count(),
      this.prisma.saleTransaction.aggregate({
        _sum: { price: true }
      }),
      this.prisma.car.count({
        where: { status: 'PENDING_APPROVAL' }
      }),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      this.prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          brand: true,
          year: true,
          status: true,
          postedBy: {
            select: { name: true, email: true }
          },
          createdAt: true
        }
      })
    ]);

    return {
      stats: {
        totalUsers,
        totalCars,
        totalBookings,
        totalSales: totalSales._sum.price || 0,
        pendingApprovals
      },
      recentUsers,
      recentCars
    };
  }
}
