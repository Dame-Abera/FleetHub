#!/bin/bash

echo "🚗 Setting up Car Marketplace Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp config.env.example .env
    echo "⚠️  Please update .env file with your database credentials!"
    echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/car_marketplace?schema=public\""
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npm run db:push > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
    echo "✅ Database schema pushed successfully!"
else
    echo "❌ Database connection failed!"
    echo "   Please check your DATABASE_URL in .env file"
    echo "   Make sure PostgreSQL is running and accessible"
    echo ""
    echo "💡 You can also run the SQL setup script manually:"
    echo "   psql -U postgres -f scripts/setup-db.sql"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run start:dev"
echo ""
echo "📚 API Documentation will be available at:"
echo "   http://localhost:3001/api"
echo ""
echo "🗄️  To open Prisma Studio (database GUI):"
echo "   npm run db:studio" 