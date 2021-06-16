const socket = io();

//elements - $ convention
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
    //enable - needs time to update DOM
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error) return console.log(error);
        else { console.log("Message delivert!"); }
    });
});

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, { message });

    $messages.insertAdjacentHTML('beforeend', html)

    console.log(message);
});

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    } else {
        $sendLocationButton.setAttribute('disabled', 'disabled');
        
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', {
                lat: position.coords.latitude, 
                long: position.coords.longitude
            }, () => {
                $sendLocationButton.removeAttribute('disabled');
                console.log("Location was shared!");
            });
        });
    }
});