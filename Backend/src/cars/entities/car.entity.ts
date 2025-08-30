import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { SaleTransaction } from '../../sales/entities/sale-transaction.entity';

export enum CarCategory {
  SUV = 'SUV',
  SEDAN = 'Sedan',
  HATCHBACK = 'Hatchback',
  COUPE = 'Coupe',
  CONVERTIBLE = 'Convertible',
  WAGON = 'Wagon',
  PICKUP = 'Pickup',
  VAN = 'Van',
  TRUCK = 'Truck',
}

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({
    type: 'enum',
    enum: CarCategory,
  })
  category: CarCategory;

  @Column('jsonb', { nullable: true })
  features: Record<string, any>;

  @Column({ default: false })
  availableForRental: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  rentalPricePerDay: number;

  @Column({ default: false })
  availableForSale: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  color: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  mileage: number;

  @Column({ nullable: true })
  fuelType: string;

  @Column({ nullable: true })
  transmission: string;

  @Column({ nullable: true })
  seats: number;

  @Column({ nullable: true })
  location: string;

  // Relationships
  @ManyToOne(() => User, user => user.cars)
  postedBy: User;

  @OneToMany(() => Booking, booking => booking.carId)
  bookings: Booking[];

  @OneToMany(() => SaleTransaction, sale => sale.carId)
  sales: SaleTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}