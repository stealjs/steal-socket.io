/**
 * FIFO for calls to io.Socket to be replayed when steal is done and we can  create a real socket.
 * The first element will be io and its arguments so that we could create a real socket later.
 * ```
 *   var socket = io('localhost');
 *   socket.on('messages', function(){...})
 *   socket.emit('hello', {});
 * ```
 * @type {Array}
 */
// TODO: have a fifo and a realSocket per URL. E.g. io('localhost'), io('http://chat.com'), etc.
var fifo = [];
var realSocket;

/**
 * A proxy for socket method calls, so that we could record early calls to `fifo` and replay them after.
 * @param io
 * @returns {{on: on, emit: emit}}
 */
var delayedSocket = function(io){
	return {
		// TODO: all methods are treated the same way, so do some meta programming here.
		on: function(){
			if (realSocket){
				console.log('delay-io: realSocket on');
				realSocket.on.apply(realSocket, arguments);
			} else {
				console.log('delay-io: fifo on');
				fifo.push(['on', arguments]);
			}
		},
		emit: function(){
			if (realSocket){
				console.log('delay-io: realSocket emit');
				realSocket.emit.apply(realSocket, arguments);
			} else {
				console.log('delay-io: fifo emit');
				fifo.push(['emit', arguments]);
			}
		}
	}
};

/**
 * Replays calls that were recorded to `fifo`.
 * @param fifo
 * @returns {Function}
 */
function replay(fifo){
	return function(){
		console.log('+++++ delay-io: relpay!');
		var first = fifo.shift();
		var io = first[0];
		var args = first[1];

		realSocket = io.apply(this, args);

		fifo.forEach(function(pair){
			var method = pair[0],
				args = pair[1];
			console.log('delay-io: replay ' + method);
			realSocket[method].apply(realSocket, args);
		});
	}
}

module.exports = function(io){
	steal.done().then(replay(fifo));

	return function(){
		fifo.push([io, arguments]);

		return delayedSocket(io);
	};
};