/* eslint-disable no-alert */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
'use strict';
const path = require('path');
const express = require('express');
const http = require('http');
const Filter = require('bad-words');
//const prompt = require('prompt-sync')();
const { Server } = require('socket.io');
const generateMessage = require('./utils/messages');
const {addUsers, removeUsers, getUsers, getUsersInRoom} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDirPath = path.join(__dirname + '/public');
app.use(express.static(publicDirPath));

// Connection Establition
io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  socket.on('join', (options, callback) => {
    const {error, user } = addUsers({id : socket.id, ...options});
    if (error ){
      return callback(error);
    }
    socket.join(user.room);
    socket.emit('message', generateMessage('Admin', 'welcome to chat'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username}has joined`));
    io.to(user.room).emit('roomData', {
      room : user.room,
      users : getUsersInRoom(user.room)
    });
  });

  // Message To Chat
  socket.on('chatMessage', (message, callback) => {
    const user = getUsers(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  // Disconnect of User from chat
  socket.on('disconnect', () => {
    console.log('user disconnected');
    const user = removeUsers(socket.id);
    if(user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username}has left the chat`));
      io.to(user.room).emit('roomData', {
        room : user.room,
        users : getUsersInRoom(user.room)
      });
    }
  });
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
