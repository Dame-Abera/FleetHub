# Local Development Setup

## 🚀 Quick Start Guide

### 1. Start the Backend (Terminal 1)
```bash
cd Backend
yarn install
yarn prisma generate
yarn prisma migrate dev
yarn db:seed
yarn start:dev
```

### 2. Start the Frontend (Terminal 2)
```bash
cd frontend
yarn install
yarn dev
```

## 🔧 Environment Configuration

The frontend is now configured to use your local backend at `http://localhost:3001`.

### Backend Endpoints:
- **API Base**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`
- **Cars API**: `http://localhost:3001/cars`
- **Debug Cars**: `http://localhost:3001/cars/debug/count`
- **API Docs**: `http://localhost:3001/api`

### Frontend:
- **Local Dev Server**: `http://localhost:5173`

## 🐛 Troubleshooting

### If cars still don't load:

1. **Check Backend is Running**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check Car Count**:
   ```bash
   curl http://localhost:3001/cars/debug/count
   ```

3. **Check Cars API**:
   ```bash
   curl http://localhost:3001/cars
   ```

4. **Check Browser Console** for any errors

5. **Verify Database Seeding**:
   ```bash
   cd Backend
   yarn db:seed
   ```

## 🔑 Test Accounts

After seeding, use these accounts:
- **Admin**: `admin@fleethub.com` / `admin123`
- **Customer**: `customer1@example.com` / `password123`

## 📝 Notes

- Frontend will automatically reload when you make changes
- Backend will restart when you make changes (if using `yarn start:dev`)
- Database changes require running migrations
- To reset database: `yarn prisma migrate reset`


