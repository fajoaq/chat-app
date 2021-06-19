const users = [];

//ADD USER
const addUser = ({ id, username, room }) => {
    //clean, validate
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room) return { error: "Username and room are required." }

    const existingUser = users.find((user) =>  user.room === room && user.username === username);

    if(existingUser) return { error: "Username is in use!" }

    // store user
    const user = { id, username, room };

    users.push(user);
    return { user }
}
//REMOVE USER
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};
//GET USER
const getUser = (id) => {
    return users.find((user) => user.id === id)
};
//GET USERS IN ROOM
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.toLowerCase());
};
//GET ROOMS
const getRooms = () => {
    let rooms = new Set();

    users.forEach((user) => rooms.add({ room: user.room }));

    return Array.from(rooms);
};
//GET USERS
const getUsers = () => users;

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom,
    getRooms,
    getUsers
}