# 🚗 Car Image Setup Guide

## Problem
The current seed data uses generic Unsplash images that don't match the actual car models (e.g., showing a Scania truck for a 2023 Jeep Wrangler).

## Solution
Use the **CarsXE Vehicle Images API** to fetch proper car-specific images.

## Setup Steps

### 1. Get CarsXE API Key
1. Visit: https://api.carsxe.com/
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Add API Key to Environment
Add to your `.env` file:
```bash
CARSXE_API_KEY=your_api_key_here
```

### 3. Run the New Seed Script
```bash
# From Backend directory
npx ts-node prisma/seed-with-car-images.ts
```

## How It Works

The new seed script:
1. **Fetches real car images** for each model using the CarsXE API
2. **Falls back to generic images** if API fails or no key is provided
3. **Logs the process** so you can see which images were found

## Example Output
```
🔄 Fetching images for BMW X5 2023...
✅ Found 2 images for BMW X5 2023
🔄 Fetching images for Tesla Model 3 2024...
✅ Found 2 images for Tesla Model 3 2024
🔄 Fetching images for Porsche 911 2024...
✅ Found 2 images for Porsche 911 2024
```

## Benefits
- ✅ **Accurate images** - Each car shows the actual model
- ✅ **Professional look** - Real car photos instead of generic stock images
- ✅ **Fallback system** - Still works if API is unavailable
- ✅ **Easy setup** - Just add one API key

## Alternative APIs
If CarsXE doesn't work, you can also try:
- **CarImagery.com** - Licensed stock photos
- **Auto-Data.net** - Curated vehicle photos
- **Unsplash with specific tags** - Better search terms

## Cost
- CarsXE: Free tier available
- CarImagery: Subscription required
- Auto-Data: Varies by usage

## Next Steps
1. Get your CarsXE API key
2. Add it to your `.env` file
3. Run the new seed script
4. Enjoy proper car images! 🚗✨
