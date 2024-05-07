/**
 * @title Use Node.js built-in modules
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-env <url>
 * @resource {https://docs.deno.com/runtime/manual/node} Node.js / npm support in Deno
 * @resource {https://docs.deno.com/runtime/manual/node/node_specifiers} node: specifiers
 * @group Basics
 *
 * Deno supports most built-in Node.js modules natively - you can include them
 * in your code using "node:" specifiers in your imports.
 */

// Import the os module from core Node to get operating system info
import os from "node:os";

// Use the module as you would in Node.js
console.log("Current architecture is:", os.arch());
console.log("Home directory is:", os.homedir());
