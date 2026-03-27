// server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 8000;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// We will use this simple object to keep track of users in the room.
// For a real app, you would use a database.
let usersInRoom = {};

io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  // --- NEW: WebRTC Signaling Logic ---

  // Event: A user wants to join the room
  socket.on('join-room', () => {
    console.log(`User ${socket.id} is joining the room.`);
    // Find the other user (if any)
    const otherUserId = Object.keys(usersInRoom).find(id => id !== socket.id);

    // Add the new user to our list
    usersInRoom[socket.id] = true;

    // If there is another user, tell them a new peer has joined.
    if (otherUserId) {
      console.log(`Notifying user ${otherUserId} that ${socket.id} has joined.`);
      // This tells the original user to start the WebRTC offer process.
      socket.to(otherUserId).emit('user-joined', socket.id);
    }
  });

  // Event: Relay the offer from the caller to the callee
  socket.on('offer', (payload) => {
    console.log(`Relaying offer from ${socket.id} to ${payload.target}`);
    io.to(payload.target).emit('offer', payload);
  });

  // Event: Relay the answer from the callee back to the caller
  socket.on('answer', (payload) => {
    console.log(`Relaying answer from ${socket.id} to ${payload.target}`);
    io.to(payload.target).emit('answer', payload);
  });

  // Event: Relay ICE candidates between peers
  socket.on('ice-candidate', (payload) => {
    // console.log(`Relaying ICE candidate from ${socket.id} to ${payload.target}`); // This can be very noisy
    io.to(payload.target).emit('ice-candidate', payload);
  });

  // --- End of NEW Logic ---


  socket.on('disconnect', () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
    // Clean up the user from our list when they disconnect
    delete usersInRoom[socket.id];
    // In a real app, you might want to notify the other user about the disconnection.
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running and listening on http://localhost:${PORT}`);
});