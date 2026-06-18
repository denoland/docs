/**
 * @title Redis quick start
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://github.com/redis/node-redis} node-redis on GitHub
 * @resource {https://redis.io/docs/getting-started/} Getting started with Redis
 * @resource {https://docs.deno.com/examples/redis_tutorial/} Tutorial: Build a caching layer with Redis
 * @group Databases
 *
 * Using the npm:redis module (node-redis), you can connect to a Redis database running anywhere.
 */

// Import `createClient` from the npm:redis module
import { createClient } from "npm:redis@^4.5";

// Create a client, pointing it at your Redis server. The host and port below
// default to a local instance; change them to connect to a remote server.
const client = createClient({
  socket: {
    host: Deno.env.get("REDIS_HOSTNAME") ?? "127.0.0.1",
    port: 6379,
  },
  // To connect to a password-protected server, also set credentials here:
  // username: Deno.env.get("REDIS_USERNAME"),
  // password: Deno.env.get("REDIS_PASSWORD"),
});

// Open the connection before sending any commands
await client.connect();

// Set the "hello" key to the value "world"
await client.set("hello", "world"); // "OK"

// Get the value stored at the "hello" key
await client.get("hello"); // "world"

// For commands without a dedicated method (such as RedisJSON's JSON.SET), use
// `sendCommand` with each argument as a separate array element:
await client.sendCommand(["JSON.SET", "user", "$", '{"name":"Lin"}']);

// Close the connection when you're done
await client.quit();
