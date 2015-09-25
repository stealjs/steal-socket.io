var io = require("steal-socket.io");
var QUnit = require("steal-qunit");

QUnit.module("basics");

QUnit.test("io is a function", function(){
	QUnit.equal(typeof io, "function", "io is a function");
});
