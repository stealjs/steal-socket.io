var io = require("steal-socket.io");
steal.done().then(function(){
	console.log('my-model steal DONE.');
});

console.log('test-model loaded, calling io() ');
var socket = io('localhost/my-model');
socket.on("connect", function(){
	console.log('test-model on connect');
	socket.emit("messages create", {text: "A new message"});
});
socket.on("message created", function(data){
	console.log('test-model on message created');
	// data.text === "A new message"
	console.log("Server sent out a new message we just created", data);
});

module.export = {
	myIo: io,
	mySocket: socket
};