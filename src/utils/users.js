const users = [];

const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //validate
  if (!username || !room) return { error: "username and room are required" };
  // chaeck for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });
  // validate username
  if (existingUser) return { error: "Username is in use" };
  // store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};
const removeUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });
  if (index !== -1) return users[index];
  return undefined;
};
const getUsersInRoom = room => {
  const u = users.filter(user => {
    return user.room === room;
  });
  if (u) return u;
  return [];
};
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};