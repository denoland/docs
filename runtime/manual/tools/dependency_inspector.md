# `deno info`, dependency inspector

`deno info [URL]` will inspect an ES module and all of its dependencies.

```shell
deno info https://deno.land/std@0.178.0/http/file_server.ts
Download https://deno.land/std@0.178.0/http/file_server.ts
...
local: /home/deno/.cache/deno/deps/https/deno.land/cca7626bf190e39a7fec3bc79f68f356f8010f6d78afdcb43daae4accbfd4155
type: TypeScript
dependencies: 52 unique
size: 651.67KB

https://deno.land/std@0.178.0/http/file_server.ts (19.08KB)
├─┬ https://deno.land/std@0.178.0/path/mod.ts (1.32KB)
│ ├── https://deno.land/std@0.178.0/_util/os.ts (644B)
│ ├─┬ https://deno.land/std@0.178.0/path/win32.ts (27.84KB)
│ │ ├── https://deno.land/std@0.178.0/path/_interface.ts (728B)
│ │ ├── https://deno.land/std@0.178.0/path/_constants.ts (1.97KB)
│ │ ├─┬ https://deno.land/std@0.178.0/path/_util.ts (4.9KB)
│ │ │ ├── https://deno.land/std@0.178.0/path/_interface.ts *
│ │ │ └── https://deno.land/std@0.178.0/path/_constants.ts *
│ │ └── https://deno.land/std@0.178.0/_util/asserts.ts (854B)
│ ├─┬ https://deno.land/std@0.178.0/path/posix.ts (13.53KB)
│ │ ├── https://deno.land/std@0.178.0/path/_interface.ts *
│ │ ├── https://deno.land/std@0.178.0/path/_constants.ts *
│ │ └── https://deno.land/std@0.178.0/path/_util.ts *
│ ├─┬ https://deno.land/std@0.178.0/path/common.ts (1.16KB)
│ │ └─┬ https://deno.land/std@0.178.0/path/separator.ts (259B)
│ │   └── https://deno.land/std@0.178.0/_util/os.ts *
│ ├── https://deno.land/std@0.178.0/path/separator.ts *
│ ├── https://deno.land/std@0.178.0/path/_interface.ts *
│ └─┬ https://deno.land/std@0.178.0/path/glob.ts (12.39KB)
│   ├── https://deno.land/std@0.178.0/_util/os.ts *
│   ├── https://deno.land/std@0.178.0/_util/os.ts *
│   ├── https://deno.land/std@0.178.0/path/separator.ts *
│   ├── https://deno.land/std@0.178.0/path/win32.ts *
│   └── https://deno.land/std@0.178.0/path/posix.ts *
├─┬ https://deno.land/std@0.178.0/media_types/content_type.ts (2.78KB)
│ ├─┬ https://deno.land/std@0.178.0/media_types/parse_media_type.ts (3.39KB)
│ │ └── https://deno.land/std@0.178.0/media_types/_util.ts (3.27KB)
│ ├─┬ https://deno.land/std@0.178.0/media_types/type_by_extension.ts (906B)
│ │ └─┬ https://deno.land/std@0.178.0/media_types/_db.ts (1.25KB)
│ │   ├── https://deno.land/std@0.178.0/media_types/vendor/mime-db.v1.52.0.ts (182.13KB)
│ │   └── https://deno.land/std@0.178.0/media_types/_util.ts *
│ ├─┬ https://deno.land/std@0.178.0/media_types/get_charset.ts (1.17KB)
│ │ ├── https://deno.land/std@0.178.0/media_types/parse_media_type.ts *
│ │ ├── https://deno.land/std@0.178.0/media_types/_util.ts *
│ │ └── https://deno.land/std@0.178.0/media_types/_db.ts *
│ ├─┬ https://deno.land/std@0.178.0/media_types/format_media_type.ts (1.72KB)
│ │ └── https://deno.land/std@0.178.0/media_types/_util.ts *
│ └── https://deno.land/std@0.178.0/media_types/_db.ts *
├─┬ https://deno.land/std@0.178.0/http/server.ts (21.18KB)
│ └─┬ https://deno.land/std@0.178.0/async/mod.ts (465B)
│   ├─┬ https://deno.land/std@0.178.0/async/abortable.ts (3.95KB)
│   │ └── https://deno.land/std@0.178.0/async/deferred.ts (1.51KB)
│   ├─┬ https://deno.land/std@0.178.0/async/deadline.ts (1.04KB)
│   │ └── https://deno.land/std@0.178.0/async/deferred.ts *
│   ├── https://deno.land/std@0.178.0/async/debounce.ts (2.18KB)
│   ├── https://deno.land/std@0.178.0/async/deferred.ts *
│   ├── https://deno.land/std@0.178.0/async/delay.ts (1.8KB)
│   ├─┬ https://deno.land/std@0.178.0/async/mux_async_iterator.ts (2.45KB)
│   │ └── https://deno.land/std@0.178.0/async/deferred.ts *
│   ├── https://deno.land/std@0.178.0/async/pool.ts (3.13KB)
│   ├── https://deno.land/std@0.178.0/async/tee.ts (2.1KB)
│   └── https://deno.land/std@0.178.0/async/retry.ts (2.35KB)
├── https://deno.land/std@0.178.0/http/http_status.ts (9.96KB)
├─┬ https://deno.land/std@0.178.0/flags/mod.ts (22.05KB)
│ └── https://deno.land/std@0.178.0/_util/asserts.ts *
├── https://deno.land/std@0.178.0/_util/asserts.ts *
├── https://deno.land/std@0.178.0/fmt/colors.ts (12.13KB)
├─┬ https://deno.land/std@0.178.0/http/util.ts (1020B)
│ ├── https://deno.land/std@0.178.0/http/http_status.ts *
│ └─┬ https://deno.land/std@0.178.0/collections/deep_merge.ts (10.98KB)
│   └── https://deno.land/std@0.178.0/collections/_utils.ts (790B)
├─┬ https://deno.land/std@0.178.0/crypto/crypto.ts (11.88KB)
│ ├─┬ https://deno.land/std@0.178.0/crypto/_wasm/mod.ts (1.11KB)
│ │ └── https://deno.land/std@0.178.0/crypto/_wasm/lib/deno_std_wasm_crypto.generated.mjs (238.72KB)
│ ├─┬ https://deno.land/std@0.178.0/crypto/timing_safe_equal.ts (983B)
│ │ └── https://deno.land/std@0.178.0/_util/asserts.ts *
│ └─┬ https://deno.land/std@0.178.0/crypto/_fnv/mod.ts (621B)
│   ├─┬ https://deno.land/std@0.178.0/crypto/_fnv/fnv32.ts (825B)
│   │ └── https://deno.land/std@0.178.0/crypto/_fnv/util.ts (1.44KB)
│   └─┬ https://deno.land/std@0.178.0/crypto/_fnv/fnv64.ts (1.02KB)
│     └── https://deno.land/std@0.178.0/crypto/_fnv/util.ts *
├─┬ https://deno.land/std@0.178.0/crypto/to_hash_string.ts (1021B)
│ ├── https://deno.land/std@0.178.0/encoding/hex.ts (2.23KB)
│ └── https://deno.land/std@0.178.0/encoding/base64.ts (2.48KB)
├─┬ https://deno.land/std@0.178.0/crypto/_util.ts (1.06KB)
│ └─┬ https://deno.land/std@0.178.0/crypto/mod.ts (439B)
│   ├── https://deno.land/std@0.178.0/crypto/crypto.ts *
│   ├─┬ https://deno.land/std@0.178.0/crypto/keystack.ts (5.37KB)
│   │ ├── https://deno.land/std@0.178.0/crypto/timing_safe_equal.ts *
│   │ └─┬ https://deno.land/std@0.178.0/encoding/base64url.ts (1.95KB)
│   │   └── https://deno.land/std@0.178.0/encoding/base64.ts *
│   ├── https://deno.land/std@0.178.0/crypto/timing_safe_equal.ts *
│   └── https://deno.land/std@0.178.0/crypto/to_hash_string.ts *
└── https://deno.land/std@0.178.0/version.ts (371B)
```

Dependency inspector works with any local or remote ES modules.

## Cache location

`deno info` can be used to display information about cache location:

```shell
deno info
DENO_DIR location: "/Users/deno/Library/Caches/deno"
Remote modules cache: "/Users/deno/Library/Caches/deno/deps"
TypeScript compiler cache: "/Users/deno/Library/Caches/deno/gen"
```
