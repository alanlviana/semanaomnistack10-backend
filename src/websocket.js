const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');
const connections = [];


let io;
exports.setupWebSocket = (server) => {
    io = socketio(server);
    io.on('connection', socket => {
        console.log(socket.handshake.query);

        const {latitude, longitude, techs} = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates:{
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs.toLowerCase())
        });

    });


};

exports.findConnections = (coordinates, techs) => {
    console.log(connections);
    return connections.filter(connection => {
        const distance = calculateDistance(coordinates, connection.coordinates);
        console.log(distance);

        return distance < 20
            && connection.techs.some(item => techs.includes(item));
    })
}

exports.sendMessage = (to, message, data) =>{
    to.forEach(connection => {
        console.log(`emit to ${connection.id} with message '${message}' and data '${data}'`);
        io.to(connection.id).emit(message,data);
    });
}