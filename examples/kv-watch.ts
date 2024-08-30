/**
 * @title Deno KV Watch
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --unstable-kv <url>
 * @resource {https://docs.deno.com/deploy/kv/manual} Deno KV user guide
 * @resource {https://docs.deno.com/api/deno/~/Deno.Kv} Deno KV Runtime API docs
 * @group Databases
 *
 * Deno KV watch allows you to detect changes to your KV database, making
 * it easier to build real-time applications, newsfeeds, chat, and more.
 */

// Open the default database
const kv = await Deno.openKv();

// Set "counter" value to 0, then increment every second.
await kv.set(["counter"], new Deno.KvU64(0n));
setInterval(() => {
  kv.atomic().sum(["counter"], 1n).commit();
}, 1000);

// Listen for changes to "counter" and log value.
for await (const [entry] of kv.watch([["counter"]])) {
  console.log(`Counter: ${entry.value}`);
}

// You can also create a stream reader from kv.watch, which returns
// a ReadableStream.
const stream = kv.watch([["counter"]]).getReader();
while (true) {
  const counter = await stream.read();
  if (counter.done) {
    break;
  }
  console.log(`Counter: ${counter.value[0].value}`);
}

// To use server-sent events, let's create a server that
// responds with a stream. Each time a change to "counter"
// is detected, send the updated value to the client.
Deno.serve((_req) => {
  const stream = kv.watch([["counter"]]).getReader();
  const body = new ReadableStream({
    async start(controller) {
      while (true) {
        if ((await stream.read()).done) {
          return;
        }
        const data = await kv.get(["counter"]);
        controller.enqueue(
          new TextEncoder().encode(`Counter: ${data.value}\n`),
        );
      }
    },
    cancel() {
      stream.cancel();
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
});
