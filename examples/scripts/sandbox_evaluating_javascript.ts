/**
 * @title Evaluating JavaScript
 * @difficulty beginner
 * @tags sandbox
 * @run -A <url>
 * @resource {https://docs.deno.com/sandbox/} Deno Deploy Sandbox
 * @group Deno Deploy
 *
 * You can evaluate JavaScript code in a sandbox using the `eval` function.
 *
 * Calling `sandbox.deno.eval()` lets you run arbitrary JavaScript snippets
 * directly inside the sandbox’s Deno runtime without writing files or shelling * out. This is useful when you want to prototype logic, run small
 * computations, or  inspect the sandbox environment itself quickly. Use it for
 * dynamic scripts or exploratory debugging where creating a full module would
 * be overkill.
 */

// Import the Deno Sandbox SDK
import { Sandbox } from "jsr:@deno/sandbox";
// Create a sandbox
await using sandbox = await Sandbox.create();
// Run JS in the sandbox with eval
const result = await sandbox.deno.eval(`
  const a = 1;
  const b = 2;
  a + b;
  `);
console.log("result:", result);
