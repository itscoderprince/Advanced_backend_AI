import { redis } from "../../index.js";
import emailQueue from "../../lib/queue.js";
import sendEmail from "../../lib/sendEmail.js";
import User from "./auth.model.js";

// Without que
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // 1. Create user in MongoDB
    const user = await User.create({ name, email, password });

   await emailQueue.add("send-email", {
      email: email,
      subject: "Welcome to the Platform!",
      text: "Thank you for registering with our platform!",
    });

    // 2. 🧹 CLEAR THE STALE CACHE in Redis!
    await redis.del("users:all");
    console.log(
      "🧹 Cache cleared: 'users:all' deleted because a new user registered",
    );

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({ message: "All users fetched successfully", users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getAllUsersWithRedis = async (req, res) => {
  try {
    // 1. Check Redis Cache
    const cachedUsers = await redis.get("users:all");
    if (cachedUsers) {
      console.log("⚡ Cache HIT -> Served from Redis");
      return res.status(200).json(JSON.parse(cachedUsers));
    }

    // 2. Cache MISS -> Fetch from MongoDB
    console.log("🐢 Cache MISS -> Fetching from MongoDB");
    const users = await User.find();

    // 3. Save to Redis (expires in 60 seconds)
    await redis.set("users:all", JSON.stringify(users), "EX", 60);

    return res.status(200).json(users, users.length);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

export const logout = (req, res) => {};
export const login = (req, res) => {};
