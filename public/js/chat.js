/* eslint-disable no-console */
'use strict';
const $chatForm = document.querySelector('#message-form');
const $chatFormInput = $chatForm.querySelector('input');
const $chatFormIButton = $chatForm.querySelector('button');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

// eslint-disable-next-line no-undef, no-unused-vars
const socket = io.connect('http://localhost:3000', {reconnect: true});
socket.on('message', message => {
  // eslint-disable-next-line no-console
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    'message' : message.message,
    'createdAt' : message.time
  });
  $messages.insertAdjacentHTML('beforeend', html);
});
// submit form
$chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $chatFormIButton.setAttribute('disabled', 'disabled');
  const msg = e.target.elements.message.value;
  console.log(msg);

  //emit message to server
  socket.emit('chatMessage', msg, (error) => {
    $chatFormIButton.removeAttribute('disabled');
    $chatFormInput.value = '';
    $chatFormInput.focus();
    if(error) {
      return console.log(error);
    }
    console.log('message delivered');
  });
});
