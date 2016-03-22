var io = require("socket.io-client/socket.io");
var Zone = require("can-zone");

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
	io = Zone.ignore(io);
}

module.exports = io;
