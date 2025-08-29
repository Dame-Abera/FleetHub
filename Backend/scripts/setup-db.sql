-- Car Marketplace Database Setup Script
-- Run this as a PostgreSQL superuser (postgres)

-- Create database
CREATE DATABASE car_marketplace;

-- Create user (optional - you can use existing postgres user)
-- CREATE USER car_user WITH PASSWORD 'your_password_here';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON DATABASE car_marketplace TO car_user;

-- Connect to the new database
\c car_marketplace;

-- Create schema (Prisma will handle this automatically)
-- CREATE SCHEMA IF NOT EXISTS public;

-- Note: Prisma will automatically create all tables and relationships
-- when you run: npm run db:push

-- Optional: Create indexes for better performance
-- (These will be created automatically by Prisma, but you can add custom ones)

-- Fast car searches
-- CREATE INDEX idx_cars_brand ON cars(brand);
-- CREATE INDEX idx_cars_category ON cars(category);
-- CREATE INDEX idx_cars_rental ON cars(availableForRental);
-- CREATE INDEX idx_cars_sale ON cars(availableForSale);

-- Fast user lookups
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_role ON users(role);

-- Fast booking queries
-- CREATE INDEX idx_bookings_user ON bookings(userId);
-- CREATE INDEX idx_bookings_car ON bookings(carId);
-- CREATE INDEX idx_bookings_dates ON bookings(startDate, endDate);

-- Fast sale queries
-- CREATE INDEX idx_sales_car ON sale_transactions(carId);
-- CREATE INDEX idx_sales_buyer ON sale_transactions(buyerId);
-- CREATE INDEX idx_sales_seller ON sale_transactions(sellerId);

-- Fast payment queries
-- CREATE INDEX idx_payments_transaction ON payments(transactionId);
-- CREATE INDEX idx_payments_status ON payments(status);

-- Display success message
SELECT 'Car Marketplace database setup completed successfully!' as status; 