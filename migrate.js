const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Discussion"); // adjust path if needed

const LOCAL_DB = "mongodb://127.0.0.1:27017/hackathonDB";
const PROD_DB =
  "mongodb+srv://karthikwarrier103_db_user:IyqMsTjF9eVUPN4g@jana-nayakan.4owtetz.mongodb.net/hackathonDB?retryWrites=true&w=majority";

async function migrate() {
  try {
    // 1️⃣ Connect to LOCAL DB
    await mongoose.connect(LOCAL_DB);
    console.log("Connected to LOCAL DB");

    const users = await User.find().lean();
    const posts = await Post.find().lean();

    console.log(`Found ${users.length} users`);
    console.log(`Found ${posts.length} posts`);

    // 2️⃣ Switch to PROD DB
    await mongoose.disconnect();

    await mongoose.connect(PROD_DB);
    console.log("Connected to PROD DB");

    // OPTIONAL: clear prod collections to avoid duplicates
    // await User.deleteMany({});
    // await Post.deleteMany({});

    // 3️⃣ Insert data
    if (users.length) await User.insertMany(users, { ordered: false });
    if (posts.length) await Post.insertMany(posts, { ordered: false });

    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
