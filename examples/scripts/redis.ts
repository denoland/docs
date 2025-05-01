/**
 * @title Connect to Redis
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://jsr.io/@iuioiua/redis} redis on jsr.io
 * @resource {https://redis.io/docs/getting-started/} Getting started with Redis
 * @group Databases
 *
 * Using the jsr:@iuioiua/redis module, you can connect to a Redis database running anywhere.
 */

// Import the `RedisClient` from jsr:@iuioiua/redis
import { RedisClient } from "jsr:@iuioiua/redis";

// Create a TCP connection with the Redis server
using redisConn = await Deno.connect({ port: 6379 });

// Create an instance of 'RedisClient'
const redisClient = new RedisClient(redisConn);

// Authenticate with the server by sending the command "AUTH <username> <password>"
await redisClient.sendCommand([
  "AUTH",
  Deno.env.get("REDIS_USERNAME")!,
  Deno.env.get("REDIS_PASSWORD")!,
]);

// Set the "hello" key to have value "world" using the command "SET hello world"
await redisClient.sendCommand(["SET", "hello", "world"]); // "OK"

// Get the "hello" key using the command "GET hello"
await redisClient.sendCommand(["GET", "hello"]); // "world"
