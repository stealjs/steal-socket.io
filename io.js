/*
 * @function steal-socket.ignore-ssr ignore-ssr
 * @parent steal-socket
 * @type {Function}
 * @hide
 *
 * @description Wrap `socket-io` to be ignored during `SSR`
 *
 * @body
 *
 * This wrapper serves a purpose of ignoring socket-io during server-side rendereing (SSR). When usign [StealJS](http://stealjs.com/) as
 * a module loader this module maps `socket.io-client/socket.io` to an `@empty` module, and stubs `socket.io` as
 * minimally as possible.
 */

var io = require("socket.io-client/socket.io");
var ignore = require("./ignore-zone");
var delayIO = require("./delay-io");

// In the server socket.io-client/socket.io is mapped to @empty
// so we'll stub it as minimally as possible.
if(typeof io !== "function") {
	var noop = function(){};
	io = function(){
		return {
			on: noop,
			once: noop,
			off: noop
		};
	};
} else {
	io = ignore( delayIO( io ) );
}

module.exports = io;
