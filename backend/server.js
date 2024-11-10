const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;

const app = express();

// Middleware to parse JSON data
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Home route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});