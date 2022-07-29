/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-console */
'use strict';
const $chatForm = document.querySelector('#message-form');
const $chatFormInput = $chatForm.querySelector('input');
const $chatFormIButton = $chatForm.querySelector('button');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
//options
const {
  username, room
} = Qs.parse(location.search, {ignoreQueryPrefix : true});
console.log('{username, room}', {username, room});

// eslint-disable-next-line no-undef, no-unused-vars
const socket = io();
socket.on('message', message => {
  // eslint-disable-next-line no-console
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    'username' : message.username,
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

socket.on('roomData', ({
  room, users
}) => {
  const html = Mustache.render(sidebarTemplate, {
    room, users
  });
  document.querySelector('#sidebar').innerHTML = html;
});
socket.emit('join', {username, room}, (error) => {
  if(error) {
    alert(error);
  }
});
