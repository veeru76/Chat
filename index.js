'use strict';
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on *:3000');
});
