# Quick Deployment Guide

## 🚀 Deploy to Render (Easiest - Free)

### Step 1: Prepare Your Code
1. Make sure all changes are committed to Git
2. Push to GitHub

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `jana-nayakan-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 3: Set Environment Variables
In Render dashboard, add these environment variables:
- `MONGODB_URI`: `mongodb+srv://karthikwarrier103_db_user:IyqMsTjF9eVUPN4g@jana-nayakan.4owtetz.mongodb.net/hackathonDB?retryWrites=true&w=majority`
- `PORT`: `3000`
- `JWT_SECRET`: Generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NODE_ENV`: `production`

### Step 4: Update Frontend
After deployment, you'll get a URL like: `https://jana-nayakan-backend.onrender.com`

Update these files:
- `frontend/dashbord.html` - Replace `'https://your-backend-url.onrender.com'` with your actual URL
- `frontend/index.html` - Same
- `frontend/Untitled-1.html` - Same

### Step 5: Deploy Frontend (Optional)
You can deploy frontend separately on Vercel/Netlify, or serve it from the same backend (already configured in server.js).

---

## 🚂 Deploy to Railway (Alternative - Free)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as Render)
5. Railway auto-deploys!

---

## 📝 Important Notes

- **Free tier services** may spin down after inactivity (Render: 15 min, Railway: varies)
- First request after spin-down may take 30-60 seconds
- MongoDB Atlas is already configured and working
- Frontend will automatically use localhost in development and production URL when deployed

---

## 🔧 Testing

After deployment, test your API:
```bash
curl https://your-backend-url.onrender.com/discussion/all
```

Should return JSON data if working correctly.

---

For detailed instructions, see `DEPLOYMENT.md`
