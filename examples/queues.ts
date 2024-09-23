/**
 * @title Deno queues
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --unstable-kv <url>
 * @resource {https://docs.deno.com/deploy/kv/manual/queue_overview} Deno Queues user guide
 * @resource {https://docs.deno.com/api/deno/~/Deno.Kv} Deno Queues Runtime API docs
 * @group Unstable/Experimental APIs
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>Deno Queues, built on Deno KV, allow you to offload parts of your application
 * or schedule work for the future to run asynchronously. It's an easy way to add
 * scalable background processing to your project.
 */

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

// Enqueue the message for delivery in 3 days
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });

// Retrieve an unsent message by configuring a key
const backupKey = ["failed_notifications", "alovelace", Date.now()];
await kv.enqueue(message, { keysIfUndelivered: [backupKey] });
// ... disaster strikes ...
// Get the unsent message
const r = await kv.get<Notification>(backupKey);
console.log("Found failed notification for:", r.value?.forUser);

// Listen for and handle messages.
kv.listenQueue((msg: Notification) => {
  console.log(`Dear ${msg.forUser}: ${msg.body}`);
});
