/**
 * @title Process information
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @group System
 *
 * An example of how to access the current process ID and parent process ID.
 */

// The current process's process ID is available in the `Deno.pid` variable.
console.log(Deno.pid);

// The parent process ID is available in the Deno namespace too.
console.log(Deno.ppid);
