const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
};

const generateLocationMessage = (url, {lat, long}) => {
    return {
        url: `${url}=${lat},${long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}