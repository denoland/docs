import Admonition from "./_admonition.mdx";

# Using Queues

<Admonition />

The Deno runtime includes a queueing API that supports offloading larger
workloads for async processing, with guaranteed at-least-once delivery of queued
messages. Queues can be used to offload compute-intensive tasks in a web
application, or to schedule units of work for a time in the future.

The primary APIs you'll use with queues are in the `Deno.KV` namespace as
[`enqueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.enqueue)
and
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue).

## Enqueue a message

To enqueue a message for processing, use the `enqueue` method on an instance of
[`Deno.Kv`](https://deno.land/api?unstable=true&s=Deno.Kv). In the example
below, we show what it might look like to enqueue a notification for delivery.

```ts title="queue_example.ts"
// Describe the shape of your message object (optional)
interface Notification {
  forUser: string;
  body: string;
}

// Get a reference to a KV instance
const kv = await Deno.openKv();

// Create a notification object
const message: Notification = {
  forUser: "alovelace",
  body: "You've got mail!",
};

// Enqueue the message for immediate delivery
await kv.enqueue(message);
```

You can enqueue a message for later delivery by specifying a `delay` option in
milliseconds.

```ts
// Enqueue the message for delivery in 3 days
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });
```

You can enqueue a message for later delivery by specifying a `delay` option in
milliseconds.

```ts
// Enqueue the message for delivery in 3 days
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });
```
