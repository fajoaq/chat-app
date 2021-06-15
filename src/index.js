const http = require('http')
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const M = require('minimatch');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDir));
 
io.on('connection', (socket) => {
  console.log("New websocket connection");

  socket.emit('message', "Welcome!");
  socket.on('sendMessage', (message) => io.emit('message', message))
});

server.listen(port, () => console.log(`Server is up on port ${port}`));