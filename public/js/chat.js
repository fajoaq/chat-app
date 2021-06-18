const socket = io();

//elements - $ convention
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//TEMPLATES
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//OPTIONS
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

//MESSAGE
socket.on('message', ({ text, createdAt }) => {
    const html = Mustache.render(messageTemplate, { 
        message: text,
        createdAt: moment(createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend', html)

    console.log(text, moment(createdAt).format('h:mm a'));
});
//LOCATION MESSAGE
socket.on('locationMessage', ({ url, createdAt }) => {
    const html = Mustache.render(locationTemplate, { 
        url, 
        createdAt: moment(createdAt).format('h:mm a') 
    });

    $messages.insertAdjacentHTML('beforeend', html);

    console.log(createdAt, url);
});

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

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href='/';  
    } 
});