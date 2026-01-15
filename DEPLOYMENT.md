# Deployment Guide

This guide will help you deploy the Jana Nayakan application to various hosting platforms.

## Prerequisites

- Node.js 18+ installed locally
- MongoDB Atlas account (already configured)
- Git repository (GitHub recommended)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb+srv://karthikwarrier103_db_user:IyqMsTjF9eVUPN4g@jana-nayakan.4owtetz.mongodb.net/hackathonDB?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=your-random-secret-key-here
FRONTEND_URL=*
API_BASE_URL=http://localhost:3000
```

**Important:** Generate a strong JWT_SECRET for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Option 1: Deploy to Render (Recommended - Free Tier)

### Steps:

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the Service**
   - **Name:** `jana-nayakan-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add the following:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: `3000` (Render will override this, but set it anyway)
     - `JWT_SECRET`: Generate a random secret key
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `https://your-app-name.onrender.com`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

6. **Update Frontend API URL**
   - After deployment, note your Render URL (e.g., `https://jana-nayakan-backend.onrender.com`)
   - Update `API_CONFIG.BASE_URL` in `frontend/dashbord.html` and other frontend files
   - Or use the environment detection script (see below)

### Render URL Format:
Your app will be available at: `https://jana-nayakan-backend.onrender.com`

**Note:** Free tier services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## Option 2: Deploy to Railway (Recommended - Free Tier)

### Steps:

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: `3000`
     - `JWT_SECRET`: Generate a random secret key
     - `NODE_ENV`: `production`

4. **Deploy**
   - Railway auto-detects Node.js and deploys
   - Wait for deployment (2-5 minutes)

5. **Get Your URL**
   - Railway provides a URL like: `https://your-app-name.up.railway.app`
   - Update frontend files with this URL

### Railway URL Format:
Your app will be available at: `https://your-app-name.up.railway.app`

---

## Option 3: Deploy Frontend and Backend Separately

### Backend (Render/Railway)
- Deploy backend as shown above

### Frontend (Vercel/Netlify)

#### Using Vercel:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd hackathon-main/frontend
   vercel
   ```

3. **Update API URL**
   - After deployment, update `API_CONFIG.BASE_URL` in frontend files
   - Use your backend URL from Render/Railway

#### Using Netlify:

1. **Go to [netlify.com](https://netlify.com)**
2. **Drag and drop** the `frontend` folder
3. **Update API URLs** in frontend files

---

## Updating Frontend API URLs

After deploying the backend, you need to update the API URLs in your frontend files.

### Option A: Manual Update

Update these files:
- `frontend/dashbord.html` (line ~1471)
- `frontend/index.html` (line ~842)
- `frontend/Untitled-1.html` (line ~877)

Change:
```javascript
BASE_URL: 'http://localhost:3000'
```

To:
```javascript
BASE_URL: 'https://jananayakan-1.onrender.com'
```

### Option B: Environment Detection (Recommended)

I've created a script that automatically detects the environment. The frontend will:
- Use `http://localhost:3000` in development
- Use your production URL when deployed

Update the API_CONFIG in each frontend file:

```javascript
const API_CONFIG = {
  BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://jananayakan-1.onrender.com',
  // ... rest of config
};
```

---

## Testing Deployment

1. **Check Backend Health**
   ```bash
   curl https://jananayakan-1.onrender.com/discussion/all
   ```

2. **Test Frontend**
   - Open your deployed frontend URL
   - Try logging in
   - Create a post
   - Check if leaderboard loads

---

## Troubleshooting

### Common Issues:

1. **"Cannot connect to server"**
   - Check if backend is running
   - Verify API URL in frontend
   - Check CORS settings

2. **MongoDB Connection Error**
   - Verify MONGODB_URI is set correctly
   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)

3. **Port Already in Use**
   - Render/Railway sets PORT automatically
   - Make sure server.js uses `process.env.PORT`

4. **Frontend Not Loading**
   - Check if static files are being served
   - Verify file paths in server.js

---

## MongoDB Atlas Configuration

1. **Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allow all IPs) or your hosting IP

2. **Database User**
   - Ensure your database user has read/write permissions

---

## Production Checklist

- [ ] Environment variables set
- [ ] JWT_SECRET is strong and random
- [ ] MongoDB connection string is correct
- [ ] Frontend API URLs updated
- [ ] CORS configured correctly
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Security headers added (optional)

---

## Support

If you encounter issues:
1. Check server logs in Render/Railway dashboard
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors

---

## Quick Deploy Commands

### Render (using CLI):
```bash
npm install -g render-cli
render login
render deploy
```

### Railway (using CLI):
```bash
npm install -g @railway/cli
railway login
railway up
```

---

**Happy Deploying! 🚀**
