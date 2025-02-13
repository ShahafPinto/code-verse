const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

require("dotenv").config();
const codeBlockModel = require("./Models/CodeBlock");

const app = express();

app.use(express.json());
app.use(cors());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to code-verse App");
});

const port = process.env.PORT || 5000;
const dbUrl = process.env.ATLAS_URL;

const expressServer = app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection fail:", error.message));

// Get all code blocks
app.get("/getCodeBlocks", (req, res) => {
  codeBlockModel
    .find()
    .then((codeBlocks) => res.json(codeBlocks))
    .catch((error) => res.json(error));
});

// Get code block by id
app.get("/getCodeBlock/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const codeBlock = await codeBlockModel.findById(id);
    if (!codeBlock)
      return res.status(404).json({ message: "Code block not found" });

    res.json(codeBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

const io = new Server(expressServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    const usersInRoom = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log(`User ${socket.id} joined room ${room}`);
    io.to(room).emit("userCount", usersInRoom);

    const role = usersInRoom === 1 ? "mentor" : "student";

    socket.role = role;
    socket.roomId = room;

    socket.emit("roleAssigned", role);
  });

  socket.on("codeChange", (room, code) => {
    socket.to(room).emit("codeUpdate", code);
  });

  socket.on("disconnecting", () => {
    if (socket.role === "mentor" && socket.roomId) {
      console.log(
        `Mentor left room ${socket.roomId}, navigating users to lobby`
      );
      io.to(socket.roomId).emit("mentorLeft");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
