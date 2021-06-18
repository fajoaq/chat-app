const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
};

const generateLocationMessage = (username ,url, {lat, long}) => {
    return {
        username,
        url: `${url}=${lat},${long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}