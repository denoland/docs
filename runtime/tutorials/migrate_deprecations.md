# How to Migrate Away from Deprecated APIs

## `Deno.Buffer`

Use [`Buffer`](https://deno.land/std/io/buffer.ts?s=Buffer) from the Standard
Library instead.

```diff
+ import { Buffer } from "https://deno.land/std/io/buffer.ts";

- const buffer = new Deno.Buffer();
+ const buffer = new Buffer();
```

`Deno.Buffer` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.Closer`

Use [Closer](https://deno.land/std/io/types.ts?s=Closer) from the Standard
Library instead.

```diff
+ import type { Closer } from "https://deno.land/std/io/types.ts";

- function foo(closer: Deno.Closer) {
+ function foo(closer: Closer) {
  ...  
}
```

`Deno.Closer` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.close()`

Use the `.close()` method on the resource instead.

```diff
- Deno.close(file.rid);
+ file.close();
```

```diff
- Deno.close(conn.rid);
+ conn.close();
```

`Deno.close()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.copy()`

Use [`copy()`](https://deno.land/std/io/copy.ts?s=copy) from the Standard
Library instead.

```diff
+ import { copy } from "https://deno.land/std/io/copy.ts";

...

- await Deno.copy(reader, writer);
+ await copy(reader, writer);
```

`Deno.copy()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.customInspect`

Use `Symbol.for("Deno.customInspect")` instead.

```diff
class Foo {
- [Deno.customInspect]() {
+ [Symbol.for("Deno.customInspect")] {
  }
}
```

`Deno.customInspect` will be removed in Deno 2.0. See
[deno#9294](https://github.com/denoland/deno/issues/9294) for details.

## `Deno.isatty()`

Use `Deno.stdin.isTerminal()`, `Deno.stdout.isTerminal()` or
`Deno.stderr.isTerminal()` instead.

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

`Deno.isatty()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.File`

Use [`Deno.FsFile`](https://deno.land/api?s=Deno.FsFile) instead.

```diff
- function foo(file: Deno.File) {
+ function foo(file: Deno.FsFile) {
  ...
}
```

`Deno.File` will be removed in Deno 2.0. See
[deno#13661](https://github.com/denoland/deno/issues/13661) for details.

## `Deno.fstat()`

Use [`Deno.FsFile.stat()`](https://deno.land/api?s=Deno.FsFile&p=prototype.stat)
instead.

```diff
- const fileInfo = await Deno.fstat(file.rid);
+ const fileInfo = await file.stat();
```

`Deno.fstat()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.fstatSync()`

Use
[`Deno.FsFile.statSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.statSync)
instead.

```diff
- const fileInfo = Deno.fstatSync(file.rid);
+ const fileInfo = file.statSync();
```

`Deno.fstatSync()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.ftruncate()`

Use
[`Deno.FsFile.truncate()`](https://deno.land/api?s=Deno.FsFile&p=prototype.truncate)
instead.

```diff
- await Deno.ftruncate(file.rid, 7);
+ await file.truncate(7);
```

`Deno.ftruncate()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.ftruncateSync()`

Use
[`Deno.FsFile.truncateSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.truncateSync)
instead.

```diff
- Deno.ftruncateSync(file.rid, 7);
+ file.truncateSync(7);
```

`Deno.ftruncateSync()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.futime()`

Use
[`Deno.FsFile.utime()`](https://deno.land/api?s=Deno.FsFile&p=prototype.utime)
instead.

```diff
- await Deno.futime(file.rid, 1556495550, new Date());
+ await file.utime(1556495550, new Date());
```

`Deno.futime()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.futimeSync()`

Use
[`Deno.FsFile.utimeSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.utimeSync)
instead.

```diff
- Deno.futimeSync(file.rid, 1556495550, new Date());
+ file.utimeSync(1556495550, new Date());
```

`Deno.futimeSync()` will be removed in Deno 2.0. See the
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.Reader`

Use [`Reader`](https://deno.land/std/io/types.ts?s=Reader) from the Standard
Library instead.

```diff
+ import type { Reader } from "https://deno.land/std/io/types.ts";

- function foo(closer: Deno.Reader) {
+ function foo(closer: Reader) {
  ...  
}
```

`Deno.Reader` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.ReaderSync`

Use [`ReaderSync`](https://deno.land/std/io/types.ts?s=ReaderSync) from the
Standard Library instead.

```diff
+ import type { ReaderSync } from "https://deno.land/std/io/types.ts";

- function foo(reader: Deno.ReaderSync) {
+ function foo(reader: ReaderSync) {
  ...  
}
```

`Deno.ReaderSync` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.read()`

Use the `.read()` method on the resource itself.

```diff
- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);
```

```diff
- await Deno.read(file.rid, buffer);
+ await file.read(buffer);
```

`Deno.read()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.readAll()`

Use [`readAll()`](https://deno.land/std/io/read_all.ts?s=readAll) from the
Standard Library instead.

```diff
+ import { readAll } from "https://deno.land/std/io/read_all.ts";

...

- const data = await Deno.readAll(reader);
+ const data = await readAll(reader);
```

`Deno.readAll()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.readAllSync()`

Use [`readAllSync()`](https://deno.land/std/io/read_all.ts?s=readAllSync) from
the Standard Library instead.

```diff
+ import { readAllSync } from "https://deno.land/std/io/read_all.ts";

...

- const data = Deno.readAllSync(reader);
+ const data = readAllSync(reader);
```

`Deno.readAllSync()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.readSync()`

Use the `.readSync()` method on the resource itself.

```diff
- Deno.readSync(conn.rid, buffer);
+ conn.readSync(buffer);
```

```diff
- Deno.readSync(file.rid, buffer);
+ file.readSync(buffer);
```

`Deno.readSync()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.seek()`

Use [`Deno.FsFile.seek()`](https://deno.land/api?s=Deno.FsFile&p=prototype.seek)
instead.

```diff
- await Deno.seek(file.rid, 6, Deno.SeekMode.Start);
+ await file.seek(6, Deno.SeekMode.Start);
```

`Deno.seek()` will be removed in Deno 2.0. See
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.seekSync()`

Use
[`Deno.FsFile.seekSync()`](https://deno.land/api?s=Deno.FsFile&p=prototype.seekSync)
instead.

```diff
- Deno.seekSync(file.rid, 6, Deno.SeekMode.Start);
+ file.seek(6, Deno.SeekMode.Start);
```

`Deno.seekSync()` will be removed in Deno 2.0. See
[Deno 1.40 blog post][Deno 1.40 blog post] for details.

## `Deno.Writer`

Use [Writer](https://deno.land/std/io/types.ts?s=Writer) from the Standard
Library instead.

```diff
+ import type { Writer } from "https://deno.land/std/io/types.ts";

- function foo(writer: Deno.Writer) {
+ function foo(writer: Writer) {
  ...  
}
```

`Deno.Writer` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.WriterSync`

Use [WriterSync](https://deno.land/std/io/types.ts?s=WriterSync) from the
Standard Library instead.

```diff
+ import type { WriterSync } from "https://deno.land/std/io/types.ts";

- function foo(writer: Deno.WriterSync) {
+ function foo(writer: WriterSync) {
  ...  
}
```

`Deno.WriterSync` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.write()`

Use the `.write()` method on the resource itself.

```diff
- await Deno.write(conn.rid, buffer);
+ await conn.write(buffer);
```

```diff
- await Deno.write(file.rid, buffer);
+ await file.write(buffer);
```

`Deno.write()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.writeAll()`

Use [`writeAll()`](https://deno.land/std/io/write_all.ts?s=writeAll) from the
Standard Library instead.

```diff
+ import { writeAll } from "https://deno.land/std/io/write_all.ts";

...

- await Deno.writeAll(writer, data);
+ await writeAll(writer, data);
```

`Deno.writeAll()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

## `Deno.writeAllSync()`

Use [`writeAllSync()`](https://deno.land/std/io/write_all.ts?s=writeAllSync)
from the Standard Library instead.

```diff
+ import { writeAllSync } from "https://deno.land/std/io/write_all.ts";

...

- Deno.writeAllSync(writer, data);
+ writeAllSync(writer, data);
```

`Deno.writeAllSync()` will be removed in Deno 2.0. See [deno#9795][deno#9795]
for details.

## `Deno.writeSync()`

Use the `.writeSync()` method on the resource itself.

```diff
- Deno.writeSync(conn.rid, buffer);
+ conn.writeSync(buffer);
```

```diff
- Deno.writeSync(file.rid, buffer);
+ file.writeSync(buffer);
```

`Deno.writeSync()` will be removed in Deno 2.0. See [deno#9795][deno#9795] for
details.

[deno#9795]: https://github.com/denoland/deno/issues/9795
[Deno 1.40 blog post]: https://deno.com/blog/v1.40#deprecations-stabilizations-and-removals
