const socket = io();

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (confirmation) => console.log("The message was", confirmation));
});

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', { 
                lat: position.coords.latitude, 
                long: position.coords.longitude
            });
        });
    }
});