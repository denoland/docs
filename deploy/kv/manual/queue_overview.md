---
title: "Using Queues"
---

<deno-admonition></deno-admonition>

The Deno runtime includes a queueing API that supports offloading larger
workloads for async processing, with guaranteed at-least-once delivery of queued
messages. Queues can be used to offload tasks in a web application, or to
schedule units of work for a time in the future.

The primary APIs you'll use with queues are in the `Deno.Kv` namespace as
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

## Listening for messages

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

// Register a handler function to listen for values - this example shows
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

## Queue API with KV atomic transactions

You can combine the queue API with [KV atomic transactions](./transactions.mdx)
to atomically enqueue messages and modify keys in the same transaction.

```ts title="kv_transaction_example.ts"
const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  const nonce = await kv.get(["nonces", msg.nonce]);
  if (nonce.value === null) {
    // This messaged was already processed
    return;
  }

  const change = msg.change;
  const bob = await kv.get(["balance", "bob"]);
  const liz = await kv.get(["balance", "liz"]);

  const success = await kv.atomic()
    // Ensure this message was not yet processed
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n)
    .check(bob, liz) // balances did not change
    .set(["balance", "bob"], bob.value - change)
    .set(["balance", "liz"], liz.value + change)
    .commit();
});

// Modify keys and enqueue messages in the same KV transaction!
const nonce = crypto.randomUUID();
await kv
  .atomic()
  .check({ key: ["nonces", nonce], versionstamp: null })
  .enqueue({ nonce: nonce, change: 10 })
  .set(["nonces", nonce], true)
  .sum(["enqueued_count"], 1n)
  .commit();
```

## Queue behavior

### Message delivery guarantees

The runtime guarantees at-least-once delivery. This means that for majority of
enqueued messages, the
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
handler will be invoked once for each message. In some failure scenarios, the
handler may be invoked multiple times for the same message to ensure delivery.
It's important to design your applications such that duplicate messages are
handled correctly.

You may use queues in combination with
[KV atomic transactions](https://docs.deno.com/deploy/kv/manual/transactions)
primitives to ensure that your queue handler KV updates are performed exactly
once per message. See
[Queue API with KV atomic transactions](#queue-api-with-kv-atomic-transactions).

### Automatic retries

[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
handler is invoked to process your queued messages when they're ready for
delivery. If your handler throws an exception the runtime will automatically
retry to call the handler again until it succeeds or until maximum retry
attempts are reached. The message is considered to be succesfully processed once
the
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
handler invocation completes succesfully. The message will be dropped if the
handler consistently fails on retries.

### Message delivery order

The runtime makes best effort to deliver messages in the order they were
enqueued. However, there is not strict order guarantee. Occasionally, messages
may be delivered out of order to ensure maximum throughput.

## Queues on Deno Deploy

Deno Deploy offers global, serverless, distributed implementation of the
queueing API, designed for high availability and throughput. You can use it to
build applications that scale to handle large workloads.

### Just-in-time isolate spin-up

When using queues with Deno Deploy, isolates are automatically spun up on demand
to invoke your
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
handler when a message becomes available for processing. Defining
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
handler is the only requirement to enable queue processing in your Deno Deploy
application, no additional configuration is needed.

### Queue size limit

The maximum number of undelivered queue messages is limited to 100,000.
[`enqueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.enqueue)
method will fail with an error if the queue is full.

### Pricing details and limits

- [`enqueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.enqueue)
  is treated just like other
  [`Deno.Kv`](https://deno.land/api?unstable=true&s=Deno.Kv) write operations.
  Enqueued messages consume KV storage and write units.
- Messages delivered through
  [`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
  consume requests and KV write units.
- See [Pricing details](https://deno.com/deploy/pricing) for more information.

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
