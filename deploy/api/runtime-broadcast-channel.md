---
title: "BroadcastChannel"
---

In Deno Deploy, code is run in different data centers around the world in order
to reduce latency by servicing requests at the data center nearest to the
client. In the browser, the
[`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
API allows different tabs with the same origin to exchange messages. In Deno
Deploy, the BroadcastChannel API provides a communication mechanism between the
various instances; a simple message bus that connects the various Deploy
instances worldwide.

## Constructor

The `BroadcastChannel()` constructor creates a new `BroadcastChannel` instance
and connects to (or creates) the provided channel.

```ts
let channel = new BroadcastChannel(channelName);
```

#### Parameters

| name        | type     | description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| channelName | `string` | The name for the underlying broadcast channel connection. |

The return type of the constructor is a `BroadcastChannel` instance.

## Properties

| name             | type                   | description                                                                                                  |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `name`           | `string`               | The name of the underlying broadcast channel.                                                                |
| `onmessage`      | `function` (or `null`) | The function that's executed when the channel receives a new message ([`MessageEvent`][messageevent]).       |
| `onmessageerror` | `function` (or `null`) | The function that's executed when the arrived message cannot be deserialized to a JavaScript data structure. |

## Methods

| name                   | description                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `close()`              | Close the connection to the underlying channel. After closing, you can no longer post messages to the channel.                     |
| `postMessage(message)` | Post a message to the underlying channel. The message can be a string, object literal, a number or any kind of [`Object`][object]. |

`BroadcastChannel` extends [`EventTarget`][eventtarget], which allows you to use
methods of `EventTarget` like `addEventListener` and `removeEventListener` on an
instance of `BroadcastChannel`.

## Example: Update an in-memory cache across instances

One use case for a message bus like the one enabled by `BroadcastChannel` is
updating an in-memory cache of data between isolates running in different data
centers across the network. In the example below, we show how you can configure
a simple server that uses `BroadcastChannel` to synchornize state across all
running instances of the server.

```ts
import { Hono } from "https://deno.land/x/hono/mod.ts";

// in-memory cache of messages
const messages = [];

// A BroadcastChannel used by all isolates
const channel = new BroadcastChannel("all_messages");

// When a new message comes in from other instances, add it
channel.onmessage = (event: MessageEvent) => {
  messages.push(event.data);
};

// Create a server to add and retrieve messages
const app = new Hono();

// Add a message to the list
app.get("/send", (c) => {
  // New messages can be added by including a "message" query param
  const message = c.req.query("message");
  if (message) {
    messages.push(message);
    channel.postMessage(message);
  }
  return c.redirect("/");
});

// Get a list of messages
app.get("/", (c) => {
  // Return the current list of messages
  return c.json(messages);
});

Deno.serve(app.fetch);
```

You can test this example yourself on Deno Deploy using
[this playground](https://dash.deno.com/playground/broadcast-channel-example).

[eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
