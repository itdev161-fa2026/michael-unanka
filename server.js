import express from 'express';
import connectDatabase from './config/db.js';

// initializze espress application
const app = express();

// connect to the database
connectDatabase();

// API endpoints
app.get('/', (req, res) => res.send('http get request sent to root api endpoint')
);

// Connection listener
app.listen(3000, () => console.log('Express server running on port 3000'));