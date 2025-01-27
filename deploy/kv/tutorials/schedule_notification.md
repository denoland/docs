---
title: "Schedule a notification for a future date"
oldUrl:
  - /kv/tutorials/schedule_notification/
---

A common use case for [queues](../manual/queue_overview.md) is scheduling work
to be completed at some point in the future. To help demonstrate how this works,
we've provided a sample application (described below) that schedules
notification messages sent through the [Courier API](https://www.courier.com/).
The application runs on [Deno Deploy](https://deno.com/deploy), using the
built-in KV and queue API implementations available there with zero
configuration.

## Download and configure the sample

⬇️
[**Download or clone the complete sample app here**](https://github.com/kwhinnery/deno_courier_example).

You can run and deploy this sample application yourself using the instructions
in the GitHub repo's
[`README` file](https://github.com/kwhinnery/deno_courier_example).

To run the example app above, you'll also need to
[sign up for Courier](https://app.courier.com/signup). Of course the techniques
you'll see in the application would just as easily apply to any notification
service, from [Amazon SNS](https://aws.amazon.com/sns/) to
[Twilio](https://www.twilio.com), but Courier provides an easy-to-use
notification API that you can use with a personal GMail account for testing (in
addition to all the other neat things it can do).

## Key functionality

After setting up and running the project, we'd like to direct your attention to
a few key parts of the code that implement the scheduling mechanics.

### Connecting to KV and adding a listener on app start

Most of the example app's functionality lives in
[server.tsx](https://github.com/kwhinnery/deno_courier_example/blob/main/server.tsx)
in the top-level directory. When the Deno app process starts, it creates a
connection to a Deno KV instance and attaches an event handler which will
process messages as they are received from the queue.

```ts title="server.tsx"
// Create a Deno KV database reference
const kv = await Deno.openKv();

// Create a queue listener that will process enqueued messages
kv.listenQueue(async (message) => {
  /* ... implementation of listener here ... */
});
```

### Creating and scheduling a notification

After a new order is submitted through the form in this demo application, the
`enqueue` function is called with a delay of five seconds before a notification
email is sent out.

```ts title="server.tsx"
app.post("/order", async (c) => {
  const { email, order } = await c.req.parseBody();
  const n: Notification = {
    email: email as string,
    body: `Order received for: "${order as string}"`,
  };

  // Select a time in the future - for now, just wait 5 seconds
  const delay = 1000 * 5;

  // Enqueue the message for processing!
  kv.enqueue(n, { delay });

  // Redirect back home with a success message!
  setCookie(c, "flash_message", "Order created!");
  return c.redirect("/");
});
```

### Defining the notification data type in TypeScript

Often, it is desirable to work with strongly typed objects when pushing data
into or out of the queue. While queue messages are an
[`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
TypeScript type initially, we can use
[type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to
tell the compiler the shape of the data we expect.

Here's the source code for the
[notification module](https://github.com/kwhinnery/deno_courier_example/blob/main/notification.ts),
which we use to describe the properties of a notification in our system.

```ts title="notification.ts"
// Shape of a notification object
export default interface Notification {
  email: string;
  body: string;
}

// Type guard for a notification object
export function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.email !== undefined &&
      typeof (o as Notification).email === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}
```

In `server.tsx`, we use the exported type guard to ensure we are responding to
the right message types.

```ts title="server.tsx"
kv.listenQueue(async (message) => {
  // Use type guard to short circuit early if the message is of the wrong type
  if (!isNotification(message)) return;

  // Grab the relevant data from the message, which TypeScript now knows
  // is a Notification interface
  const { email, body } = message;

  // Create an email notification with Courier
  // ...
});
```

### Sending a Courier API request

To send an email as scheduled, we use the Courier REST API. More information
about the Courier REST API can be found in
[their reference docs](https://www.courier.com/docs/reference/send/message/).

```ts title="server.tsx"
const response = await fetch("https://api.courier.com/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${COURIER_API_TOKEN}`,
  },
  body: JSON.stringify({
    message: {
      to: { email },
      content: {
        title: "New order placed by Deno!",
        body: "notification body goes here",
      },
    },
  }),
});
```
