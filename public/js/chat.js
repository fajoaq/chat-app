const socket = io();

const submitButton = document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message);
});

socket.on('message', (message) => {
    console.log(message);
});

/* 
io.on('connection', (socket) => {
    console.log("New socket connection");
}); 
*/