# Database Seeding Guide

This guide explains how to seed your FleetHub database with sample data.

## 🌱 What Gets Seeded

The seeding script creates:

- **1 Admin User**: `admin@fleethub.com` / `admin123`
- **2 Companies**: Luxury Cars Inc. & Family Auto Group
- **2 Company Users**: John Smith & Sarah Johnson
- **2 Customers**: Mike Wilson & Emily Davis
- **12 Sample Cars**: BMW X5, Tesla Model 3, Mercedes C-Class, Audi Q7, Toyota Camry, Honda CR-V, Porsche 911, Ford F-150, Chevrolet Corvette, Volkswagen Golf, Subaru Outback
- **2 Bookings**: Sample rental bookings
- **2 Reviews**: Customer reviews for cars
- **2 Notifications**: Sample notifications

## 🚀 Car Images

All cars include high-quality images from Unsplash:
- BMW X5: Luxury SUV images
- Tesla Model 3: Electric sedan images
- Mercedes C-Class: Premium sedan images
- Audi Q7: Premium SUV images
- Toyota Camry: Reliable sedan images
- Honda CR-V: Family SUV images
- Porsche 911: Sports car images
- Ford F-150: Pickup truck images
- Chevrolet Corvette: Supercar images
- Volkswagen Golf: Hatchback images
- Subaru Outback: Adventure wagon images

## 📋 Available Commands

### Production Seeding (Render)
```bash
yarn db:seed
```
This runs automatically during deployment on Render.

### Development Seeding (Local)
```bash
yarn db:seed:dev
```
Use this for local development.

### Manual Seeding
```bash
# Generate Prisma client
yarn prisma generate

# Run migrations
yarn prisma migrate dev

# Seed the database
yarn db:seed
```

## 🔑 Test Accounts

After seeding, you can use these accounts:

### Admin Account
- **Email**: `admin@fleethub.com`
- **Password**: `admin123`
- **Role**: Admin (can approve cars, companies, users)

### Company User Account
- **Email**: `john@luxurycars.com`
- **Password**: `password123`
- **Role**: Company User (can manage cars for Luxury Cars Inc.)

### Customer Account
- **Email**: `customer1@example.com`
- **Password**: `password123`
- **Role**: Customer (can book cars, write reviews)

## 🚗 Sample Cars

| Car | Brand | Category | Rental Price/Day | Sale Price | Status |
|-----|-------|----------|------------------|------------|--------|
| BMW X5 | BMW | SUV | $150 | $65,000 | Available |
| Tesla Model 3 | Tesla | Sedan | $120 | $45,000 | Available |
| Mercedes C-Class | Mercedes-Benz | Sedan | $100 | $55,000 | Available |
| Audi Q7 | Audi | SUV | $140 | $70,000 | Available |
| Toyota Camry | Toyota | Sedan | $80 | $35,000 | Available |
| Honda CR-V | Honda | SUV | $90 | $38,000 | Available |
| Porsche 911 | Porsche | Coupe | $300 | $120,000 | Available |
| Ford F-150 | Ford | Pickup | $110 | $45,000 | Available |
| Chevrolet Corvette | Chevrolet | Convertible | $250 | $85,000 | Available |
| Volkswagen Golf | Volkswagen | Hatchback | $70 | $28,000 | Available |
| Subaru Outback | Subaru | Wagon | $85 | $35,000 | Available |

## 🔄 Resetting the Database

To reset and reseed the database:

```bash
# Reset the database (WARNING: This deletes all data!)
yarn prisma migrate reset

# Or manually:
yarn prisma migrate deploy
yarn db:seed
```

## 🛠️ Customization

To modify the seeded data:

1. Edit `Backend/prisma/seed.ts`
2. Update the `sampleCars` array with your desired cars
3. Modify user data, companies, or other entities
4. Run `yarn db:seed` to apply changes

## 📝 Notes

- All car images are sourced from Unsplash (high-quality, free images)
- Passwords are hashed using bcryptjs
- All cars are pre-approved and ready for rental/sale
- Sample bookings and reviews are included for testing
- The script is idempotent (safe to run multiple times)

## 🚨 Production Considerations

- The seeding script runs automatically on Render deployment
- In production, consider using environment variables for sensitive data
- The script includes proper error handling and logging
- All created entities are properly linked with foreign keys
