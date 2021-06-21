const socket = io();

//ELEMENTS
const $joinForm = document.querySelector('#join-form');
const $roomInput = $joinForm.querySelector('input[name="room"]');
let $selection;
//TEMPLATES
const roomSelectionTemplate = document.querySelector('#room-selection-template').innerHTML;
//ON CONNECTION
socket.on('joinForm', (roomList) => {
    //append selection template to form with data
    const html = Mustache.render(roomSelectionTemplate, { roomList });

    $joinForm.querySelector('#room-selection').innerHTML = html;
    
    //ON SELECTION CHANGE
    $selection = document.querySelector('#open-rooms-dropdown');
    $selection.onchange = ({ target }) => $roomInput.value = target.value;
});