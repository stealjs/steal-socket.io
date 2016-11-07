@module steal-socket
@parent StealJS.ecosystem
@group steal-socket.examples

@type {Function}

@description Wrap socket.io for SSR and testing.

The `steal-socket` module exports a function that wraps `socket.io` to serve the following purposes:

 * Ignore `socket.io` for [server-side rendering](https://donejs.com/Features.html#section_Server_SideRendered) (SSR).
 * Ignore `socket.io` for [can-zone](http://v3.canjs.com/doc/can-zone.html).
 * Delay establishing `socket.io` connection for testing.

@signature `stealSocket( url, [options] )`

Since this is a wrapper around SocketIO `io` function it supports all the same arguments as [socket.io does](http://socket.io/docs/client-api/#client-api).
```
var io = require("steal-socket.io");
var socket = io("localhost", {transports: ["websocket"]});
```

@body

## Ignore SSR

If your application uses real-time communication with `socket.io` and your server supports SSR then its a good idea
to ignore `socket.io` module during SSR completely.

The `steal-socket` module maps `socket.io-client/socket.io` to an `@empty` module, and stubs `socket.io` as minimally
as possible.

## Ignore `can-zone`

This wrapper is aware of [can-zone](https://github.com/canjs/can-zone) module which helps to track asynchronous
activity. It uses `can-zone.ignore` to skip the tracking of `socket.io` calls. For more information about what
`can-zone` is checkout [this article](https://davidwalsh.name/can-zone) as well as
the [documentation](http://v3.canjs.com/doc/can-zone.html).

## Delay connection

This wrapper helps with testing and demoing applications that use `socket.io` for real-time communication.

Often some modules that use socket.io call it to establish a socket connection immediately. This makes mocking of socket.io impossible.

The wrapper delays the creation of socket connection till StealJS is done loading all the modules (including ones where we can mock socket.io).

