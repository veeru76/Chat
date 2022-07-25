'use strict';
const moment = require('moment');

function generateMessage(message) {
  return {
    message,
    time : moment().format('h:mm a')
  };
}

module.exports = generateMessage;
