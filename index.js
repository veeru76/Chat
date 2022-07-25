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

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDirPath = path.join(__dirname + '/public');
app.use(express.static(publicDirPath));
// eslint-disable-next-line no-unused-vars
const namesArray = [];

function getUniqueId(namesArray, name) {
  const getName = namesArray.filter((value) => value.includes(name));
  const newName = getName.reduce((accumulator, currentval) => {
    const Newcurrentval = parseInt(currentval.split(/([0-9]+)/), 10);
    return accumulator > Newcurrentval ? accumulator : Newcurrentval;
  }, 0);
  if (newName === 9999) {
    return -1;
  }
  return `${name}#${newName + 1}`;
}

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('a user connected');
  socket.emit('message', generateMessage('welcome to chat'));

  socket.on('chatMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.emit('message', generateMessage(message));
    callback();
  });
  socket.broadcast.emit('message', generateMessage('a new user has joined chat'));
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('message', generateMessage('a user has left the chat'));
  });
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
