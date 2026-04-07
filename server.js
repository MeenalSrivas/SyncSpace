import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

// Attach Socket.io to the server and allow React to connect
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

// The WebSocket Logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for text changes from a user
  socket.on('send-changes', (text) => {
    // Broadcast those changes to EVERYONE ELSE connected
    socket.broadcast.emit('receive-changes', text);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log('Backend server is running on http://localhost:3001');
});