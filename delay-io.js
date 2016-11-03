var DEBUG;

/**
 * `fifoSockets` contains FIFO and a placeholder for `realSocket` per URL.
 * A FIFO is a storage for calls to io.Socket to be replayed when steal is done and we can  create a real socket.
 * The first element will be io and its arguments so that we could create a real socket later.
 * ```
 *   var socket = io('localhost');
 *   socket.on('messages', function(){...})
 *   socket.emit('hello', {});
 * ```
 * @type {Object}
 */

/**
 * Delayed socket - a proxy for socket method calls, so that we can record early calls to `fifo` and replay them after.
 * @param io
 * @returns {{on: function, emit: function, ...}}
 */
var delayedSocket = function(fifoSocket){
	return ['on', 'off', 'once', 'emit'].reduce(function(acc, method){
		acc[method] = function(){
			var realSocket = fifoSocket.realSocket;
			var fifo = fifoSocket.fifo;
			var url = fifoSocket.url;
			if (realSocket){
				debug('delay-io("' + url + '"): realSocket ' + method);
				realSocket[method].apply(realSocket, arguments);
			} else {
				debug('delay-io("' + url + '"): record ' + method + '("' + arguments[0] + '", ...)');
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
function replay(fifoSockets){
	return function(){
		debug('+++++ delay-io: replay!');
		Object.keys(fifoSockets).forEach(function(url){
			replayFifoSocket(fifoSockets[url]);
		});
	}
}

function replayFifoSocket(fifoSocket){
	var	url = fifoSocket.url,
		fifo = fifoSocket.fifo,
		first = fifo.shift(),
		io = first[0],
		args = first[1],
		realSocket = fifoSocket.realSocket = io.apply(this, args);

	fifo.forEach(function(pair){
		var method = pair[0],
			args = pair[1];
		debug('delay-io("' + url + '"): replay ' + method + '("' + args[0] + '", ...)');
		realSocket[method].apply(realSocket, args);
	});
}

function debug(msg){
	if (DEBUG){
		console.log(msg);
	}
}

module.exports = function(io){
	var fifoSockets = {};

	// TODO: pass as an option.
	DEBUG = true;

	steal.done().then(replay(fifoSockets));

	return function(){
		var url = arguments[0];
		var fifoSocket = fifoSockets[url] = {
			url: url,
			realSocket: null,
			fifo: [[io, arguments]]
		};

		return delayedSocket(fifoSocket);
	};
};