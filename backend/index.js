import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import profileRoute from "./routes/profile.route.js";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notificaton.route.js";
import conversationRoute from "./routes/conversation.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";
dotenv.config();
const PORT = process.env.PORT || 8800;
const __dirname = path.resolve();

// middlewares
// Yeh tumhare server ko batata hai ke JSON format ka data kaise samajhna hai, taake tum use apne code mein use kar sako
app.use(express.json());
// Yeh tumhe client ke cookies ko samajhne aur unka access karne mein madad karta hai.
app.use(cookieParser());
// Jab koi HTML form submit hota hai, toh yeh us data ko aasan tareeqe se handle karta hai, taake tumhare form se bheja gaya data easily accessible ho.
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// api routes

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/message", messageRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/post", postRoute);
app.use("/api/notification", notificationRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
