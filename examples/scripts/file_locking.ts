/**
 * @title Lock files across processes
 * @difficulty beginner
 * @tags cli
 * @run -R -W --allow-run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.lock} Doc: Deno.FsFile.lock
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @group File System
 *
 * When two processes write the same file at the same time, the result is a
 * mess. File locks coordinate access: while one process holds an exclusive
 * lock, others that ask for it wait. This example holds a lock in the main
 * process and spawns a second Deno process that blocks until the lock is
 * released.
 */

// We work in a temporary directory with one shared file.
const dir = await Deno.makeTempDir();
const path = `${dir}/shared.txt`;
await Deno.writeTextFile(path, "shared state");

// This script runs in the second process. It opens the same file and asks
// for an exclusive lock. The lock(true) call does not fail when the file
// is already locked, it simply waits, so we measure how long it blocked.
const childScript = `
const file = await Deno.open(Deno.args[0], { read: true, write: true });
console.log("child:  requesting exclusive lock");
const start = Date.now();
await file.lock(true);
console.log("child:  lock acquired after " + (Date.now() - start) + " ms");
await file.unlock();
file.close();
`;
await Deno.writeTextFile(`${dir}/child.ts`, childScript);

// The main process takes the exclusive lock first. Passing true means
// exclusive (one holder); without it the lock is shared, which lets many
// readers coexist while still excluding writers.
const file = await Deno.open(path, { read: true, write: true });
await file.lock(true);
console.log("parent: holding exclusive lock");

// Now we start the child. It inherits stdout, so its messages appear
// interleaved with ours and tell the story in order.
const child = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-read", "--allow-write", `${dir}/child.ts`, path],
  stdout: "inherit",
  stderr: "inherit",
}).spawn();

// We hold the lock for two seconds. During this time the child starts up,
// prints its first message and then blocks inside lock(true).
await new Promise((resolve) => setTimeout(resolve, 2000));
console.log("parent: releasing lock");
await file.unlock();

// The moment we release, the child's lock call resolves and it finishes.
await child.status;

// To attempt a lock without blocking, use tryLock. It returns true when
// the lock was acquired and false when someone else holds it, which suits
// a skip-if-busy pattern better than waiting.
const again = await file.tryLock(true);
console.log("parent: tryLock after child released:", again); // true
if (again) {
  await file.unlock();
}
file.close();

// The whole run prints, with the wait time varying slightly:
// parent: holding exclusive lock
// child:  requesting exclusive lock
// parent: releasing lock
// child:  lock acquired after 1927 ms

// Locks are advisory: they only coordinate processes that ask for the
// lock, and they are released automatically when a process exits.
await Deno.remove(dir, { recursive: true });
