import mongoose from 'mongoose';
import config from 'config';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the connection string from environment variables or config
const db = process.env.MONGO_URI || config.get('mongoURI');


// Connect to MongoDB
const connectDatabase = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDatabase;
