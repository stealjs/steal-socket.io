var io = require("steal-socket.io");
var QUnit = require("steal-qunit");
var wait = require("can-wait");

QUnit.module("basics");

QUnit.test("io is a function", function(){
	QUnit.equal(typeof io, "function", "io is a function");
});

QUnit.test("works with can-wait", function(){
	wait(function(){
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
