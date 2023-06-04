var WebSocket = require('ws');

module.exports = function (server, callback) {
  var wss = new WebSocket.Server({ server });

  wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');

    ws.on('message', function incoming(message) {
      console.log('Received message:', message);
      // Handle the received message here
    });

    ws.on('close', function close() {
      console.log('WebSocket client disconnected');
    });
  });

  callback(wss); // Call the callback function with the initialized WebSocket server
};
