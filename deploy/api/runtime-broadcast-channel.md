# BroadcastChannel

In Deno Deploy, code is run in different data centers around the world in order
to reduce latency by servicing requests at the data center nearest to the
client. In the browser, the BroadcastChannel API allows different tabs with the
same origin to exchange messages. In Deno Deploy, the BroadcastChannel API
provides a communication mechanism between the various instances; a simple
message bus that connects the various Deploy instances world wide.

- [Constructor](#constructor)
  - [Parameters](#parameters)
- [Properties](#properties)
- [Methods](#methods)
- [Example](#example)

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

## Example

A small example that has an endpoint to send a new message to all other actively
running instances in different regions and another to fetch all messages from an
instance.

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

const messages = [];
// Create a new broadcast channel named earth.
const channel = new BroadcastChannel("earth");
// Set onmessage event handler.
channel.onmessage = (event: MessageEvent) => {
  // Update the local state when other instances
  // send us a new message.
  messages.push(event.data);
};

function handler(req: Request): Response {
  const { pathname, searchParams } = new URL(req.url);

  // Handle /send?message=<message> endpoint.
  if (pathname.startsWith("/send")) {
    const message = searchParams.get("message");
    if (!message) {
      return new Response("?message not provided", { status: 400 });
    }

    // Update local state.
    messages.push(message);
    // Inform all other active instances of the deployment
    // about the new message.
    channel.postMessage(message);
    return new Response("message sent");
  }

  // Handle /messages request.
  if (pathname.startsWith("/messages")) {
    return new Response(JSON.stringify(messages), {
      "content-type": "application/json",
    });
  }

  return new Response("not found", { status: 404 });
}

serve(handler);
```

You can test this example by making an HTTP request to
`https://broadcast.deno.dev/send?message=Hello_from_<region>` and then making
another request to `https://broadcast.deno.dev/messages` from a different region
(by using a VPN or some other way) to check if the first request's message is
present in the second region.

We built [a small chat application](https://github.com/lucacasonato/deploy_chat)
that you can play with at https://denochat.deno.dev/

[eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
