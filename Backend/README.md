# 🚗 Car Rental & Sale Platform Backend

A clean NestJS backend with Prisma ORM for a car rental and sale marketplace platform.

## 🏗️ Clean Architecture

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Structure**: Minimal, focused modules
- **API Documentation**: Swagger/OpenAPI ready

## 🗄️ Database Schema (Prisma)

### Core Models
- **User**: Customers, Owners, Admins
- **Car**: Hybrid rental/sale vehicles
- **Booking**: Rental transactions
- **SaleTransaction**: Purchase transactions
- **Payment**: Payment tracking

### Key Features
- **Hybrid Cars**: Available for both rental AND sale
- **Role-based Access**: Customer, Owner, Admin roles
- **Flexible Pricing**: Separate rental and sale prices

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp config.env.example .env
# Edit .env with your DATABASE_URL
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
```

### 4. Start Development
```bash
npm run start:dev
```

## 📁 Project Structure

```
src/
├── prisma/           # Prisma service & module
├── users/            # User management
├── cars/             # Car management
├── bookings/         # Booking management
├── ai/               # AI features
├── app.module.ts     # Main application module
└── main.ts          # Application entry point
```

## 🔧 Available Scripts

- `npm run start:dev` - Development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## 🌐 API Ready

The backend is structured for:
- User authentication & management
- Car posting & management
- Rental bookings
- Sale transactions
- Payment processing

## 💡 Perfect for Portfolio

- Clean, professional code structure
- Modern tech stack (NestJS + Prisma)
- Type-safe database operations
- Ready for frontend integration 