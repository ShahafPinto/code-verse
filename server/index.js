const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
// Loading environment variables from .env file
require("dotenv").config();
const codeBlockModel = require("./Models/CodeBlock");

const app = express();

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to code-verse App");
});

// Setting the port for the server to listen on
const port = process.env.PORT || 5000;
// Connecting to MongoDB
const uri = process.env.ATLAS_URI;
// Starting the Express server
const expressServer = app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

// חיבור ל-MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection fail:", error.message));

// Get all code blocks
app.get("/getCodeBlocks", (req, res) => {
    codeBlockModel.find()
    .then(codeBlocks=>res.json(codeBlocks))
    .catch(error=> res.json(error))
  });

// Get code block by id
app.get("/getCodeBlock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching CodeBlock with ID:", id); // Debug

    const codeBlock = await codeBlockModel.findById(id);
    if (!codeBlock) return res.status(404).json({ message: "Code block not found" });

    res.json(codeBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});
// Setting up Socket.IO server on top of Express server
const io = new Server(expressServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    console.log('in joinRoom socket event, the room is:',room) 
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("codeChange", ({ room, code }) => {
    socket.to(room).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
