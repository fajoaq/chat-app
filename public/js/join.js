const socket = io();

//ELEMENTS
const $joinForm = document.querySelector('#join-form');
const $roomInput = $joinForm.querySelector('input[name="room"]');
const $selection = document.querySelector('#open-rooms-dropdown');;
//TEMPLATES
const roomSelectionTemplate = document.querySelector('#room-selection-template').innerHTML;
//ON CONNECTION
socket.on('joinForm', (roomList) => {
    //append selection template to form with data
    const html = Mustache.render(roomSelectionTemplate, { roomList });

    $selection.innerHTML = html;
    
    //ON SELECTION CHANGE
    $selection.onchange = ({ target }) => $roomInput.value = target.value;
});