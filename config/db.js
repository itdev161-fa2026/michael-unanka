import mongoose from 'mongoose';
import config from 'config';

//get the connection string


// connect to MongoDB
const connectDatabase = async () => {
    const db = config.get('mongoURI');
    try {
        await mongoose.connect(db);
        console. log('connected to MongoDB');
    } catch (error) {
        console.error('MongoDB Connection error:', error.message);
        // Exit with failure code
        process.exit(1);
    }
};

export default connectDatabase;