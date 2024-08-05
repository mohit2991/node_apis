const express = require("express"); // Freamwork
const bodyParser = require("body-parser"); // Middleware
const cors = require("cors");
const path = require("path");
const app = express();

require("dotenv").config();

const routes = require("./src/routes");
const authRoutes = require("./src/routes/authRoutes");

app.use(cors()); // Use this to allow all origins

// Add body parser as middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// API Routes or Endpoint
app.use(authRoutes);
app.use(routes);

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
