'use strict';
const moment = require('moment');

function generateMessage(username, message) {
  return {
    username,
    message,
    time : moment().format('h:mm a')
  };
}

module.exports = generateMessage;
