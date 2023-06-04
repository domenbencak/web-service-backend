// websocket-client.js
var socket = new WebSocket('ws://localhost:3000');  // Replace with your server URL

socket.onopen = function() {
  console.log('WebSocket connection established');
};

socket.onmessage = function(event) {
  var message = event.data;
  console.log('Received message:', message);
  // Handle the received message here
};

socket.onclose = function() {
  console.log('WebSocket connection closed');
};

// Optional: Send a message to the server
// socket.send('Hello, server!');