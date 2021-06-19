const http = require('http')
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, getUser, removeUser, getUsersInRoom, getRooms, getUsers } = require('./utils/users');

app.use(express.static(publicDir));

//CONNECT
io.on('connection', (socket) => {
  //GET AVAILABLE ROOMS
  socket.emit('joinForm', getRooms());
  //JOIN ROOM
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if(error) return callback(error);

    socket.join(user.room)

    //welcome
    socket.emit('message', generateMessage("Chat App", "Welcome!"));
    socket.broadcast.to(user.room).emit('message', generateMessage("Chat App", `${user.username} has joined ${user.room}`));

    io.to(user.room).emit('roomData', { room, users: getUsersInRoom(room) }); //update room data for all users in room
    callback(); // client was able to join succesfully, no error
  })
  //SEND MESSAGE
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if(user) {
      const filter = new Filter();

      if(filter.isProfane(message, callback)) return callback("Profanity is not allowed"); //error
      else {
        io
        .to(user.room)
        .emit('message', generateMessage(user.username, message));
        callback(); //confirmation
      }
    }
  });
  //SEND LOCATION
  socket.on('sendLocation', ({lat, long}, callback) => {
    const user = getUser(socket.id);

    if(user) {
      io
      .to(user.room)
      .emit('locationMessage', generateLocationMessage(user.username,'https://google.com/maps?q', {lat, long}));
      callback(); //confirmation
    }
  });
  //DISCONNECT
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io
      .to(user.room).emit('message', generateMessage("Chat App", `${user.username} has left!`));
      io
      .to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      // update room data for users in room
    }
  });
});

server.listen(port, () => console.log(`Server is up on port ${port}`));