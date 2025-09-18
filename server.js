const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
