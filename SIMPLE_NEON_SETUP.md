# 🚀 Quick Setup - Neon Database

## ✅ Your Info:
- **Backend URL**: https://fleethub-backend.onrender.com
- **Neon Database**: Ready to connect

---

## 📋 3 Simple Steps:

### Step 1: Add Environment Variables in Render

1. Go to: https://dashboard.render.com
2. Click on **fleethub-backend** service
3. Click **"Environment"** tab
4. Add these 2 variables:

**Variable 1:**
```
DATABASE_URL
postgresql://neondb_owner:npg_2Kf4kWSTtcrL@ep-soft-band-ahahixu5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Variable 2:**
```
PUBLIC_BASE_URL
https://fleethub-backend.onrender.com
```

5. Click **"Save Changes"** (service will restart)

---

### Step 2: Run Migrations

1. In Render dashboard → Click **"Shell"** tab
2. Run these commands:
```bash
cd Backend
npx prisma migrate deploy
npx prisma generate
```

---

### Step 3: Verify ✅

1. Go to **"Logs"** tab
2. Look for: `✅ Database connected successfully`
3. Done! 🎉

---

## 🧪 Test It:

Visit: https://fleethub-backend.onrender.com/api

You should see the API documentation page.

---

## ✅ That's It!

Your database is now connected. No code changes needed!

