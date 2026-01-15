# MongoDB Timeout Error Fix

## Problem
Getting error: `Operation otps.insertOne() buffering timed out after 10000ms`

## Root Cause
This error occurs when:
1. MongoDB connection is not fully established before operations are attempted
2. MongoDB Atlas network access restrictions
3. Connection string issues
4. Network latency between server and MongoDB Atlas

## Solutions Applied

### 1. Improved MongoDB Connection Options
- Increased timeouts (30 seconds for server selection, 45 seconds for socket)
- Added connection pooling (min 2, max 10 connections)
- Added retry logic

### 2. Connection State Checking
- Server now waits for MongoDB connection before starting
- OTP generation checks connection state before attempting operations
- Better error messages

### 3. Timeout Handling
- Added explicit timeout handling in OTP save operations
- Better error messages for debugging

## Additional Steps to Fix

### Check MongoDB Atlas Configuration

1. **Network Access**
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is whitelisted (allows all IPs)
   - Or add your Render/Railway IP addresses

2. **Database User Permissions**
   - Go to MongoDB Atlas → Database Access
   - Ensure your user has read/write permissions
   - User: `karthikwarrier103_db_user`

3. **Connection String**
   - Verify the connection string includes the database name
   - Current: `mongodb+srv://...@jana-nayakan.4owtetz.mongodb.net/hackathonDB?retryWrites=true&w=majority`
   - Database name: `hackathonDB`

### Environment Variables

Make sure these are set in your hosting platform:

```env
MONGODB_URI=mongodb+srv://karthikwarrier103_db_user:IyqMsTjF9eVUPN4g@jana-nayakan.4owtetz.mongodb.net/hackathonDB?retryWrites=true&w=majority
```

### Testing Connection

After deployment, check logs for:
- `✅ Connected to MongoDB`
- `📊 Database: hackathonDB`
- `🌐 MongoDB Status: ✅ Connected`

If you see `❌ Disconnected`, check:
1. MongoDB Atlas network access
2. Connection string format
3. Database user credentials

## If Error Persists

1. **Check Render/Railway Logs**
   - Look for MongoDB connection errors
   - Check if connection is established

2. **Test MongoDB Connection**
   ```bash
   # From your local machine
   mongosh "mongodb+srv://karthikwarrier103_db_user:IyqMsTjF9eVUPN4g@jana-nayakan.4owtetz.mongodb.net/hackathonDB"
   ```

3. **Verify Database Name**
   - Ensure `hackathonDB` exists in MongoDB Atlas
   - Or create it if it doesn't exist

4. **Check Collection Name**
   - OTP collection should be created automatically
   - Collection name will be `otps` (plural of model name `OTP`)

## Expected Behavior

After fix:
- Server waits up to 10 seconds for MongoDB connection
- OTP generation checks connection state before saving
- Better error messages if connection fails
- Operations timeout after 15 seconds with clear error

The timeout error should be resolved! 🎉
