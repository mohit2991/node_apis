const express = require("express"); // Freamwork
const bodyParser = require("body-parser"); // Middleware
const app = express();

const router = require("./src/routes");

// Add body parser as middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// API Routes or Endpoint
app.use("/", router);

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
