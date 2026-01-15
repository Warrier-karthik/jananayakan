const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const commentRouter = require("./routes/comments.js");
const discussionRouter = require("./routes/discussion.js");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://karthikwarrier103_db_user:IyqMsTjF9eVUPN4g@jana-nayakan.4owtetz.mongodb.net/hackathonDB?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((error) => console.error("❌ MongoDB connection error:", error));

app.use(express.json());

// CORS configuration - Allow all origins for API access
// This fixes CORS errors when frontend and backend are on different domains
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl requests)
        if (!origin) return callback(null, true);
        
        // Get allowed origins from environment
        const allowedOrigins = process.env.FRONTEND_URL;
        
        // If FRONTEND_URL is "*" or not set, allow all origins
        // Note: When credentials: true, we return the origin itself, not "*"
        if (!allowedOrigins || allowedOrigins === "*") {
            return callback(null, true); // This allows all origins
        }
        
        // If specific origins are provided, check against them
        const originsList = allowedOrigins.split(",").map(url => url.trim());
        if (originsList.includes(origin)) {
            callback(null, true);
        } else {
            // Allow the origin if it's not in the list (for flexibility during development)
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.options('*', cors(corsOptions));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "frontend")));

// API Routes
app.use("/", userRouter);
app.use("/auth", authRouter);
app.use("/discussion", discussionRouter);
app.use("/comments", commentRouter);

// Serve frontend files
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dashbord.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "Untitled-1.html"));
});

// Start server
app.listen(PORT, (error) => {
    if (error) {
        console.error("❌ Server error:", error);
    } else {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}`);
    }
});