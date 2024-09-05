require("dotenv").config();
const express = require("express"); // Freamwork
const bodyParser = require("body-parser"); // Middleware
const cors = require("cors");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app); // Create http server

const newSocket = require("socket.io");
// const io = newSocket(server);
const io = newSocket(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend server address
    methods: ["GET", "POST"],
  },
});

const routes = require("./src/routes");
const authRoutes = require("./src/routes/authRoutes");
const {
  sendMessageIo,
  getMessagesIo,
} = require("./src/controllers/chatController");

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

// Serve static files from the 'public' directory
app.use("/", express.static(path.join(__dirname, "src", "public")));

const port = 8000;

const onlineUsers = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connection", socket.id);

  // Add message
  socket.on("sendMessage", async (payload) => {
    try {
      // Store user details with socket.id
      onlineUsers[socket.id] = {
        email: payload.email,
        to_user_id: payload.to_user_id,
      };

      // Customer payload
      // {
      //   KNxFtVKv2sJ5QSdVAAAC: {
      //     email: "mohit2991kumar@gmail.com",
      //     to_user_id: null
      //   }
      // }

      // Support payload
      // {
      //   KNxFtVKv2sJ5QSdVAAAC: {
      //     email: "support@gmail.com",
      //     to_user_id: 42
      //   }
      // }

      // Save message to the database
      await sendMessageIo(payload);

      const response = await getMessagesIo({
        email: payload.email,
        to_user_id: payload.to_user_id,
      });

      // Emit message to all clients or specific rooms
      io.emit("receiveMessage", response); // Broadcast to all clients
    } catch (err) {
      console.log(">>>>>>>>>>>> socket.io err", err);
    }
  });

  // // Optional: Emit initial messages to the newly connected client
  // socket.on("fetchInitialMessages", async () => {
  //   try {
  //     // Fetch messages based on stored user info
  //     const payload = onlineUsers[socket.id];

  //     const response = getMessagesIo(payload);

  //     socket.emit("receiveMessage", response);
  //   } catch (err) {
  //     console.error("Error fetching initial messages:", err);
  //   }
  // });

  // Optionally, handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    // Remove user info on disconnect
    delete onlineUsers[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
