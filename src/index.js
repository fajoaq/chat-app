const http = require('http')
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const M = require('minimatch');
const Filter = require('bad-words');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users');


app.use(express.static(publicDir));
 
io.on('connection', (socket) => {
  console.log("New websocket connection");
  //JOIN
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if(error) return callback(error);

    socket.join(user.room)

    //welcome
    socket.emit('message', generateMessage("Welcome!"));
    socket.broadcast.to(user.room).emit('message', generateMessage( `${user.username} has joined ${user.room}`));

    callback(); // client was able to join succesfully, no error
  })
  //SEND MESSAGE
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if(filter.isProfane(message, callback)) return callback("Profanity is not allowed");
    else {
      io.to('WeDemBois').emit('message', generateMessage(message));
      callback(); 
    }
  });
  //SEND LOCATION
  socket.on('sendLocation', ({lat, long}, callback) => {
    io.emit('locationMessage', generateLocationMessage('https://google.com/maps?q', {lat, long}));
    callback();
  });
  //DISCONNECT
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
  });
});

server.listen(port, () => console.log(`Server is up on port ${port}`));