# FleetHub Deployment Guide

## 🚀 Deployment Options

### Option 1: Cloud Platforms (Recommended)

#### **Frontend Deployment:**
- **Vercel** (Recommended for React)
  - Connect your GitHub repo
  - Set build command: `yarn build`
  - Set output directory: `dist`
  - Environment variables: `VITE_API_URL=https://your-backend-domain.com`

- **Netlify**
  - Drag & drop your `frontend/dist` folder
  - Or connect GitHub for auto-deployment
  - Add redirect rules for SPA routing

#### **Backend Deployment:**
- **Railway** (Recommended for NestJS)
  - Connect GitHub repo
  - Add PostgreSQL database
  - Set environment variables
  - Auto-deploys on push

- **Render**
  - Connect GitHub repo
  - Add PostgreSQL database
  - Set build command: `yarn build`
  - Set start command: `yarn start:prod`

- **DigitalOcean App Platform**
  - Connect GitHub repo
  - Add managed PostgreSQL database
  - Configure environment variables

### Option 2: VPS/Server Deployment

#### **Using Docker (Easiest):**
```bash
# Clone your repository
git clone <your-repo-url>
cd FleetHub

# Copy environment files
cp Backend/env.example Backend/.env
cp frontend/env.example frontend/.env

# Edit environment variables
nano Backend/.env
nano frontend/.env

# Start with Docker Compose
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy
```

#### **Manual Deployment:**
```bash
# Backend
cd Backend
yarn install
yarn build
yarn start:prod

# Frontend
cd frontend
yarn install
yarn build
# Serve with nginx or any static file server
```

## 🔧 Environment Variables

### Backend (.env):
```env
DATABASE_URL="postgresql://user:password@host:5432/fleethub"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-domain.com"
```

### Frontend (.env):
```env
VITE_API_URL="https://your-backend-domain.com"
VITE_NODE_ENV="production"
```

## 📊 Database Setup

### For Production:
1. **Create PostgreSQL database**
2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set up CORS properly
- [ ] Configure file upload limits
- [ ] Set up proper error handling
- [ ] Enable request rate limiting
- [ ] Set up monitoring and logging

## 📈 Performance Optimizations

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Set up Redis for session storage (optional)

## 🚨 Monitoring

- Set up health checks
- Monitor database performance
- Track API response times
- Set up error tracking (Sentry)
- Monitor server resources

## 🔄 CI/CD Pipeline

### GitHub Actions Example:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        # Add your deployment steps
```

## 💰 Cost Estimation

### Free Tier Options:
- **Vercel**: Free for frontend
- **Railway**: $5/month for backend + database
- **Netlify**: Free for frontend

### Paid Options:
- **DigitalOcean**: $12-24/month
- **AWS**: $20-50/month
- **Google Cloud**: $20-40/month

## 🎯 Recommended Stack for Production:

1. **Frontend**: Vercel (Free tier)
2. **Backend**: Railway ($5/month)
3. **Database**: Railway PostgreSQL (included)
4. **File Storage**: Cloudinary or AWS S3
5. **Monitoring**: Sentry (free tier)

This setup will cost approximately **$5-10/month** and can handle thousands of users!
