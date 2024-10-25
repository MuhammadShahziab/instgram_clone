import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const userSocketMap = {}; //this map store socketId  corresponding the user Id ; userId => socket Id

export const getReceverSocketId = (recevierId) => userSocketMap[recevierId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User Id=${userId} and Socket Id = ${socket.id} connected`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(
        `User Id=${userId} and Socket Id = ${socket.id} disconnected`
      );
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
