/**
 * @title Process Information
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @group System
 */

// The current process's process ID is available in the `Deno.pid` variable.
console.log(Deno.pid);

// The parent process ID is available in the Deno namespace too.
console.log(Deno.ppid);
