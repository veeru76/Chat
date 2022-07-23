'use strict';
// eslint-disable-next-line no-undef, no-unused-vars
const socket = io.connect('http://localhost:3000', {reconnect: true});
socket.on('message', message => {
  // eslint-disable-next-line no-console
  console.log(message);
});
