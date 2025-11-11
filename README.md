# 🚗 FleetHub - Car Rental & Sale Platform

A modern full-stack car rental and sale marketplace platform built with React and NestJS.

## 🏗️ Architecture

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with modern design
- **State Management**: React Context API

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator with DTOs

## 🗄️ Database Schema

### Core Entities

- **User**: Customers, Owners/Dealers, Admins
- **Car**: Hybrid rental/sale vehicles with dual availability flags
- **Booking**: Rental transactions
- **SaleTransaction**: Purchase transactions  
- **Payment**: Payment tracking for both rentals and sales

### Key Features

- **Hybrid Cars**: Single car can be available for both rental AND sale
- **Flexible Pricing**: Separate rental (daily) and sale prices
- **Role-based Access**: Customer, Owner, Admin roles
- **Rich Car Data**: JSON features, multiple images, detailed specs

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd FleetHub
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

### 3. Environment Setup

Copy the environment file and configure your database:

```bash
cp config.env.example .env
```

Update `.env` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/car_marketplace?schema=public"
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate

# Open Prisma Studio (optional)
npm run db:studio
```

### 5. Start Backend Server

```bash
npm run start:dev
```

### 6. Frontend Setup

```bash
cd ../frontend
npm install
```

### 7. Start Frontend Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

##  Database Models

### User Model
```typescript
enum UserRole {
  CUSTOMER  // Can rent/buy cars
  OWNER     // Can post cars for rent/sale
  ADMIN     // Platform management
}
```

### Car Model
```typescript
// Hybrid availability
availableForRental: boolean    // Can be rented
availableForSale: boolean      // Can be purchased
rentalPricePerDay: Decimal    // Daily rental rate
salePrice: Decimal            // Purchase price
```

### Booking Model
```typescript
enum BookingStatus {
  PENDING    // Awaiting confirmation
  CONFIRMED  // Rental confirmed
  CANCELLED  // Cancelled by user
}
```

### SaleTransaction Model
```typescript
// Tracks car purchases
buyerId: string    // Customer buying
sellerId: string   // Owner selling
price: Decimal     // Sale amount
```

## 🔧 Available Scripts

### Backend Scripts
- `npm run start:dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/:id` - Get user by ID

### Cars
- `GET /cars` - List all cars (with filters)
- `POST /cars` - Post new car (owners only)
- `GET /cars/:id` - Get car details
- `PUT /cars/:id` - Update car (owner only)
- `DELETE /cars/:id` - Delete car (owner only)

### Bookings
- `GET /bookings` - User's bookings
- `POST /bookings` - Create rental booking
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

### Sales
- `GET /sales` - Sales transactions
- `POST /sales` - Create sale transaction
- `GET /sales/:id` - Get sale details

### Payments
- `GET /payments` - Payment history
- `POST /payments` - Process payment
- `PUT /payments/:id` - Update payment status

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control**
- **Protected routes for owners/admins**
- **Secure password hashing with bcrypt**

##  Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |

## 🗃️ Database Indexes

For optimal performance, the following indexes are recommended:

```sql
-- Fast car searches
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_rental ON cars(availableForRental);
CREATE INDEX idx_cars_sale ON cars(availableForSale);

-- Fast user lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Fast booking queries
CREATE INDEX idx_bookings_user ON bookings(userId);
CREATE INDEX idx_bookings_car ON bookings(carId);
CREATE INDEX idx_bookings_dates ON bookings(startDate, endDate);
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Set up proper CORS origins
5. Enable rate limiting
6. Set up monitoring and logging

##  Features

### User Features
- **User Registration & Authentication**: Secure JWT-based auth
- **Car Browsing**: Search and filter available cars
- **Car Details**: View comprehensive car information with images
- **Rental Bookings**: Book cars for specific date ranges
- **Purchase Cars**: Buy cars directly from the platform
- **User Dashboard**: Manage bookings and profile

### Owner Features
- **Car Management**: Add, edit, and delete car listings
- **Dual Availability**: Set cars for both rental and sale
- **Image Upload**: Multiple car images with proper storage
- **Booking Management**: View and manage rental bookings
- **Sales Tracking**: Monitor car sales and transactions

### Admin Features
- **Platform Management**: Oversee all users and transactions
- **Content Moderation**: Manage car listings and user accounts

## 🤝 Contributing

This is a portfolio project for Upwork/Turing. The code is structured for:
- **Clean Architecture**: Separation of concerns
- **Type Safety**: Full TypeScript coverage
- **Scalability**: Modular design
- **Maintainability**: Clear naming conventions

## 📄 License

Portfolio project - not for commercial use. 
