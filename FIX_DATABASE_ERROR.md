# 🔧 Fix Database Connection Error

## ❌ The Problem:
Render is trying to use the old expired database (`dpg-d3fo5bnfte5s73d91vug-a`).

## ✅ The Solution:

### Step 1: Add DATABASE_URL in Render Dashboard (CRITICAL!)

1. Go to: **https://dashboard.render.com**
2. Click on **fleethub-backend** service
3. Click **"Environment"** tab
4. Look for `DATABASE_URL` - **DELETE IT** if it exists (the old one)
5. Click **"Add Environment Variable"**
6. Add:
   ```
   Key: DATABASE_URL
   Value: postgresql://neondb_owner:npg_2Kf4kWSTtcrL@ep-soft-band-ahahixu5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
7. Also add:
   ```
   Key: PUBLIC_BASE_URL
   Value: https://fleethub-backend.onrender.com
   ```
8. Click **"Save Changes"**

### Step 2: Manual Deploy (Important!)

After adding the environment variable:
1. In Render dashboard → **"Manual Deploy"** tab
2. Click **"Deploy latest commit"**
3. This will rebuild with the new DATABASE_URL

---

## ⚠️ Why This Happened:

The `render.yaml` file has `sync: false` which means environment variables in the yaml file are NOT automatically set. You MUST set them manually in the Render dashboard.

---

## ✅ After Deploy:

Check the **Logs** tab - you should see:
```
✅ Database connected successfully
```

If you still see errors, the DATABASE_URL wasn't set correctly. Double-check:
- No extra spaces in the connection string
- The entire string is on one line
- `?sslmode=require&channel_binding=require` is included

---

## 🎯 Quick Checklist:

- [ ] Deleted old DATABASE_URL from Render dashboard
- [ ] Added new Neon DATABASE_URL in Render dashboard  
- [ ] Added PUBLIC_BASE_URL in Render dashboard
- [ ] Saved changes
- [ ] Manually triggered new deploy
- [ ] Checked logs for "✅ Database connected successfully"

---

**This will fix the connection error!** 🚀

