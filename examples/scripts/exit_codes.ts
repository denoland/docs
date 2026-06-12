/**
 * @title Set and read process exit codes
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.exitCode} Doc: Deno.exitCode
 * @resource {https://docs.deno.com/api/deno/~/Deno.exit} Doc: Deno.exit
 * @group System
 *
 * The exit code is how a program reports success or failure to the shell,
 * where zero means success and anything else means failure. Deno.exit(n)
 * stops the process immediately with code n. Deno.exitCode just records the
 * code, the program keeps running and exits with it naturally later, which
 * lets cleanup code and remaining work finish first.
 */
import process from "node:process";

// These listeners run when the program is about to exit naturally. The
// beforeunload event fires when the event loop runs out of work and can be
// cancelled to schedule more. The unload event fires last and cannot be
// cancelled. Note that Deno.exit skips beforeunload but still fires unload.
globalThis.addEventListener("beforeunload", () => {
  console.log("beforeunload: event loop is out of work"); // beforeunload: event loop is out of work
});
globalThis.addEventListener("unload", () => {
  console.log("unload: process is exiting"); // unload: process is exiting
});

// Record a failure without stopping the program. Something went wrong, but
// the lines below still run.
Deno.exitCode = 1;

// Reading the property back shows the code the process would exit with.
console.log(`exit code is now ${Deno.exitCode}`); // exit code is now 1

// Suppose a retry succeeded, so the failure is reset. This example sets the
// code back to zero so running it reports success. A real program would
// leave the failure code in place:
//
//   $ deno run fail.ts; echo $?
//   1
Deno.exitCode = 0;

// Code that uses the node:process module can set process.exitCode the
// same way.
process.exitCode = 0;

// The alternative is Deno.exit, which stops the process at once. Nothing
// after the call runs, so it is commented out here:
//
//   Deno.exit(1);
