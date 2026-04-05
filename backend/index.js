import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import resumeRoutes from "./routes/resume.routes.js";
import messageRoutes from "./routes/message.route.js";


dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.set("trust proxy", 1);


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
   // origin: process.env.FRONTEND_URL ,
    credentials: true,
  })
);


app.use("/uploads", express.static("uploads"));


app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1", resumeRoutes);
app.use("/api/v1/messages", messageRoutes);


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
   // origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("🔌 New user connected:", socket.id);

  socket.on("sendMessage", (data) => {
    socket.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 8000;
//const PORT = process.env.PORT ;


//const PORT = process.env.PORT || 8000;
//const PORT = process.env.PORT ;



const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
};

startServer();
