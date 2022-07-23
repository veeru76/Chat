'use strict';
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDirPath = path.join(__dirname + '/public');
app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('message', 'welcome to chat');
  socket.broadcast.emit('message', 'a new user has joined');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('message', 'a user has left the chat');
  });
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
