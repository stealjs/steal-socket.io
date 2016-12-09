var io = require("steal-socket.io");
var QUnit = require("steal-qunit");
var Zone = require("can-zone");
var myModel = require("./test-model");
//var socketList = require("../delay-io").sockets;

// Mock socket.io server to test socket events:
var sio = require("socket.io-client/dist/socket.io");
var fixtureSocket = require("can-fixture-socket");
var mockedServer = new fixtureSocket.Server( sio );
mockedServer.on("message create", function(){
	mockedServer.emit("message created", {id: 123});
});

QUnit.module("basics");

QUnit.test("io is a function", function(){
	QUnit.equal(typeof io, "function", "io is a function");
});

QUnit.test("works with can-zone", function(){
	new Zone().run(function(){
		setTimeout(function(){
			var socket = io("http://chat.donejs.com");

			QUnit.equal(typeof socket, "object", "got our socket back");
		});
	}).then(function(){
		QUnit.ok("it completed");
	})
	.then(QUnit.start);

	QUnit.stop();
});

QUnit.test("multiple Steal sockets use the same fifoSocket object", function(assert){
	var stealSocket1 = io('', {
		transports: ['websocket']
	});
	var stealSocket2 = io('', {
		transports: ['websocket']
	});

	assert.equal(stealSocket1.fifoSocket, stealSocket2.fifoSocket, 'fifoSockets are the same object');
});

QUnit.test("each socket's properties match a real socket", function(assert){
	//var socketioSocket = sio('', {
	//	transports: ['websocket']
	//});
	var stealSocket = io('', {
		transports: ['websocket']
	});

	//assert.equal(typeof socketioSocket.connected, 'boolean', 'the socket.io-client socket has a `connected` property.');
	assert.equal(typeof stealSocket.connected, 'boolean', 'the steal-socket.io socket has a `connected` property.');

	//assert.equal(typeof socketioSocket.disconnected, 'boolean', 'the socket.io-client socket has a `disconnected` property.');
	assert.equal(typeof stealSocket.disconnected, 'boolean', 'the steal-socket.io socket has a `disconnected` property.');

	stealSocket.fifoSocket.realSocket = {connected: false};
	assert.equal(stealSocket.connected, false, 'the stealSocket.connected property was correctly proxied to the realSocket.');
	stealSocket.fifoSocket.realSocket = {connected: true};
	assert.equal(stealSocket.connected, true, 'the stealSocket.connected property was correctly proxied to the realSocket.');
});

QUnit.test("Support calling socket.disconnect()", function (assert) {
	//TODO: if we call `io('')` then this tests conflicts with the previous one.
	var stealSocket = io('test', {
		transports: ['websocket']
	});
	assert.equal(typeof stealSocket.disconnect, 'function', 'Steal sockets have a disconnect function.');

	stealSocket.disconnect();
	assert.equal(stealSocket.connected, false, 'socket.connected was false after disconnect().');
	assert.equal(stealSocket.disconnected, true, 'socket.disconnected was true after disconnect().');
});

QUnit.test("delay-io: test a module with early socket connection ", function(assert){
	var done = assert.async();
	myModel.then(function(data){
		assert.deepEqual(data, {id: 123}, "should receive data from socket server");
		done();
	});
});

QUnit.test("emulates uri location", function(){
	var url = 'http://localhost:3030';
	var socket = io(url);
	QUnit.equal(socket.io.uri, url, "exposes the url at the same location as the Socket.io Manager class");
});
