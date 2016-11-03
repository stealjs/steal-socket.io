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
 * @returns {{on: function, emit: function, ...}}
 */
var delayedSocket = function(io){
	return ['on', 'off', 'once', 'emit'].reduce(function(acc, method){
		acc[method] = function(){
			if (realSocket){
				console.log('delay-io: realSocket ' + method);
				realSocket[method].apply(realSocket, arguments);
			} else {
				console.log('delay-io: fifo ' + method);
				fifo.push([method, arguments]);
			}
		};
		return acc;
	}, {});
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