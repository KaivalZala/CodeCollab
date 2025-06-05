

// // // 29.3.2025
// import express from "express";
// import cors from "cors";
// import 'dotenv/config';
// import cookieParser from "cookie-parser";
// import connectDB from "./config/mongodb.js";
// import authRouter from "./routes/authRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import issueRoutes from "./routes/issueRoutes.js";
// import path from "path"; 
// import mime from "mime-types";
// import fs from "fs";

// const app = express();
// const port = process.env.PORT || 4000;
// connectDB();

// const allowedOrigins = ['http://localhost:5173'];
// app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.use(express.json());
// app.use(cookieParser());

// // ✅ Static File Serving for /uploads (Fixes 404)
// // ✅ Serve files directly without forcing downloads
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));




// // API Endpoints
// app.get("/", (req, res) => res.send("API working fine"));
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/issues", issueRoutes);

// app.listen(port, () => console.log(`✅ Server started on PORT: ${port}`));




// newwwwwww
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import snippetRoutes from "./routes/snippetRoutes.js";
import { v4 as uuidV4 } from "uuid";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://code-collab-mu.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

connectDB();

app.use(cors({ origin: ["http://localhost:5173","https://code-collab-mu.vercel.app"], credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.get("/", (req, res) => res.send("API working fine"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/issues", issueRoutes);
app.use("/api/snippets", snippetRoutes);

// Active Rooms Storage
const rooms = {}; // { roomId: { title, host, users: { socketId: userName }, code } }

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a Room
  socket.on("createRoom", ({ userName, roomTitle }, callback) => {
    const roomId = uuidV4();
    rooms[roomId] = {
      title: roomTitle || "Untitled Room",
      host: userName,
      users: {},
      code: "// Start coding...",
    };

    io.emit("roomCreated", {
      roomId,
      title: rooms[roomId].title,
      host: userName,
      participants: 0,
    });

    callback(roomId);
  });

  // Join a Room
  socket.on("joinRoom", ({ roomId, userName }, callback) => {
    if (!rooms[roomId]) return callback("Room does not exist");

    if (!Object.values(rooms[roomId].users).includes(userName)) {
      rooms[roomId].users[socket.id] = userName;
    }

    socket.join(roomId);
    callback(null, rooms[roomId].code);

    io.to(roomId).emit("updateUserList", Object.values(rooms[roomId].users));
    io.emit("updateRoomUsers", {
      roomId,
      participants: Object.keys(rooms[roomId].users).length,
    });
  });

  // Sync Code in Real-time
  socket.on("codeChange", ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].code = code;
      socket.to(roomId).emit("codeUpdate", code);
    }
  });

  // Send Chat Messages
  socket.on("sendMessage", ({ roomId, message, userName }) => {
    const timestamp = new Date().toLocaleTimeString();
    io.to(roomId).emit("receiveMessage", { userName, message, timestamp });
  });

  // Leave Room
  socket.on("leaveRoom", (roomId) => {
    if (rooms[roomId] && rooms[roomId].users[socket.id]) {
      delete rooms[roomId].users[socket.id];
      io.to(roomId).emit("updateUserList", Object.values(rooms[roomId].users));

      if (Object.keys(rooms[roomId].users).length === 0) {
        delete rooms[roomId];
        io.emit("removeRoom", roomId);
      } else {
        io.emit("updateRoomUsers", {
          roomId,
          participants: Object.keys(rooms[roomId].users).length,
        });
      }
    }
    socket.leave(roomId);
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].users[socket.id]) {
        delete rooms[roomId].users[socket.id];
        io.to(roomId).emit("updateUserList", Object.values(rooms[roomId].users));

        if (Object.keys(rooms[roomId].users).length === 0) {
          delete rooms[roomId];
          io.emit("removeRoom", roomId);
        } else {
          io.emit("updateRoomUsers", {
            roomId,
            participants: Object.keys(rooms[roomId].users).length,
          });
        }
        break;
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(port, () => console.log(`✅ Server running on PORT: ${port}`));
