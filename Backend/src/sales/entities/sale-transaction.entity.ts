import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';

@Entity('sale_transactions')
export class SaleTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  carId: string;

  @Column('uuid')
  buyerId: string;

  @Column('uuid')
  sellerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('text', { nullable: true })
  notes: string;

  // Relationships
  @ManyToOne(() => Car, car => car.sales)
  car: Car;

  @ManyToOne(() => User, user => user.purchases)
  buyer: User;

  @ManyToOne(() => User, user => user.sales)
  seller: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 