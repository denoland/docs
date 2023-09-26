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

You can also specify a key in Deno KV where your message value will be stored if
your message isn't delivered for any reason.

```ts
// Configure a key where a failed message would be sent
const backupKey = ["failed_notifications", "alovelace", Date.now()];
await kv.enqueue(message, { keysIfUndelivered: [backupKey] });

// ... disaster strikes ...

// Get the unsent message
const r = await kv.get<Notification>(backupKey);
// This is the message that didn't get sent:
console.log("Found failed notification for:", r.value?.forUser);
```

## Dequeueing messages

You can configure a JavaScript function that will process items added to your
queue with the `listenQueue` method on an instance of
[`Deno.Kv`](https://deno.land/api?unstable=true&s=Deno.Kv).

```ts title="listen_example.ts"
// Define the shape of the object we expect as a message in the queue
interface Notification {
  forUser: string;
  body: string;
}

// Create a type guard to check the type of the incoming message
function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.forUser !== undefined &&
      typeof (o as Notification).forUser === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}

// Get a reference to a KV database
const kv = await Deno.openKv();

// Register a handler function for dequeued values - this example shows
// how you might send a notification
kv.listenQueue((msg: unknown) => {
  // Use type guard - then TypeScript compiler knows msg is a Notification
  if (isNotification(msg)) {
    console.log("Sending notification to user:", msg.forUser);
    // ... do something to actually send the notification!
  } else {
    // If the message is of an unknown type, it might be an error
    console.error("Unknown message received:", msg);
  }
});
```

## Queue behavior

TODO @igor - could we say a few words about:

- any relevant behavior or limitations of queues (like max queue size)
- a bit about how queues work differently on Deploy versus CLI/local
- Any gotchas or limitations users should be aware of

## Use cases

Queues can be useful in many different scenarios, but there are a few use cases
you might see a lot when building web applications.

### Offloading async processes

Sometimes a task that's initiated by a client (like sending a notification or
API request), may take long enough where you don't want to make clients wait for
that task to be completed before returning a response. Other times, clients
don't actually need a response at all, such as when a client is sending your
application a [webhook request](https://en.wikipedia.org/wiki/Webhook), so
there's no need to wait for the underlying task to be completed before returning
a response.

In these cases, you can offload work to a queue to keep your web application
responsive and send immediate feedback to clients. To see an example of this use
case in action, check out our
[webhook processing example](../tutorials/webhook_processor.md).

### Scheduling work for the future

Another helpful application of queues (and queue APIs like this one), is to
schedule work to happen at an appropriate time in the future. Maybe you'd like
to send a notification to a new customer a day after they have placed an order
to send them a satisfaction survey. You can schedule a queue message to be
delivered 24 hours into the future, and set up a listener to send out the
notification at that time.

To see an example of scheduling a notification to go out in the future, check
out our [notification example](../tutorials/schedule_notification.md).
