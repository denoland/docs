# Workers

Deno supports
[`Web Worker API`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker).

Workers can be used to run code on multiple threads. Each instance of `Worker`
is run on a separate thread, dedicated only to that worker.

Currently Deno supports only `module` type workers; thus it's essential to pass
the `type: "module"` option when creating a new worker.

Use of relative module specifiers in the main worker are only supported with
`--location <href>` passed on the CLI. This is not recommended for portability.
You can instead use the `URL` constructor and `import.meta.url` to easily create
a specifier for some nearby script. Dedicated workers, however, have a location
and this capability by default.

```ts
// Good
new Worker(import.meta.resolve("./worker.js"), { type: "module" });

// Bad
new Worker(import.meta.resolve("./worker.js"));
new Worker(import.meta.resolve("./worker.js"), { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

As with regular modules, you can use top-level `await` in worker modules.
However, you should be careful to always register the message handler before the
first `await`, since messages can be lost otherwise. This is not a bug in Deno,
it's just an unfortunate interaction of features, and it also happens in all
browsers that support module workers.

```ts
import { delay } from "jsr:std/async@^0/delay.ts";

// First await: waits for a second, then continues running the module.
await delay(1000);

// The message handler is only set after that 1s delay, so some of the messages
// that reached the worker during that second might have been fired when no
// handler was registered.
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

## Instantiation permissions

Creating a new `Worker` instance is similar to a dynamic import; therefore Deno
requires appropriate permission for this action.

For workers using local modules; `--allow-read` permission is required:

**main.ts**

```ts
new Worker(import.meta.resolve("./worker.ts"), { type: "module" });
```

**worker.ts**

```ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: read access to "./worker.ts", run again with the --allow-read flag

$ deno run --allow-read main.ts
hello world
```

For workers using remote modules; `--allow-net` permission is required:

**main.ts**

```ts
new Worker("https://example.com/worker.ts", { type: "module" });
```

**worker.ts** (at https://example.com/worker.ts)

```ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
hello world
```

## Using Deno in worker

> Starting in v1.22 the `Deno` namespace is available in worker scope by
> default. To enable the namespace in earlier versions pass
> `deno: { namespace: true }` when creating a new worker.

**main.js**

```js
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});

worker.postMessage({ filename: "./log.txt" });
```

**worker.js**

```js
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

**log.txt**

```console
hello world
```

```shell
$ deno run --allow-read main.js
hello world
```

> Starting in v1.23 `Deno.exit()` no longer exits the process with the provided
> exit code. Instead is an alias to `self.close()`, which causes only the worker
> to shutdown. This better aligns with the Web platform, as there is no way in
> the browser for a worker to close the page.

## Specifying worker permissions

> This is an unstable Deno feature. Learn more about
> [unstable features](./stability.md).

The permissions available for the worker are analogous to the CLI permission
flags, meaning every permission enabled there can be disabled at the level of
the Worker API. You can find a more detailed description of each of the
permission options [here](../basics/permissions.md).

By default a worker will inherit permissions from the thread it was created in,
however in order to allow users to limit the access of this worker we provide
the `deno.permissions` option in the worker API.

- For permissions that support granular access you can pass in a list of the
  desired resources the worker will have access to, and for those who only have
  the on/off option you can pass true/false respectively.

  ```ts
  const worker = new Worker(import.meta.resolve("./worker.js"), {
    type: "module",
    deno: {
      permissions: {
        net: [
          "deno.land",
        ],
        read: [
          new URL("./file_1.txt", import.meta.url),
          new URL("./file_2.txt", import.meta.url),
        ],
        write: false,
      },
    },
  });
  ```

- Granular access permissions receive both absolute and relative routes as
  arguments, however take into account that relative routes will be resolved
  relative to the file the worker is instantiated in, not the path the worker
  file is currently in

  ```ts
  const worker = new Worker(
    new URL("./worker/worker.js", import.meta.url).href,
    {
      type: "module",
      deno: {
        permissions: {
          read: [
            "/home/user/Documents/deno/worker/file_1.txt",
            "./worker/file_2.txt",
          ],
        },
      },
    },
  );
  ```

- Both `deno.permissions` and its children support the option `"inherit"`, which
  implies it will borrow its parent permissions.

  ```ts
  // This worker will inherit its parent permissions
  const worker = new Worker(import.meta.resolve("./worker.js"), {
    type: "module",
    deno: {
      permissions: "inherit",
    },
  });
  ```

  ```ts
  // This worker will inherit only the net permissions of its parent
  const worker = new Worker(import.meta.resolve("./worker.js"), {
    type: "module",
    deno: {
      permissions: {
        env: false,
        hrtime: false,
        net: "inherit",
        ffi: false,
        read: false,
        run: false,
        write: false,
      },
    },
  });
  ```

- Not specifying the `deno.permissions` option or one of its children will cause
  the worker to inherit by default.

  ```ts
  // This worker will inherit its parent permissions
  const worker = new Worker(import.meta.resolve("./worker.js"), {
    type: "module",
  });
  ```

  ```ts
  // This worker will inherit all the permissions of its parent BUT net
  const worker = new Worker(import.meta.resolve("./worker.js"), {
    type: "module",
    deno: {
      permissions: {
        net: false,
      },
    },
  });
  ```

- You can disable the permissions of the worker all together by passing `"none"`
  to the `deno.permissions` option.

  ```ts
  // This worker will not have any permissions enabled
  const worker = new Worker(import.meta.resolve("./worker.js"), {
    type: "module",
    deno: {
      permissions: "none",
    },
  });
  ```
