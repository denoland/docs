/**
 * @title Watching the filesystem
 * @difficulty beginner
 * @tags cli
 * @run --allow-read <url>
 * @resource {https://deno.land/api?s=Deno.watchFs} Doc: Deno.watchFs
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of} MDN: for await of
 * @resource {$std/async/debounce.ts} Doc: std/debounce
 * @group File System
 *
 * When creating frameworks or CLI tools, it is often necessary to watch the filesystem for changes.
 */
// The easiest way to watch a filesystem is to use the Deno builtin watchFs.
// Deno.watchFs returns an FsWatcher which is an async iterable.
let watcher = Deno.watchFs("./");

// The easiest way to interact with async iterables is the javascript for await of syntax.
for await (const event of watcher) {
  console.log(">>>> event", event);

  // To stop the watcher we can simply call `watcher.close()`
  watcher.close();
}

// In real applications, it is quite rare that an application needs to react
// to every change instantly. Events will be duplicated and multiple events will
// be dispatched for the same changes. To get around this, we can "debounce" our
// functions.
import { debounce } from "jsr:@std/async/debounce";

// In this specific case, we use the standard library to do the work for us.
// This function will run at most once every two hundred milliseconds
const log = debounce((event: Deno.FsEvent) => {
  console.log("[%s] %s", event.kind, event.paths[0]);
}, 200);

watcher = Deno.watchFs("./");

for await (const event of watcher) {
  log(event);
}
