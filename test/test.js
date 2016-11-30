var io = require("steal-socket.io");
var QUnit = require("steal-qunit");
var Zone = require("can-zone");
var myModel = require("./test-model");
var socketList = require("../delay-io").sockets;

// Mock socket.io server to test socket events:
var socketIO = require("socket.io-client");
// var fixtureSocket = require("can-fixture-socket");
// var mockedServer = new fixtureSocket.Server( socketIO );
// mockedServer.on("message create", function(){
// 	mockedServer.emit("message created", {id: 123});
// });

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

QUnit.test("reuses existing sockets", function(assert){
	var done = assert.async();
	var socket1 = io('');
	// var sio1 = socketIO('');

	var socket2 = io('http://localhost:8888');
	// var sio2 = socketIO('http://localhost:8888');
	// assert.equal(socket1 === socket2, false, 'Got a new socket for a distinct URL.');

	// var socket3 = io('');
	// var sio3 = socketIO('');
	// assert.equal(socket1 === socket3, true, 'Got the same socket back for an existing URL.');
	setTimeout(function(){
		console.log(socket1);
		debugger;
		done();
	}, 1000);
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
