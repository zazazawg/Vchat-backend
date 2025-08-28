// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// ✅ create one HTTP server for both Express & Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
const userSocketMap = {};
// socket.io connection
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
  userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
}
  socket.on("disconnect", () => {
  console.log("❌ User disconnected:", socket.id);
  if (userId) {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }
});
});
// start server
server.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
})

export { app, io, server };
