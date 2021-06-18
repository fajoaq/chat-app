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
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;

//OPTIONS
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    //New message el
    const $newMessage = $messages.lastElementChild
    //Get height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = $messages.offsetHeight;
    // Height of messages container
    const containerHeight = $messages.scrollHeight;
    //How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

//MESSAGE
socket.on('message', ({username, text, createdAt }) => {
    const html = Mustache.render(messageTemplate, {
        username, 
        message: text,
        createdAt: moment(createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();

    console.log(text, moment(createdAt).format('h:mm a'));
});
//LOCATION MESSAGE
socket.on('locationMessage', ({username, url, createdAt }) => {
    const html = Mustache.render(locationTemplate, {
        username, 
        url, 
        createdAt: moment(createdAt).format('h:mm a') 
    });

    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();

    console.log(createdAt, url);
});
//ROOM DATA
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sideBarTemplate, { room, users });

    document.querySelector('#sidebar').innerHTML = html;
})
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
//JOIN
socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href='/';  
    } 
});