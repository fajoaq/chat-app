const socket = io();

//ELEMENTS
const $joinForm = document.querySelector('#join-form');
//TEMPLATES
const roomSelectionTemplate = document.querySelector('#room-selection-template').innerHTML;
//ON CONNECTION
socket.on('joinForm', (roomList) => {
    console.log(roomList)
    //append selection template to form with data
    const html = Mustache.render(roomSelectionTemplate, { roomList });

    $joinForm.querySelector('#room-selection').innerHTML = html;
});
//ON SELECTION CHANGE
$joinForm.addEventListener('onchange', () => {
    const selection = $joinForm.querySelector('select').value;
});