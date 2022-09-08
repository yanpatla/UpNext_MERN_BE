import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { Server } from "socket.io";
const app = express();
app.use(express.json());
dotenv.config(process.env.DATABASE_URI);

connectDB();
//Config CORS
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Cors Error"));
    }
  },
};

app.use(cors(corsOptions));

//Routing

app.use("/api/users", userRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server on Port ${PORT}`);
});

//Socket.io

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");

  //Definir Eventos de Sockets io
  socket.on("open project", (project) => {
    //Esto lo que hace que cada uno se una a un socket diferente
    socket.join(project);
  });

  socket.on("new task", (task) => {
    socket.to(task.project).emit("added task", task);
  });

  socket.on("delete task", (task) => {
    const project = task.project;
    socket.to(project).emit("deleted task", task);
  });

  socket.on("update task", (task) => {
    const project = task.project._id;
    socket.to(project).emit("updated task", task);
  });

  socket.on("change state", (task) => {
    const project = task.project._id;
    socket.to(project).emit("new state", task);
  });
});
