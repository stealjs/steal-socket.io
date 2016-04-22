var io = require("socket.io-client/socket.io");
var ignore = require("./ignore");

// In the server socket.io-client/socket.io is mapped to @empty
// so we'll stub it as minimally as possible.
if(typeof io !== "function") {
	var noop = function(){};
	io = function(){
		return {
			on: noop,
			off: noop
		};
	};
} else {
	io = ignore(io);
}

module.exports = io;
