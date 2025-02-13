# Coding Environment App

This project provides an interactive coding environment where users can join rooms representing different code blocks. The platform allows real-time code collaboration and updates using WebSocket communication via Socket.io.
## Tech Stack
- **ReactJS**: Frontend framework for building the user interface.
- **Express**: Backend framework for handling requests and routing.
- **Socket.io**: Real-time communication for live updates during code-blocks rooms.
- **MongoDB**: NoSQL database for storing code blocks data.

## Features
- The first user in a room is identified as a mentor, while all others are students.
- The number of connected students in each room updates in real-time.
- The mentor has read-only access to the code, while students can edit the code. Any changes made by a student are updated in real-time for all users in the same room.
- If the student enters the correct code, a smiley face appears on the screen.
- If the mentor leaves the room, all connected users are redirected to the main page.

## Running the Project

### Steps

1. **Clone the Repository**
2. **Set Up Environment Variables**

3. **Run the Server:**
   ```bash
   cd server
   npm install
   npm start
4. **Run the Client:**
   ```bash
   cd client
   npm install
   npm run dev
