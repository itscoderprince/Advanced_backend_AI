import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";
import User from "./features/auth/auth.model.js";

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Ananya", "Diya", "Gauri", "Kavya", "Navya", "Sara", "Riya", "Pooja", "Priya", "Sneha",
  "Alex", "John", "Emma", "Liam", "Olivia", "Noah", "Sophia", "Lucas", "Mia", "Ethan"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Mehta", "Patel", "Singh", "Kumar", "Reddy", "Joshi", "Chopra",
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Taylor", "Anderson"
];

const generateDemoUsers = (count = 100) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    users.push({
      name: `${firstName} ${lastName}`,
      email: `user${i}_${firstName.toLowerCase()}@example.com`,
      password: `pass@${1000 + i}`,
    });
  }
  return users;
};

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected! Inserting 100 demo users...");

    const demoUsers = generateDemoUsers(100);
    await User.insertMany(demoUsers);

    console.log("✅ Successfully inserted 100 demo users into MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
