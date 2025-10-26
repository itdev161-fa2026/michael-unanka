const mongoose = require('mongoose');
const config = require('config');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the connection string from environment variables or config
const db = process.env.MONGO_URI || config.get('mongoURI');

// Connect to MongoDB
const connectDatabase = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(' Connected to MongoDB');
    } catch (error) {
        console.error(' MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;
