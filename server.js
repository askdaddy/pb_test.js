/**
 * Created by seven on 14/11/2017.
 */

var NetIo = require('./net.io-server').Server,
    server = new NetIo(2400);

// Listen for clients
server.on('connection', function (socket) {
    console.log('Client connected: ',socket.id);
    
    // Setup event listeners for the new client connection
    socket.on('message',Handler );
    
})

var Handler = function (data) {
    
}

var Closed = function (socket) {
    
}