---
title: "Deno 1.x to 2.x Migration Guide"
---

This document contains guidance for migrating from Deno 1.x to 2.x, namely for
subcommands, flags and symbols that have been removed or changed in Deno 2.

:::caution Work in progress

Deno 2.0 is under active development - these API changes and recommendations
will continue to be updated until the launch of 2.0.

:::

## Updated subcommands

### deno bundle

The `deno bundle` command has been removed. We recommend using
[`esbuild`](https://esbuild.github.io/) together with
[`esbuild-deno-loader`](https://jsr.io/@luca/esbuild-deno-loader).

```ts
import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["https://deno.land/std@0.185.0/bytes/mod.ts"],
  outfile: "./dist/bytes.esm.js",
  bundle: true,
  format: "esm",
});

esbuild.stop();
```

### deno cache

The `deno cache` command has been merged into the `deno install` command under
the `--entrypoint` option.

```diff
- deno cache main.ts
+ deno install --entrypoint main.ts
```

### deno vendor

The `deno vendor` command has been replaced by a `"vendor": true` configuration
option in `deno.json`.

```json title="deno.json"
{
  "vendor": true
}
```

## Updated flags

### --allow-none

Use the `--permit-no-files` CLI flag instead.

```diff
- deno test --allow-none
+ deno test --permit-no-files
```

### --jobs

Use the
[`DENO_JOBS`](https://docs.deno.com/runtime/manual/basics/env_variables/#special-environment-variables)
environment variable instead.

```diff
- deno test --jobs=4 --parallel
+ DENO_JOBS=4 deno test --parallel
```

### --ts

Use the `--ext=ts` CLI flag instead.

```diff
- deno run --ts script.ts
+ deno run --ext=ts script.ts
```

```diff
- deno run -T script.ts
+ deno run --ext=ts script.ts
```

### --trace-ops

Use the `--trace-leaks` CLI flag instead.

```diff
- deno test --trace-ops
+ deno test --trace-leaks
```

### ---unstable

Use granular unstable flags (`--unstable-*`) or configuration options instead.
See
[Unstable Feature Flags](https://docs.deno.com/runtime/reference/cli/unstable_flags/)
for reference.

```ts
// kv.ts
const kv = await Deno.openKv();

// ...
```

```diff
- deno run --unstable kv.ts
+ deno run --unstable-kv kv.ts
```

Or

```diff
{
+ "unstable": ["kv"]
}
```

See the
[Deno 1.40 Blog Post](https://deno.com/blog/v1.40#changes-to-how-we-handle-unstable-features)
for details.

## Updated symbols

### Deno.Buffer

Use [`Buffer`](https://jsr.io/@std/io/doc/buffer/~/Buffer) from the Standard
Library instead.

```diff
+ import { Buffer } from "jsr:@std/io/buffer";

- const buffer = new Deno.Buffer();
+ const buffer = new Buffer();

  // ...
```

See [deno#9795][deno#9795] for details.

### Deno.Closer

Use [Closer](https://jsr.io/@std/io/doc/types/~/Closer) from the Standard
Library instead.

```diff
+ import type { Closer } from "jsr:@std/io/types";

- function foo(closer: Deno.Closer) {
+ function foo(closer: Closer) {
  // ...  
}
```

See [deno#9795][deno#9795] for details.

### Deno.close()

Use the `.close()` method on the resource instead.

```diff
  const conn = await Deno.connect({ port: 80 });

  // ...

- Deno.close(conn.rid);
+ conn.close();
```

```diff
  const file = await Deno.open("/foo/bar.txt");

  // ...

- Deno.close(file.rid);
+ file.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.Conn.prototype.rid

Use [`Deno.Conn`](https://docs.deno.com/api/deno/~/Deno.Conn) instance methods
instead.

```diff
  const conn = await Deno.connect({ port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(conn.rid, data);
+ await conn.write(data);

- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();

- Deno.close(conn.rid);
+ conn.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.ConnectTlsOptions.certChain

Use
[`Deno.TlsCertifiedKeyPem.cert`](https://docs.deno.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_cert)
instead.

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
- certChain: Deno.readTextFileSync("./server.crt"),
+ cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

See [deno#22274](https://github.com/denoland/deno/pull/22274) for details.

### Deno.ConnectTlsOptions.certFile

Use
[`Deno.TlsCertifiedKeyPem.cert`](https://docs.deno.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_cert)
instead.

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
- certFile: "./server.crt",
+ cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

See [deno#22274](https://github.com/denoland/deno/pull/22274) for details.

### Deno.ConnectTlsOptions.privateKey

Use
[`Deno.TlsCertifiedKeyPem.cert`](https://docs.deno.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_key)
instead.

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
  cert: Deno.readTextFileSync("./server.crt"),
- keyFile: "./server.key",
+ key: Deno.readTextFileSync("./server.key"),
});
```

See [deno#22274](https://github.com/denoland/deno/pull/22274) for details.

### Deno.copy()

Use [`copy()`](https://jsr.io/@std/io/doc/copy/~/copy) from the Standard Library
instead.

```diff
+ import { copy } from "jsr:@std/io/copy";

  using file = await Deno.open("/foo/bar.txt");

- await Deno.copy(file, Deno.stdout);
+ await copy(file, Deno.stdout);
```

See [deno#9795][deno#9795] for details.

### Deno.customInspect

Use `Symbol.for("Deno.customInspect")` instead.

```diff
class Foo {
- [Deno.customInspect]() {
+ [Symbol.for("Deno.customInspect")] {
  }
}
```

See [deno#9294](https://github.com/denoland/deno/issues/9294) for details.

### Deno.fdatasync()

Use
[`Deno.FsFile.prototype.syncData()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.syncData)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt", { read: true, write: true });

  await file.write(new TextEncoder().encode("Hello, world!"));
- await Deno.fdatasync(file.rid);
+ await file.syncData();
```

### Deno.fdatasyncSync()

Use
[`Deno.FsFile.prototype.syncDataSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.syncDataSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt", { read: true, write: true });

  file.writeSync(new TextEncoder().encode("Hello, world!"));
- Deno.fdatasyncSync(file.rid);
+ file.syncDataSync();
```

### Deno.File

Use [`Deno.FsFile`](https://docs.deno.com/api/deno/~/Deno.FsFile) instead.

```diff
- function foo(file: Deno.File) {
+ function foo(file: Deno.FsFile) {
  // ...
}
```

See [deno#13661](https://github.com/denoland/deno/issues/13661) for details.

### Deno.flock()

Use
[`Deno.FsFile.prototype.lock()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.lock)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.flock(file.rid);
+ await file.lock();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### Deno.flockSync()

Use
[`Deno.FsFile.prototype.lockSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.lockSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.flockSync(file.rid);
+ file.lockSync();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### Deno.fstatSync()

Use
[`Deno.FsFile.prototype.statSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.statSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt");

- const fileInfo = Deno.fstatSync(file.rid);
+ const fileInfo = file.statSync();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.fstat()

Use
[`Deno.FsFile.prototype.stat()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.stat)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- const fileInfo = await Deno.fstat(file.rid);
+ const fileInfo = await file.stat();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.FsWatcher.prototype.rid

Use [`Deno.FsWatcher`](https://docs.deno.com/api/deno/~/Deno.FsWatcher) instance
methods instead.

```diff
  using watcher = Deno.watchFs("/dir");

  // ...

- Deno.close(watcher.rid);
+ watcher.close();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.FsWatcher.prototype.return()

Ensure that the `Deno.FsWatcher` instance is closed once iteration is complete
by instantiating it with the `using` keyword.

```diff
- const watcher = Deno.watchFs("./foo/bar");
+ using watcher = Deno.watchFs("./foo/bar");
  for await (const event of watcher) {
    // ...
  }
```

Alternatively, you can close the watcher resource by explicitly calling
`.close()`.

```diff
  const watcher = Deno.watchFs("./foo/bar");
  for await (const event of watcher) {
    // ...
  }
+ watcher.close();
```

### Deno.fsync()

Use
[`Deno.FsFile.prototype.sync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.sync)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt", { read: true, write: true });

  await file.write(new TextEncoder().encode("Hello, world!"));
  await file.truncate(1);
- await Deno.fsync(file.rid);
+ await file.sync();
```

### Deno.fsyncSync()

Use
[`Deno.FsFile.prototype.syncSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.syncSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt", { read: true, write: true });

  file.writeSync("new TextEncoder().encode("Hello, world!"));
  file.truncateSync(1);
- Deno.fsyncSync(file.rid);
+ file.syncSync();
```

### Deno.ftruncateSync()

Use
[`Deno.FsFile.prototype.truncateSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.truncateSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.ftruncateSync(file.rid, 7);
+ file.truncateSync(7);
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.ftruncate()

Use
[`Deno.FsFile.prototype.truncate()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.truncate)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.ftruncate(file.rid, 7);
+ await file.truncate(7);
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.funlock()

Use
[`Deno.FsFile.prototype.unlock()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.unlock)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.funlock(file.rid);
+ await file.unlock();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### Deno.funlockSync()

Use
[`Deno.FsFile.prototype.unlockSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.unlockSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.funlockSync(file.rid);
+ file.unlockSync();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### Deno.futimeSync()

Use
[`Deno.FsFile.prototype.utimeSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.utimeSync)
instead.

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.futimeSync(file.rid, 1556495550, new Date());
+ file.utimeSync(1556495550, new Date());
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.futime()

Use
[`Deno.FsFile.prototype.utime()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.utime)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.futime(file.rid, 1556495550, new Date());
+ await file.utime(1556495550, new Date());
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.isatty()

Use `Deno.FsFile.prototype.isTerminal()`, `Deno.stdin.prototype.isTerminal()`,
`Deno.stdout.prototype.isTerminal()` or `Deno.stderr.prototype.isTerminal()`
instead.

```diff
  using file = await Deno.open("/dev/tty6");

- Deno.isatty(file.rid);
+ file.isTerminal();
```

```diff
- Deno.isatty(Deno.stdin.rid);
+ Deno.stdin.isTerminal();
```

```diff
- Deno.isatty(Deno.stdout.rid);
+ Deno.stdout.isTerminal();
```

```diff
- Deno.isatty(Deno.stderr.rid);
+ Deno.stderr.isTerminal();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.iter()

Use
[`iterateReader()`](https://jsr.io/@std/io/doc/iterate-reader/~/iterateReader)
from the Standard Library instead.

```diff
+ import { iterateReader } from "jsr:@std/io/iterate-reader";

- for await (const chunk of Deno.iter(Deno.stdout)) {
+ for await (const chunk of iterateReader(Deno.stdout)) {
  // ...
}
```

```diff
+ import { iterateReaderSync } from "jsr:@std/io/iterate-reader";

  using file = await Deno.open("/foo/bar.txt");

- for await (const chunk of Deno.iter(file)) {
+ for await (const chunk of iterateReader(file)) {
  // ...
}
```

See [deno#9795][deno#9795] for details.

### Deno.iterSync()

Use
[`iterateReaderSync()`](https://jsr.io/@std/io/doc/iterate-reader/~/iterateReaderSync)
from the Standard Library instead.

```diff
+ import { iterateReaderSync } from "jsr:@std/io/iterate-reader";

- for (const chunk of Deno.iterSync(Deno.stdout)) {
+ for (const chunk of iterateReaderSync(Deno.stdout)) {
  // ...
}
```

```diff
+ import { iterateReaderSync } from "jsr:@std/io/iterate-reader";

  using file = await Deno.open("/foo/bar.txt");

- for (const chunk of Deno.iterSync(file)) {
+ for (const chunk of iterateReaderSync(file)) {
  // ...
}
```

See [deno#9795][deno#9795] for details.

### Deno.Listener.prototype.rid

Use [`Deno.Listener`](https://docs.deno.com/api/deno/~/Deno.Listener) instance
methods instead.

```diff
  const listener = Deno.listen({ port: 80 })

- Deno.close(listener.rid);
+ listener.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.ListenTlsOptions.certFile

Pass the certificate file contents to
[`Deno.ListenTlsOptions.cert`](https://docs.deno.com/api/deno/~/Deno.ListenTlsOptions#property_cert)
instead.

```diff
using listener = Deno.listenTls({
  port: 443,
- certFile: "./server.crt",
+ cert: Deno.readTextFile("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

See [deno#12639](https://github.com/denoland/deno/issues/12639) for details.

### Deno.ListenTlsOptions.keyFile

Pass the key file contents to
[`Deno.ListenTlsOptions.key`](https://docs.deno.com/api/deno/~/Deno.ListenTlsOptions#property_key)
instead.

```diff
using listener = Deno.listenTls({
  port: 443,
  cert: Deno.readTextFile("./server.crt"),
- keyFile: "./server.key",
+ key: Deno.readTextFileSync("./server.key"),
});
```

See [deno#12639](https://github.com/denoland/deno/issues/12639) for details.

### Deno.metrics()

There is no replacement API for this symbol.

### Deno.readAllSync()

Use [`readAllSync()`](https://jsr.io/@std/io/doc/read-all/~/readAllSync) from
the Standard Library instead.

```diff
+ import { readAllSync } from "jsr:@std/io/read-all";

- const data = Deno.readAllSync(Deno.stdin);
+ const data = readAllSync(Deno.stdin);
```

```diff
+ import { readAllSync } from "jsr:@std/io/read-all";

  using file = Deno.openSync("/foo/bar.txt", { read: true });

- const data = Deno.readAllSync(file);
+ const data = readAllSync(file);
```

See [deno#9795][deno#9795] for details.

### Deno.readAll()

Use [`readAll()`](https://jsr.io/@std/io/doc/read-all/~/readAll) from the
Standard Library instead.

```diff
+ import { readAll } from "jsr:@std/io/read-all";

- const data = await Deno.readAll(Deno.stdin);
+ const data = await readAll(Deno.stdin);
```

```diff
+ import { readAll } from "jsr:@std/io/read-all";

  using file = await Deno.open("/foo/bar.txt", { read: true });

- const data = await Deno.readAll(file);
+ const data = await readAll(file);
```

See [deno#9795][deno#9795] for details.

### Deno.Reader

Use [`Reader`](https://jsr.io/@std/io/doc/~/Reader) from the Standard Library
instead.

```diff
+ import type { Reader } from "jsr:@std/io/types";

- function foo(closer: Deno.Reader) {
+ function foo(closer: Reader) {
  // ...  
}
```

See [deno#9795][deno#9795] for details.

### Deno.ReaderSync

Use [`ReaderSync`](https://jsr.io/@std/io/doc/~/ReaderSync) from the Standard
Library instead.

```diff
+ import type { ReaderSync } from "jsr:@std/io/types";

- function foo(reader: Deno.ReaderSync) {
+ function foo(reader: ReaderSync) {
  // ...  
}
```

See [deno#9795][deno#9795] for details.

### Deno.readSync()

Use the `.readSync()` method on the resource itself.

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new Uint8Array(1_024);

- Deno.readSync(conn.rid, buffer);
+ conn.readSync(buffer);
```

```diff
  using file = Deno.openSync("/foo/bar.txt");
  const buffer = new Uint8Array(1_024);

- Deno.readSync(file.rid, buffer);
+ file.readSync(buffer);
```

See [deno#9795][deno#9795] for details.

### Deno.read()

Use the `.read()` method on the resource itself.

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new Uint8Array(1_024);

- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);
```

```diff
  using file = await Deno.open("/foo/bar.txt");
  const buffer = new Uint8Array(1_024);

- await Deno.read(file.rid, buffer);
+ await file.read(buffer);
```

See [deno#9795][deno#9795] for details.

### Deno.resources()

There is no replacement API for this symbol, as resource IDs (RIDs) are being
phased-out.

### Deno.run()

Use [`new Deno.Command()`](https://docs.deno.com/api/deno/~/Deno.Command)
instead.

```diff
- const process = Deno.run({ cmd: [ "echo", "hello world" ], stdout: "piped" });
- const [{ success }, stdout] = await Promise.all([
-   process.status(),
-   process.output(),
- ]);
- process.close();
+ const command = new Deno.Command("echo", {
+   args: ["hello world"]
+ });
+ const { success, stdout } = await command.output();
  console.log(success);
  console.log(new TextDecoder().decode(stdout));
```

Note: This symbol is soft-removed as of Deno 2. Its types have been removed but
its implementation remains in order to reduce breaking changes. You can ignore
"property does not exist" TypeScript errors by using the
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
directive.

```diff
+ // @ts-ignore `Deno.run()` is soft-removed as of Deno 2.
  const process = Deno.run({ cmd: [ "echo", "hello world" ], stdout: "piped" });
  const [{ success }, stdout] = await Promise.all([
    process.status(),
    process.output(),
  ]);
  process.close();
  console.log(success);
  console.log(new TextDecoder().decode(stdout));
```

See [deno#16516](https://github.com/denoland/deno/pull/16516) for details.

### Deno.seekSync()

Use
[`Deno.FsFile.prototype.seekSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.seekSync)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- Deno.seekSync(file.rid, 6, Deno.SeekMode.Start);
+ file.seekSync(6, Deno.SeekMode.Start);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.seek()

Use
[`Deno.FsFile.prototype.seek()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.seek)
instead.

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.seek(file.rid, 6, Deno.SeekMode.Start);
+ await file.seek(6, Deno.SeekMode.Start);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.serveHttp()

Use [`Deno.serve()`](https://docs.deno.com/api/deno/~/Deno.serve) instead.

```diff
- const conn = Deno.listen({ port: 80 });
- const httpConn = Deno.serveHttp(await conn.accept());
- const e = await httpConn.nextRequest();
- if (e) {
-  e.respondWith(new Response("Hello World"));
- }
+ Deno.serve({ port: 80 }, () => new Response("Hello World"));
```

Note: This symbol is soft-removed as of Deno 2. Its types have been removed but
its implementation remains in order to reduce breaking changes. You can ignore
"property does not exist" TypeScript errors by using the
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
directive.

```diff
  const conn = Deno.listen({ port: 80 });
+ // @ts-ignore `Deno.serveHttp()` is soft-removed as of Deno 2.
  const httpConn = Deno.serveHttp(await conn.accept());
  const e = await httpConn.nextRequest();
  if (e) {
   e.respondWith(new Response("Hello World"));
  }
```

See the
[Deno 1.35 blog post](https://deno.com/blog/v1.35#denoserve-is-now-stable) for
details.

### Deno.Server

Use [`Deno.HttpServer`](https://docs.deno.com/api/deno/~/Deno.HttpServer)
instead.

```diff
- function foo(server: Deno.Server) {
+ function foo(server: Deno.HttpServer) {
  // ...  
}
```

See [deno#20840](https://github.com/denoland/deno/issues/20840) for details.

### Deno.shutdown()

Use
[`Deno.Conn.closeWrite()`](https://docs.deno.com/api/deno/~/Deno.Conn#method_closeWrite_0)
instead.

```diff
  using conn = await Deno.connect({ port: 80 });

- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.stderr.prototype.rid

Use [`Deno.stderr`](https://docs.deno.com/api/deno/~/Deno.stderr) instance
methods instead.

```diff
- if (Deno.isatty(Deno.stderr.rid)) {
+ if (Deno.stderr.isTerminal()) {
    console.log("`Deno.stderr` is a terminal");
  }

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(Deno.stderr.rid, data);
+ await Deno.stderr.write(data);

- Deno.close(Deno.stderr.rid);
+ Deno.stderr.close();
```

Note: This symbol is soft-removed as of Deno 2. Its types have been removed but
its implementation remains in order to reduce breaking changes. You can ignore
"property does not exist" TypeScript errors by using the
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
directive.

```diff
+ // @ts-ignore `Deno.stderr.rid` is soft-removed as of Deno 2.
  Deno.isatty(Deno.stderr.rid);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.stdin.prototype.rid

Use [`Deno.stdin`](https://docs.deno.com/api/deno/~/Deno.stdin) instance methods
instead.

```diff
- if (Deno.isatty(Deno.stdin.rid)) {
+ if (Deno.stdin.isTerminal()) {
    console.log("`Deno.stdout` is a terminal");
  }

  const buffer = new Uint8Array(1_024);
- await Deno.write(Deno.stdin.rid, buffer);
+ await Deno.stdin.write(buffer);

- Deno.close(Deno.stdin.rid);
+ Deno.stdin.close();
```

Note: This symbol is soft-removed as of Deno 2. Its types have been removed but
its implementation remains in order to reduce breaking changes. You can ignore
"property does not exist" TypeScript errors by using the
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
directive.

```diff
+ // @ts-ignore `Deno.stdin.rid` is soft-removed as of Deno 2.
  Deno.isatty(Deno.stdin.rid);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.stdout.prototype.rid

Use [`Deno.stdout`](https://docs.deno.com/api/deno/~/Deno.stdout) instance
methods instead.

```diff
- if (Deno.isatty(Deno.stdout.rid)) {
+ if (Deno.stdout.isTerminal()) {
    console.log("`Deno.stdout` is a terminal");
  }

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(Deno.stdout.rid, data);
+ await Deno.stdout.write(data);

- Deno.close(Deno.stdout.rid);
+ Deno.stdout.close();
```

Note: This symbol is soft-removed as of Deno 2. Its types have been removed but
its implementation remains in order to reduce breaking changes. You can ignore
"property does not exist" TypeScript errors by using the
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
directive.

```diff
+ // @ts-ignore `Deno.stdout.rid` is soft-removed as of Deno 2.
  Deno.isatty(Deno.stdout.rid);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.TcpConn.prototype.rid

Use [`Deno.TcpConn`](https://docs.deno.com/api/deno/~/Deno.TcpConn) instance
methods instead.

```diff
  using tcpConn = await Deno.connect({ port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(tcpConn.rid, buffer);
+ await tcpConn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(tcpConn.rid, data);
+ await tcpConn.write(data);

- await Deno.shutdown(tcpConn.rid);
+ await tcpConn.closeWrite();

- Deno.close(tcpConn.rid);
+ tcpConn.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.TlsConn.prototype.rid

Use [`Deno.TlsConn`](https://docs.deno.com/api/deno/~/Deno.TlsConn) instance
methods instead.

```diff
  const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
  using tlsConn = await Deno.connectTls({ caCerts: [caCert], hostname: "192.0.2.1", port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(tlsConn.rid, buffer);
+ await tlsConn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(tlsConn.rid, data);
+ await tlsConn.write(data);

- await Deno.shutdown(tlsConn.rid);
+ await tlsConn.closeWrite();

- Deno.close(tlsConn.rid);
+ tlsConn.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.UnixConn.prototype.rid

Use [`Deno.UnixConn`](https://docs.deno.com/api/deno/~/Deno.UnixConn) instance
methods instead.

```diff
  using unixConn = await Deno.connect({ path: "/foo/bar.sock", transport: "unix" });

  const buffer = new Uint8Array(1_024);
- await Deno.read(unixConn.rid, buffer);
+ await unixConn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(unixConn.rid, data);
+ await unixConn.write(data);

- await Deno.shutdown(unixConn.rid);
+ await unixConn.closeWrite();

- Deno.close(unixConn.rid);
+ unixConn.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### Deno.writeAllSync()

Use [`writeAllSync()`](https://jsr.io/@std/io/doc/~/writeAllSync) from the
Standard Library instead.

```diff
+ import { writeAllSync } from "jsr:@std/io/write-all";

  const data = new TextEncoder().encode("Hello, world!");

- Deno.writeAllSync(Deno.stdout, data);
+ writeAllSync(Deno.stdout, data);
```

See [deno#9795][deno#9795] for details.

### Deno.writeAll()

Use [`writeAll()`](https://jsr.io/@std/io/doc/~/writeAll) from the Standard
Library instead.

```diff
+ import { writeAll } from "jsr:@std/io/write-all";

  const data = new TextEncoder().encode("Hello, world!");

- await Deno.writeAll(Deno.stdout, data);
+ await writeAll(Deno.stdout, data);
```

See [deno#9795][deno#9795] for details.

### Deno.Writer

Use [Writer](https://jsr.io/@std/io/doc/~/Writer) from the Standard Library
instead.

```diff
+ import type { Writer } from "jsr:@std/io/types";

- function foo(writer: Deno.Writer) {
+ function foo(writer: Writer) {
  // ...  
}
```

See [deno#9795][deno#9795] for details.

### Deno.WriterSync

Use [WriterSync](https://jsr.io/@std/io/doc/~/WriterSync) from the Standard
Library instead.

```diff
+ import type { WriterSync } from "jsr:@std/io/types";

- function foo(writer: Deno.WriterSync) {
+ function foo(writer: WriterSync) {
  // ...  
}
```

See [deno#9795][deno#9795] for details.

### Deno.writeSync()

Use the `.writeSync()` method on the resource itself.

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new TextEncoder().encode("My message");

- Deno.writeSync(conn.rid, buffer);
+ conn.writeSync(buffer);
```

```diff
  using file = Deno.openSync("/foo/bar.txt", { write: true });
  const buffer = new TextEncoder().encode("My message");

- Deno.writeSync(file.rid, buffer);
+ file.writeSync(buffer);
```

See [deno#9795][deno#9795] for details.

### Deno.write()

Use the `.write()` method on the resource itself.

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new TextEncoder().encode("My message");

- await Deno.write(conn.rid, buffer);
+ await conn.write(buffer);
```

```diff
  using file = await Deno.open("/foo/bar.txt", { write: true });
  const buffer = new TextEncoder().encode("My message");

- await Deno.write(file.rid, buffer);
+ await file.write(buffer);
```

See [deno#9795][deno#9795] for details.

### new Deno.FsFile()

Use [`Deno.openSync()`](https://docs.deno.com/api/deno/~/Deno.openSync) or
[`Deno.open()`](https://docs.deno.com/api/deno/~/Deno.open) instead.

```diff
- const file = new Deno.FsFile(3);
+ using file = await Deno.open("/foo/bar.txt");
```

### window

Use `globalThis` instead.

```diff
  const messageBuffer = new TextEncoder().encode("Hello, world!");
  
- const hashBuffer = await window.crypto.subtle.digest("SHA-256", messageBuffer);
+ const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", messageBuffer);
```

See [deno#9795][deno#9795] for details.

[deno#9795]: https://github.com/denoland/deno/issues/9795
[Deno 1.40 blog post]: https://deno.com/blog/v1.40#deprecations-stabilizations-and-removals
