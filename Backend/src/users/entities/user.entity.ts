import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Car } from '../../cars/entities/car.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { SaleTransaction } from '../../sales/entities/sale-transaction.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  OWNER = 'owner',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => Car, car => car.postedBy)
  cars: Car[];

  @OneToMany(() => Booking, booking => booking.userId)
  bookings: Booking[];

  @OneToMany(() => SaleTransaction, sale => sale.buyerId)
  purchases: SaleTransaction[];

  @OneToMany(() => SaleTransaction, sale => sale.sellerId)
  sales: SaleTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}