/**
 * @title Connect to Redis
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net --allow-env <url>
 * @resource {https://deno.land/x/r2d2} r2d2 on deno.land/x
 * @resource {https://redis.io/docs/getting-started/} Getting started with Redis
 * @group Databases
 * 
 * Using the r2d2 module, you can connect to a Redis database running anywhere.
 */

// Import the `sendCommand()` function from r2d2
import { sendCommand } from "https://deno.land/x/r2d2/mod.ts";

// Create a TCP connection with the Redis server
const redisConn = await Deno.connect({ port: 6379 });

// Authenticate with the server by sending the command "AUTH <username> <password>"
await sendCommand(redisConn, [
  "AUTH",
  Deno.env.get("REDIS_USERNAME")!,
  Deno.env.get("REDIS_PASSWORD")!,
]);

// Set the "hello" key to have value "world" using the command "SET hello world"
await sendCommand(redisConn, ["SET", "hello", "world"]); // "OK"

// Get the "hello" key using the command "GET hello"
await sendCommand(redisConn, ["GET", "hello"]); // "world"

// Close the connection to the database
redisConn.close();
