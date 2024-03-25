# Deno 1.x to 2.x Migration Guide

This document contains guidance for migrating from Deno version 1.x to the
upcoming Deno 2.0.

:::caution Work in progress

Deno 2.0 is under active development - these API changes and recommendations
will continue to be updated until the launch of 2.0.

:::

## API changes and deprecations

The following APIs have changed or deprecated between Deno 1.x and 2.x, and will
be removed in 2.x - guidance for migrating to a newer set of APIs is provided
for each impacted API below.

### `Deno.Buffer`

Use [`Buffer`](https://jsr.io/@std/io/doc/~/Buffer) from the Standard Library
instead.

```diff
+ import { Buffer } from "jsr:@std/io@^0/buffer";

- const buffer = new Deno.Buffer();
+ const buffer = new Buffer();
```

See [deno#9795][deno#9795] for details.

### `Deno.Closer`

Use [Closer](https://jsr.io/@std/io/doc/~/Closer) from the Standard Library
instead.

```diff
+ import type { Closer } from "jsr:@std/io@^0/types";

- function foo(closer: Deno.Closer) {
+ function foo(closer: Closer) {
  ...  
}
```

See [deno#9795][deno#9795] for details.

### `Deno.close()`

Use the `.close()` method on the resource instead.

```diff
- Deno.close(file.rid);
+ file.close();
```

```diff
- Deno.close(conn.rid);
+ conn.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.Conn.rid`

Use [`Deno.Conn`](https://deno.land/api?s=Deno.Conn) instance methods instead.

```diff
- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);
```

```diff
- await Deno.write(conn.rid, data);
+ await conn.write(data);
```

```diff
- Deno.close(conn.rid);
+ conn.close();
```

```diff
- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.ListenTlsOptions.certChain`

Use
[`Deno.ConnectTlsOptions.cert`](https://deno.land/api?s=Deno.ConnectTlsOptions#prop_cert)
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

### `Deno.ConnectTlsOptions.certFile`

Use
[`Deno.ConnectTlsOptions.cert`](https://deno.land/api?s=Deno.ConnectTlsOptions#prop_cert)
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

### `Deno.ConnectTlsOptions.privateKey`

Use
[`Deno.ConnectTlsOptions.key`](https://deno.land/api?s=Deno.ConnectTlsOptions#prop_key)
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

### `Deno.copy()`

Use [`copy()`](https://jsr.io/@std/io/doc/~/copy) from the Standard Library
instead.

```diff
+ import { copy } from "jsr:@std/io@^0/copy";

...

- await Deno.copy(reader, writer);
+ await copy(reader, writer);
```

See [deno#9795][deno#9795] for details.

### `Deno.customInspect`

Use `Symbol.for("Deno.customInspect")` instead.

```diff
class Foo {
- [Deno.customInspect]() {
+ [Symbol.for("Deno.customInspect")] {
  }
}
```

See [deno#9294](https://github.com/denoland/deno/issues/9294) for details.

### `Deno.File`

Use [`Deno.FsFile`](https://deno.land/api?s=Deno.FsFile) instead.

```diff
- function foo(file: Deno.File) {
+ function foo(file: Deno.FsFile) {
  ...
}
```

See [deno#13661](https://github.com/denoland/deno/issues/13661) for details.

### `Deno.flock()`

Use [`Deno.FsFile.lock()`](https://deno.land/api?s=Deno.FsFile&p=prototype.lock)
instead.

```diff
- await Deno.flock(file.rid);
+ await file.lock();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### `Deno.flockSync()`

Use
[`Deno.FsFile.lockSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.lockSync)
instead.

```diff
- Deno.flockSync(file.rid);
+ file.lockSync();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### `Deno.fstatSync()`

Use
[`Deno.FsFile.statSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.statSync)
instead.

```diff
- const fileInfo = Deno.fstatSync(file.rid);
+ const fileInfo = file.statSync();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.fstat()`

Use [`Deno.FsFile.stat()`](https://deno.land/api?s=Deno.FsFile&p=prototype.stat)
instead.

```diff
- const fileInfo = await Deno.fstat(file.rid);
+ const fileInfo = await file.stat();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.FsWatcher.rid`

Use [`Deno.FsWatcher`](https://deno.land/api?s=Deno.FsWatcher) instance methods
instead.

```diff
- Deno.close(watcher.rid);
+ watcher.close();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.ftruncateSync()`

Use
[`Deno.FsFile.truncateSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.truncateSync)
instead.

```diff
- Deno.ftruncateSync(file.rid, 7);
+ file.truncateSync(7);
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.ftruncate()`

Use
[`Deno.FsFile.truncate()`](https://deno.land/api?s=Deno.FsFile&p=prototype.truncate)
instead.

```diff
- await Deno.ftruncate(file.rid, 7);
+ await file.truncate(7);
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.funlock()`

Use
[`Deno.FsFile.unlock()`](https://deno.land/api?s=Deno.FsFile&p=prototype.unlock)
instead.

```diff
- await Deno.funlock(file.rid);
+ await file.unlock();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### `Deno.funlockSync()`

Use
[`Deno.FsFile.unlockSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.unlockSync)
instead.

```diff
- Deno.funlockSync(file.rid);
+ file.unlockSync();
```

See [deno#22178](https://github.com/denoland/deno/issues/22178) for details.

### `Deno.futimeSync()`

Use
[`Deno.FsFile.utimeSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.utimeSync)
instead.

```diff
- Deno.futimeSync(file.rid, 1556495550, new Date());
+ file.utimeSync(1556495550, new Date());
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.futime()`

Use
[`Deno.FsFile.utime()`](https://deno.land/api?s=Deno.FsFile&p=prototype.utime)
instead.

```diff
- await Deno.futime(file.rid, 1556495550, new Date());
+ await file.utime(1556495550, new Date());
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.isatty()`

Use `Deno.FsFile.isTerminal()`, `Deno.stdin.isTerminal()`,
`Deno.stdout.isTerminal()` or `Deno.stderr.isTerminal()` instead.

```diff
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

### `Deno.iter()`

Use
[`iterateReader()`](https://jsr.io/@std/io/doc/iterate_reader/~/iterateReader)
from the Standard Library instead.

```diff
+ import { iterateReader } from "jsr:@std/io@^0/iterate_reader";

- for await (const chunk of Deno.iter(reader)) {
+ for await (const chunk of iterateReader(reader)) {
  ...
}
```

See [deno#9795][deno#9795] for details.

### `Deno.iterSync()`

Use
[`iterateReaderSync()`](https://jsr.io/@std/io/doc/iterate_reader/~/iterateReaderSync)
from the Standard Library instead.

```diff
+ import { iterateReaderSync } from "jsr:@std/io@^0/iterate_reader";

- for (const chunk of Deno.iterSync(reader)) {
+ for (const chunk of iterateReaderSync(reader)) {
  ...
}
```

See [deno#9795][deno#9795] for details.

### `Deno.Listener.rid`

Use [`Deno.Listener`](https://deno.land/api?s=Deno.Listener) instance methods
instead.

```diff
- Deno.close(listener.rid);
+ listener.close();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.ListenTlsOptions.certFile`

Pass the certificate file contents to
[`Deno.ListenTlsOptions.cert`](https://deno.land/api?s=Deno.ListenTlsOptions#prop_cert)
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

### `Deno.ListenTlsOptions.keyFile`

Pass the key file contents to
[`Deno.ListenTlsOptions.key`](https://deno.land/api?s=Deno.ListenTlsOptions#prop_key)
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

### `Deno.readAllSync()`

Use [`readAllSync()`](https://jsr.io/@std/io/doc/~/readAllSync) from the
Standard Library instead.

```diff
+ import { readAllSync } from "jsr:@std/io@^0/read_all";

...

- const data = Deno.readAllSync(reader);
+ const data = readAllSync(reader);
```

See [deno#9795][deno#9795] for details.

### `Deno.readAll()`

Use [`readAll()`](https://jsr.io/@std/io/doc/~/readAll) from the Standard
Library instead.

```diff
+ import { readAll } from "jsr:@std/io@^0/read_all";

...

- const data = await Deno.readAll(reader);
+ const data = await readAll(reader);
```

See [deno#9795][deno#9795] for details.

### `Deno.Reader`

Use [`Reader`](https://jsr.io/@std/io/doc/types/~/Reader) from the Standard
Library instead.

```diff
+ import type { Reader } from "jsr:@std/io@^0/types";

- function foo(closer: Deno.Reader) {
+ function foo(closer: Reader) {
  ...  
}
```

See [deno#9795][deno#9795] for details.

### `Deno.ReaderSync`

Use [`ReaderSync`](https://jsr.io/@std/io/doc/types/~/ReaderSync) from the
Standard Library instead.

```diff
+ import type { ReaderSync } from "jsr:@std/io@^0/types";

- function foo(reader: Deno.ReaderSync) {
+ function foo(reader: ReaderSync) {
  ...  
}
```

See [deno#9795][deno#9795] for details.

### `Deno.readSync()`

Use the `.readSync()` method on the resource itself.

```diff
- Deno.readSync(conn.rid, buffer);
+ conn.readSync(buffer);
```

```diff
- Deno.readSync(file.rid, buffer);
+ file.readSync(buffer);
```

See [deno#9795][deno#9795] for details.

### `Deno.read()`

Use the `.read()` method on the resource itself.

```diff
- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);
```

```diff
- await Deno.read(file.rid, buffer);
+ await file.read(buffer);
```

See [deno#9795][deno#9795] for details.

### `Deno.run()`

Use [`new Deno.Command()`](https://deno.land/api?s=Deno.Command) instead.

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

See [deno#16516](https://github.com/denoland/deno/pull/16516) for details.

### `Deno.seekSync()`

Use
[`Deno.FsFile.seekSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.seekSync)
instead.

```diff
- Deno.seekSync(file.rid, 6, Deno.SeekMode.Start);
+ file.seekSync(6, Deno.SeekMode.Start);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.seek()`

Use [`Deno.FsFile.seek()`](https://deno.land/api?s=Deno.FsFile&p=prototype.seek)
instead.

```diff
- await Deno.seek(file.rid, 6, Deno.SeekMode.Start);
+ await file.seek(6, Deno.SeekMode.Start);
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.serveHttp()`

Use [`Deno.serve()`](https://deno.land/api?s=Deno.serve) instead.

```diff
- const conn = Deno.listen({ port: 80 });
- const httpConn = Deno.serveHttp(await conn.accept());
- const e = await httpConn.nextRequest();
- if (e) {
-  e.respondWith(new Response("Hello World"));
- }
+ Deno.serve({ port: 80 }, () => new Response("Hello World"));
```

See the
[Deno 1.35 blog post](https://deno.com/blog/v1.35#denoserve-is-now-stable) for
details.

### `Deno.Server`

Use [`Deno.HttpServer`](https://deno.land/api?s=Deno.HttpServer) instead.

```diff
- function foo(server: Deno.Server) {
+ function foo(server: Deno.HttpServer) {
  ...  
}
```

See [deno#20840](https://github.com/denoland/deno/issues/20840) for details.

### `Deno.shutdown`

Use
[`Deno.Conn.closeWrite()`](https://deno.land/api?s=Deno.Conn#method_closeWrite_0)
instead.

```diff
- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.stderr.rid`

Use [`Deno.stderr`](https://deno.land/api?s=Deno.stderr) instance methods
instead.

```diff
- await Deno.write(Deno.stderr.rid, data);
+ await Deno.stderr.rid(data);
```

```diff
- Deno.close(Deno.stderr.rid);
+ Deno.stderr.close();
```

```diff
- Deno.isatty(Deno.stderr.rid);
+ Deno.stderr.isTerminal();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.stdin.rid`

Use [`Deno.stdin`](https://deno.land/api?s=Deno.stdin) instance methods instead.

```diff
- await Deno.read(Deno.stdin.rid, buffer);
+ await Deno.stdin.read(buffer);
```

```diff
- Deno.close(Deno.stdin.rid);
+ Deno.stdin.close();
```

```diff
- Deno.isatty(Deno.stdin.rid);
+ Deno.stdin.isTerminal();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.stdout.rid`

Use [`Deno.stdout`](https://deno.land/api?s=Deno.stdout) instance methods
instead.

```diff
- await Deno.read(Deno.stdout.rid, buffer);
+ await Deno.stdout.read(buffer);
```

```diff
- Deno.close(Deno.stdout.rid);
+ Deno.stdout.close();
```

```diff
- Deno.isatty(Deno.stdout.rid);
+ Deno.stdout.isTerminal();
```

See [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.TcpConn.rid`

Use [`Deno.TcpConn`](https://deno.land/api?s=Deno.TcpConn) instance methods
instead.

```diff
- await Deno.read(tcpConn.rid, buffer);
+ await tcpConn.read(buffer);
```

```diff
- await Deno.write(tcpConn.rid, data);
+ await tcpConn.write(data);
```

```diff
- Deno.close(tcpConn.rid);
+ tcpConn.close();
```

```diff
- await Deno.shutdown(tcpConn.rid);
+ await tcpConn.closeWrite();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.TlsConn.rid`

Use [`Deno.TlsConn`](https://deno.land/api?s=Deno.TlsConn) instance methods
instead.

```diff
- await Deno.read(tlsConn.rid, buffer);
+ await tlsConn.read(buffer);
```

```diff
- await Deno.write(tlsConn.rid, data);
+ await tlsConn.write(data);
```

```diff
- Deno.close(tlsConn.rid);
+ tlsConn.close();
```

```diff
- await Deno.shutdown(tlsConn.rid);
+ await tlsConn.closeWrite();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.UnixConn.rid`

Use [`Deno.UnixConn`](https://deno.land/api?s=Deno.UnixConn) instance methods
instead.

```diff
- await Deno.read(unixConn.rid, buffer);
+ await unixConn.read(buffer);
```

```diff
- await Deno.write(unixConn.rid, data);
+ await unixConn.write(data);
```

```diff
- Deno.close(unixConn.rid);
+ unixConn.close();
```

```diff
- await Deno.shutdown(unixConn.rid);
+ await unixConn.closeWrite();
```

See the [Deno 1.40 blog post][Deno 1.40 blog post] for details.

### `Deno.writeAllSync()`

Use [`writeAllSync()`](https://jsr.io/@std/io/doc/write_all/~/writeAllSync) from
the Standard Library instead.

```diff
+ import { writeAllSync } from "jsr:@std/io@^0/write_all";

...

- Deno.writeAllSync(writer, data);
+ writeAllSync(writer, data);
```

See [deno#9795][deno#9795] for details.

### `Deno.writeAll()`

Use [`writeAll()`](https://jsr.io/@std/io/doc/write_all/~/writeAll) from the
Standard Library instead.

```diff
+ import { writeAll } from "jsr:@std/io@^0/write_all";

...

- await Deno.writeAll(writer, data);
+ await writeAll(writer, data);
```

See [deno#9795][deno#9795] for details.

### `Deno.Writer`

Use [Writer](https://jsr.io/@std/io/doc/types/~/Writer) from the Standard
Library instead.

```diff
+ import type { Writer } from "jsr:@std/io@^0/types";

- function foo(writer: Deno.Writer) {
+ function foo(writer: Writer) {
  ...  
}
```

See [deno#9795][deno#9795] for details.

### `Deno.WriterSync`

Use [WriterSync](https://jsr.io/@std/io/doc/types/~/WriterSync) from the
Standard Library instead.

```diff
+ import type { WriterSync } from "jsr:@std/io@^0/types";

- function foo(writer: Deno.WriterSync) {
+ function foo(writer: WriterSync) {
  ...  
}
```

See [deno#9795][deno#9795] for details.

### `Deno.writeSync()`

Use the `.writeSync()` method on the resource itself.

```diff
- Deno.writeSync(conn.rid, buffer);
+ conn.writeSync(buffer);
```

```diff
- Deno.writeSync(file.rid, buffer);
+ file.writeSync(buffer);
```

See [deno#9795][deno#9795] for details.

### `Deno.write()`

Use the `.write()` method on the resource itself.

```diff
- await Deno.write(conn.rid, buffer);
+ await conn.write(buffer);
```

```diff
- await Deno.write(file.rid, buffer);
+ await file.write(buffer);
```

See [deno#9795][deno#9795] for details.

### `new Deno.FsFile()`

Use [`Deno.openSync()`](https://deno.land/api?s=Deno.openSync) or
[`Deno.open()`](https://deno.land/api?s=Deno.open) instead.

```diff
- const file = new Deno.FsFile(3);
+ const file = await Deno.open("/foo/bar.txt");
```

[deno#9795]: https://github.com/denoland/deno/issues/9795
[Deno 1.40 blog post]: https://deno.com/blog/v1.40#deprecations-stabilizations-and-removals
