import { PrismaClient, UserRole, CarCategory, CarStatus, CompanyStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample car data with online images
const sampleCars = [
  {
    name: 'BMW X5',
    brand: 'BMW',
    category: CarCategory.SUV,
    year: 2023,
    color: 'Black',
    description: 'Luxury SUV with premium features and excellent performance.',
    mileage: 15000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 7,
    location: 'New York, NY',
    rentalPricePerDay: 150,
    salePrice: 65000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      sunroof: true,
      backupCamera: true
    }
  },
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    category: CarCategory.Sedan,
    year: 2024,
    color: 'White',
    description: 'Electric sedan with autopilot and premium interior.',
    mileage: 5000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    location: 'Los Angeles, CA',
    rentalPricePerDay: 120,
    salePrice: 45000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      autopilot: true,
      supercharger: true
    }
  },
  {
    name: 'Mercedes-Benz C-Class',
    brand: 'Mercedes-Benz',
    category: CarCategory.Sedan,
    year: 2023,
    color: 'Silver',
    description: 'Luxury sedan with advanced safety features.',
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'Miami, FL',
    rentalPricePerDay: 100,
    salePrice: 55000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      sunroof: true,
      adaptiveCruise: true
    }
  },
  {
    name: 'Audi Q7',
    brand: 'Audi',
    category: CarCategory.SUV,
    year: 2023,
    color: 'Blue',
    description: 'Premium SUV with quattro all-wheel drive.',
    mileage: 8000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 7,
    location: 'Chicago, IL',
    rentalPricePerDay: 140,
    salePrice: 70000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      sunroof: true,
      quattro: true
    }
  },
  {
    name: 'Toyota Camry',
    brand: 'Toyota',
    category: CarCategory.Sedan,
    year: 2022,
    color: 'Red',
    description: 'Reliable sedan with excellent fuel economy.',
    mileage: 25000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    location: 'Houston, TX',
    rentalPricePerDay: 80,
    salePrice: 35000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      hybrid: true,
      backupCamera: true
    }
  },
  {
    name: 'Honda CR-V',
    brand: 'Honda',
    category: CarCategory.SUV,
    year: 2023,
    color: 'Gray',
    description: 'Compact SUV perfect for families.',
    mileage: 10000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'Phoenix, AZ',
    rentalPricePerDay: 90,
    salePrice: 38000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      backupCamera: true,
      laneAssist: true
    }
  },
  {
    name: 'Porsche 911',
    brand: 'Porsche',
    category: CarCategory.Coupe,
    year: 2024,
    color: 'Red',
    description: 'Iconic sports car with legendary performance.',
    mileage: 2000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 4,
    location: 'Las Vegas, NV',
    rentalPricePerDay: 300,
    salePrice: 120000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      sportMode: true,
      launchControl: true
    }
  },
  {
    name: 'Ford F-150',
    brand: 'Ford',
    category: CarCategory.Pickup,
    year: 2023,
    color: 'White',
    description: 'America\'s best-selling pickup truck.',
    mileage: 18000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'Dallas, TX',
    rentalPricePerDay: 110,
    salePrice: 45000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      fourWheelDrive: true,
      towingPackage: true
    }
  },
 
  {
    name: 'Volkswagen Golf',
    brand: 'Volkswagen',
    category: CarCategory.Hatchback,
    year: 2023,
    color: 'Blue',
    description: 'Compact and efficient European hatchback.',
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    seats: 5,
    location: 'Seattle, WA',
    rentalPricePerDay: 70,
    salePrice: 28000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      manualTransmission: true,
      fuelEfficient: true
    }
  },
  {
    name: 'Subaru Outback',
    brand: 'Subaru',
    category: CarCategory.Wagon,
    year: 2023,
    color: 'Green',
    description: 'Adventure-ready wagon with all-wheel drive.',
    mileage: 14000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'Denver, CO',
    rentalPricePerDay: 85,
    salePrice: 35000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      allWheelDrive: true,
      roofRails: true
    }
  },
  {
    name: 'Lexus RX 350',
    brand: 'Lexus',
    category: CarCategory.SUV,
    year: 2024,
    color: 'Pearl White',
    description: 'Luxury SUV with premium comfort and advanced safety features.',
    mileage: 5000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'San Francisco, CA',
    rentalPricePerDay: 160,
    salePrice: 58000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      sunroof: true,
      adaptiveCruise: true,
      laneDepartureWarning: true
    }
  },
  {
    name: 'Mazda MX-5 Miata',
    brand: 'Mazda',
    category: CarCategory.Convertible,
    year: 2023,
    color: 'Soul Red',
    description: 'Fun and agile convertible sports car perfect for weekend drives.',
    mileage: 6000,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    seats: 2,
    location: 'Austin, TX',
    rentalPricePerDay: 95,
    salePrice: 32000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      leatherSeats: true,
      convertible: true,
      manualTransmission: true,
      sportMode: true
    }
  },
  {
    name: 'Nissan Leaf',
    brand: 'Nissan',
    category: CarCategory.Hatchback,
    year: 2023,
    color: 'White',
    description: 'Affordable electric vehicle perfect for city driving.',
    mileage: 8000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    location: 'Portland, OR',
    rentalPricePerDay: 65,
    salePrice: 32000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      electricVehicle: true,
      regenerativeBraking: true
    }
  },
  {
    name: 'Jeep Wrangler',
    brand: 'Jeep',
    category: CarCategory.SUV,
    year: 2023,
    color: 'Black',
    description: 'Iconic off-road vehicle with removable doors and roof.',
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    seats: 4,
    location: 'Moab, UT',
    rentalPricePerDay: 130,
    salePrice: 42000,
    availableForRental: true,
    availableForSale: true,
    status: CarStatus.APPROVED,
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format'
    ],
    features: {
      airConditioning: true,
      bluetooth: true,
      gps: true,
      clothSeats: true,
      fourWheelDrive: true,
      removableDoors: true,
      removableRoof: true
    }
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fleethub.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@fleethub.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      phone: '+1-555-0100',
      address: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { email: 'luxury@cars.com' },
      update: {},
      create: {
        name: 'Luxury Cars Inc.',
        email: 'luxury@cars.com',
        phone: '+1-555-0200',
        address: '456 Luxury Ave',
        website: 'https://luxurycars.com',
        description: 'Premium luxury car rental and sales',
        status: CompanyStatus.APPROVED,
        isActive: true,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    }),
    prisma.company.upsert({
      where: { email: 'family@autos.com' },
      update: {},
      create: {
        name: 'Family Auto Group',
        email: 'family@autos.com',
        phone: '+1-555-0300',
        address: '789 Family Blvd',
        website: 'https://familyautos.com',
        description: 'Family-friendly car rental and sales',
        status: CompanyStatus.APPROVED,
        isActive: true,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Companies created:', companies.length);

  // Create company users
  const companyUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@luxurycars.com' },
      update: {},
      create: {
        name: 'John Smith',
        email: 'john@luxurycars.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: UserRole.COMPANY_USER,
        phone: '+1-555-0201',
        address: '456 Luxury Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        companyId: companies[0].id,
        isActive: true,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@familyautos.com' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        email: 'sarah@familyautos.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: UserRole.COMPANY_USER,
        phone: '+1-555-0301',
        address: '789 Family Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        companyId: companies[1].id,
        isActive: true,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Company users created:', companyUsers.length);

  // Create regular customers
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'customer1@example.com' },
      update: {},
      create: {
        name: 'Mike Wilson',
        email: 'customer1@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: UserRole.CUSTOMER,
        phone: '+1-555-0400',
        address: '321 Customer St',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'customer2@example.com' },
      update: {},
      create: {
        name: 'Emily Davis',
        email: 'customer2@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: UserRole.CUSTOMER,
        phone: '+1-555-0500',
        address: '654 Customer Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Customers created:', customers.length);

  // Create sample cars
  const createdCars = [];
  for (const carData of sampleCars) {
    const car = await prisma.car.create({
      data: {
        ...carData,
        postedById: companyUsers[Math.floor(Math.random() * companyUsers.length)].id,
        companyId: companies[Math.floor(Math.random() * companies.length)].id,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    });
    createdCars.push(car);
  }

  console.log('✅ Cars created:', createdCars.length);

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        carId: createdCars[0].id,
        userId: customers[0].id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-20'),
        totalPrice: 750, // 5 days * $150
        status: 'CONFIRMED',
        notes: 'Business trip booking',
      },
    }),
    prisma.booking.create({
      data: {
        carId: createdCars[1].id,
        userId: customers[1].id,
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-01-28'),
        totalPrice: 360, // 3 days * $120
        status: 'PENDING',
        notes: 'Weekend getaway',
      },
    }),
  ]);

  console.log('✅ Bookings created:', bookings.length);

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        carId: createdCars[0].id,
        reviewerId: customers[0].id,
        revieweeId: companyUsers[0].id,
        rating: 5,
        title: 'Excellent car!',
        comment: 'The BMW X5 was perfect for our family trip. Clean, comfortable, and great performance.',
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        carId: createdCars[1].id,
        reviewerId: customers[1].id,
        revieweeId: companyUsers[1].id,
        rating: 4,
        title: 'Great electric car',
        comment: 'Tesla Model 3 was amazing. Super quiet and the autopilot feature is incredible.',
        isVerified: true,
      },
    }),
  ]);

  console.log('✅ Reviews created:', reviews.length);

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: customers[0].id,
        title: 'Booking Confirmed',
        message: 'Your booking for BMW X5 has been confirmed.',
        type: 'BOOKING',
        isRead: false,
        data: { bookingId: bookings[0].id, carName: 'BMW X5' },
      },
    }),
    prisma.notification.create({
      data: {
        userId: companyUsers[0].id,
        title: 'New Review',
        message: 'You received a new 5-star review for BMW X5.',
        type: 'REVIEW',
        isRead: false,
        data: { reviewId: reviews[0].id, rating: 5 },
      },
    }),
  ]);

  console.log('✅ Notifications created:', notifications.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`- Admin users: 1`);
  console.log(`- Companies: ${companies.length}`);
  console.log(`- Company users: ${companyUsers.length}`);
  console.log(`- Customers: ${customers.length}`);
  console.log(`- Cars: ${createdCars.length}`);
  console.log(`- Bookings: ${bookings.length}`);
  console.log(`- Reviews: ${reviews.length}`);
  console.log(`- Notifications: ${notifications.length}`);
  
  console.log('\n🔑 Test Accounts:');
  console.log('Admin: admin@fleethub.com / admin123');
  console.log('Company User: john@luxurycars.com / password123');
  console.log('Customer: customer1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
