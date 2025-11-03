# 🚀 Neon Database Setup - Step by Step

## ✅ You Have Your Connection String!

Your Neon database is ready. Here's how to set it up:

---

## 📋 Step 1: Add to Render Environment Variables

### In Render Dashboard:

1. Go to **https://render.com** → Sign in
2. Click on your **backend service** (`fleethub-backend`)
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**

### Add These Variables:

#### Variable 1: DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_2Kf4kWSTtcrL@ep-soft-band-ahahixu5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### Variable 2: PUBLIC_BASE_URL
```
Key: PUBLIC_BASE_URL
Value: https://your-backend.onrender.com
```
*(Replace `your-backend` with your actual Render service name)*

5. Click **"Save Changes"**
   - Render will automatically restart your service

---

## 📋 Step 2: Run Database Migrations

1. In Render dashboard, go to **"Shell"** tab
2. Run these commands:

```bash
cd Backend
npx prisma migrate deploy
npx prisma generate
```

3. (Optional) Seed the database:
```bash
npx prisma db seed
```

---

## ✅ Step 3: Verify Connection

After Render restarts, check the logs:

1. Go to Render dashboard → **"Logs"** tab
2. You should see:
   ```
   ✅ Database connected successfully
   ```

If you see this, your database is connected! 🎉

---

## 🧪 Step 4: Test the Connection Locally (Optional)

If you want to test the connection from your local machine:

```bash
cd Backend

# Test connection with Prisma
npx prisma db pull

# Or test with psql (if you have it installed)
psql 'postgresql://neondb_owner:npg_2Kf4kWSTtcrL@ep-soft-band-ahahixu5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

---

## ⚙️ For Local Development

If you want to use this database locally too, create a `.env` file in the `Backend` folder:

```env
DATABASE_URL="postgresql://neondb_owner:npg_2Kf4kWSTtcrL@ep-soft-band-ahahixu5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PUBLIC_BASE_URL="http://localhost:3001"
JWT_SECRET="your-local-jwt-secret"
PORT=3001
NODE_ENV="development"
```

Then run:
```bash
cd Backend
npx prisma migrate deploy
npx prisma generate
```

---

## 🔒 Security Note

⚠️ **Important**: 
- Keep your database password secure
- Don't commit `.env` files to git
- Your connection string contains credentials - keep it private

---

## 🎯 What Happens Next?

1. ✅ Database is connected
2. ✅ Migrations run automatically
3. ✅ Your app can now store data permanently
4. ✅ No more expired database!

---

## 🆘 Troubleshooting

### "Connection refused" or "Connection timeout"
- Wait 1-2 minutes after adding environment variable
- Check connection string is correct (no extra spaces)
- Make sure `sslmode=require` is included

### "Migration failed"
- Make sure DATABASE_URL is set correctly
- Try: `npx prisma migrate reset` then `npx prisma migrate deploy`
- Check Prisma schema: `npx prisma validate`

### "Invalid credentials"
- Double-check password in connection string
- Verify username is `neondb_owner`

---

## ✅ Done!

Your Neon database is now configured and ready to use!

**Your database details:**
- **Provider**: Neon PostgreSQL
- **Region**: US East 1 (AWS)
- **Storage**: 3GB free
- **Status**: ✅ Active

