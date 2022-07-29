'use strict';

//users array
const users = [];

const addUsers = (({
  id, username, room
}) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if(!username || !room) {
    return {
      error : 'username and room should present'
    };
  }
  // eslint-disable-next-line no-prototype-builtins
  const getName = users.filter((value) => (value.username).includes(username));
  const newName = getName.reduce((accumulator, currentval) => {
    const Newcurrentval = parseInt((currentval.username).replace(/[^0-9]/g, ''));
    return accumulator > Newcurrentval ? accumulator : Newcurrentval;
  }, 0);
  if (newName === 9999) {
    return 'username already exists';
  }
  username = `${username}#${newName + 1}`;
  const user = {id, username, room};
  users.push(user);
  return { user };
});

const removeUsers = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//Get Users 
const getUsers = (id) => {
  return users.find((user) => user.id === id);
};

//Get Users In Room
const getUsersInRoom = (room) => {
  return users.filter((user)=> user.room === room);
};
module.exports = {addUsers, removeUsers, getUsers, getUsersInRoom};
