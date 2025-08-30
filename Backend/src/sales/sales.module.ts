import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleTransaction } from './entities/sale-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleTransaction])],
  exports: [TypeOrmModule],
})
export class SalesModule {} 