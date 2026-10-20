const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);

    socket.on('chat-message', (data) => {
      io.to(roomId).emit('chat-message', data);
    });

    socket.on('signal', (data) => {
      io.to(data.target).emit('signal', {
        sender: socket.id,
        signal: data.signal
      });
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` HeartSync Server running!`);
  console.log(` Open your browser to: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
