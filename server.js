// Import express
const express = require('express');

// Create an express application object
const app = express();

// Define a port
const PORT = 3000;

// Create an API endpoint at the root
app.get('/', (req, res) => {
  res.send('Hello, your server is running!');
});

// Listen for connections
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
