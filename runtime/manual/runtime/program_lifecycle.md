# Program Lifecycle

Deno supports browser compatible lifecycle events:

- [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#:~:text=The%20load%20event%20is%20fired,for%20resources%20to%20finish%20loading.):
  fired when the whole page has loaded, including all dependent resources such
  as stylesheets and images.
- [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#:~:text=The%20beforeunload%20event%20is%20fired,want%20to%20leave%20the%20page.):
  fired when the event loop has no more work to do and is about to exit.
  Scheduling more asynchronous work (like timers or network requests) will cause
  the program to continue.
- [`unload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event):
  fired when the document or a child resource is being unloaded.
- [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event):
  fired when a promise that has no rejection handler is rejected, ie. a promise
  that has no `.catch()` handler or a second argument to `.then()`.
- [`rejectionhandled`](https://developer.mozilla.org/en-US/docs/Web/API/Window/rejectionhandled_event):
  fired when a `.catch()` handler is added to a a promise that has already
  rejected. This event is fired only if there's `unhandledrejection` listener
  installed that prevents propagation of the event (which would result in the
  program terminating with an error).

You can use these events to provide setup and cleanup code in your program.

Listeners for `load` events can be asynchronous and will be awaited, this event
cannot be canceled. Listeners for `beforeunload` need to be synchronous and can
be cancelled to keep the program running. Listeners for `unload` events need to
be synchronous and cannot be cancelled.

## Example

**main.ts**

```ts
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (main)`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("beforeunload", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (main)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (main)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");
```

**imported.ts**

```ts
const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (imported)`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (imported)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (imported)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (imported)`);
};

console.log("log from imported script");
```

A couple notes on this example:

- `addEventListener` and `onload`/`onunload` are prefixed with `globalThis`, but
  you could also use `self` or no prefix at all.
  [It is not recommended to use `window` as a prefix](https://lint.deno.land/#no-window-prefix).
- You can use `addEventListener` and/or `onload`/`onunload` to define handlers
  for events. There is a major difference between them, let's run the example:

```shell
$ deno run main.ts
log from imported script
log from main script
got load event in event handler (imported)
got load event in event handler (main)
got load event in onload function (main)
got onbeforeunload event in event handler (imported)
got onbeforeunload event in event handler (main)
got onbeforeunload event in onbeforeunload function (main)
got unload event in event handler (imported)
got unload event in event handler (main)
got unload event in onunload function (main)
```

All listeners added using `addEventListener` were run, but `onload`,
`onbeforeunload` and `onunload` defined in `main.ts` overrode handlers defined
in `imported.ts`.

In other words, you can use `addEventListener` to register multiple `"load"` or
`"unload"` event handlers, but only the last defined `onload`, `onbeforeunload`,
`onunload` event handlers will be executed. It is preferable to use
`addEventListener` when possible for this reason.

## `beforeunload` Example

```js
// beforeunload.js
let count = 0;

console.log(count);

globalThis.addEventListener("beforeunload", (e) => {
  console.log("About to exit...");
  if (count < 4) {
    e.preventDefault();
    console.log("Scheduling more work...");
    setTimeout(() => {
      console.log(count);
    }, 100);
  }

  count++;
});

globalThis.addEventListener("unload", (e) => {
  console.log("Exiting");
});

count++;
console.log(count);

setTimeout(() => {
  count++;
  console.log(count);
}, 100);
```

Running this program will print:

```sh
$ deno run beforeunload.js
0
1
2
About to exit...
Scheduling more work...
3
About to exit...
Scheduling more work...
4
About to exit...
Exiting
```

This has allowed us to polyfill `process.on("beforeExit")` in the Node
compatibility layer.

## `unhandledrejection` event Example:

This release adds support for the unhandledrejection event. This event is fired
when a promise that has no rejection handler is rejected, ie. a promise that has
no .catch() handler or a second argument to .then().

```js
// unhandledrejection.js
globalThis.addEventListener("unhandledrejection", (e) => {
  console.log("unhandled rejection at:", e.promise, "reason:", e.reason);
  e.preventDefault();
});

function Foo() {
  this.bar = Promise.reject(new Error("bar not available"));
}

new Foo();
Promise.reject();
```

Running this program will print:

```sh
$ deno run unhandledrejection.js
unhandled rejection at: Promise {
  <rejected> Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
} reason: Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
unhandled rejection at: Promise { <rejected> undefined } reason: undefined
```

This API will allow us to polyfill `process.on("unhandledRejection")` in the
Node compatibility layer in future releases.
