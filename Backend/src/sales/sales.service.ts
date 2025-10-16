import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto, user: User) {
    const { carId, price, notes } = createSaleDto;

    // Check if car exists and is available for sale
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: { postedBy: true }
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (!car.availableForSale) {
      throw new ForbiddenException('This car is not available for sale');
    }

    if (car.postedById === user.id) {
      throw new ForbiddenException('You cannot buy your own car');
    }

    // Create the sale transaction
    const sale = await this.prisma.saleTransaction.create({
      data: {
        carId,
        buyerId: user.id,
        sellerId: car.postedById,
        price,
        notes,
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return sale;
  }

  async findAll(user: User, filters?: {
    status?: string;
    carId?: string;
    page?: number;
    limit?: number;
  }) {
    const { carId, page = 1, limit = 20 } = filters || {};
    
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, page || 1);
    const validLimit = Math.max(1, Math.min(100, limit || 20));

    const where: any = {};

    // If user is not admin, only show their sales or purchases
    if (user.role !== 'ADMIN') {
      where.OR = [
        { buyerId: user.id }, // User's purchases
        { sellerId: user.id } // User's sales
      ];
    }

    if (carId) {
      where.carId = carId;
    }

    const [sales, total] = await Promise.all([
      this.prisma.saleTransaction.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              year: true,
              images: true,
              postedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (validPage - 1) * validLimit,
        take: validLimit
      }),
      this.prisma.saleTransaction.count({ where })
    ]);

    return {
      data: sales,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        pages: Math.ceil(total / validLimit)
      }
    };
  }

  async findOne(id: string, user: User) {
    const sale = await this.prisma.saleTransaction.findUnique({
      where: { id },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!sale) {
      throw new NotFoundException('Sale transaction not found');
    }

    // Check if user has access to this sale
    if (user.role !== 'ADMIN' && sale.buyerId !== user.id && sale.sellerId !== user.id) {
      throw new ForbiddenException('You do not have access to this sale transaction');
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto, user: User) {
    const sale = await this.findOne(id, user);

    // Only admin or seller can update sale
    if (user.role !== 'ADMIN' && sale.sellerId !== user.id) {
      throw new ForbiddenException('You can only update your own sales');
    }

    const updatedSale = await this.prisma.saleTransaction.update({
      where: { id },
      data: updateSaleDto,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return updatedSale;
  }

  async confirmSale(id: string, user: User) {
    const sale = await this.findOne(id, user);

    // Only seller can confirm sale
    if (sale.sellerId !== user.id) {
      throw new ForbiddenException('Only the seller can confirm this sale');
    }

    const updatedSale = await this.prisma.saleTransaction.update({
      where: { id },
      data: { 
        date: new Date(),
        notes: sale.notes ? `${sale.notes}\n\n[CONFIRMED by seller]` : '[CONFIRMED by seller]'
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            images: true,
            postedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return updatedSale;
  }

  async rejectSale(id: string, user: User, reason?: string) {
    const sale = await this.findOne(id, user);

    // Only seller can reject sale
    if (sale.sellerId !== user.id) {
      throw new ForbiddenException('Only the seller can reject this sale');
    }

    // For now, we'll just delete the sale transaction
    // In a real app, you might want to keep it with a status field
    await this.prisma.saleTransaction.delete({
      where: { id }
    });

    return { message: 'Sale offer rejected successfully', reason };
  }

  async remove(id: string, user: User) {
    const sale = await this.findOne(id, user);

    // Only admin can delete sales
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can delete sale transactions');
    }

    await this.prisma.saleTransaction.delete({
      where: { id }
    });

    return { message: 'Sale transaction deleted successfully' };
  }
}
