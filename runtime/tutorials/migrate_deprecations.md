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
details about the deprecation.

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
details about the deprecation.

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
details about the deprecation.

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
details about the deprecation.

[deno#9795]: https://github.com/denoland/deno/issues/9795

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
details about the deprecation.

## `Deno.writeAllSync()`

Use [`writeAllSync()`](https://deno.land/std/io/write_all.ts?s=writeAllSync)
from the Standard Library instead.

```diff
+ import { writeAllSync } from "https://deno.land/std/io/write_all.ts";

...

- const bytesWritten = Deno.writeAllSync(writer, data);
+ const bytesWritten = writeAllSync(writer, data);
```

`Deno.writeAllSync()` will be removed in Deno 2.0. See [deno#9795][deno#9795]
for details about the deprecation.
