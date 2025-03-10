---
title: "`deno info`, dependency inspector"
oldUrl:
 - /runtime/manual/tools/dependency_inspector/
 - /runtime/reference/cli/dependency_inspector/
command: info
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno info"
description: "Inspect the dependencies of your project"
---

## Example

```shell
$ deno info jsr:@std/http@1.0.0-rc.5/file-server
local: /home/lucacasonato/.cache/deno/deps/https/jsr.io/3a0e5ef03d2090c75c81daf771ed9a73009518adfe688c333dc11d8006dc3598
emit: /home/lucacasonato/.cache/deno/gen/https/jsr.io/3a0e5ef03d2090c75c81daf771ed9a73009518adfe688c333dc11d8006dc3598.js
type: TypeScript
dependencies: 40 unique
size: 326.42KB

https://jsr.io/@std/http/1.0.0-rc.5/file_server.ts (24.74KB)
├─┬ https://jsr.io/@std/path/1.0.1/posix/join.ts (862B)
│ ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts (307B)
│ └─┬ https://jsr.io/@std/path/1.0.1/posix/normalize.ts (1.31KB)
│   ├─┬ https://jsr.io/@std/path/1.0.1/_common/normalize.ts (263B)
│   │ └── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│   ├─┬ https://jsr.io/@std/path/1.0.1/_common/normalize_string.ts (2.25KB)
│   │ └── https://jsr.io/@std/path/1.0.1/_common/constants.ts (1.97KB)
│   └─┬ https://jsr.io/@std/path/1.0.1/posix/_util.ts (391B)
│     └── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
├── https://jsr.io/@std/path/1.0.1/posix/normalize.ts *
├─┬ https://jsr.io/@std/path/1.0.1/extname.ts (906B)
│ ├── https://jsr.io/@std/path/1.0.1/_os.ts (736B)
│ ├─┬ https://jsr.io/@std/path/1.0.1/posix/extname.ts (2.28KB)
│ │ ├── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
│ │ ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│ │ └── https://jsr.io/@std/path/1.0.1/posix/_util.ts *
│ └─┬ https://jsr.io/@std/path/1.0.1/windows/extname.ts (2.5KB)
│   ├── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
│   ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│   └─┬ https://jsr.io/@std/path/1.0.1/windows/_util.ts (828B)
│     └── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
├─┬ https://jsr.io/@std/path/1.0.1/join.ts (926B)
│ ├── https://jsr.io/@std/path/1.0.1/_os.ts *
│ ├── https://jsr.io/@std/path/1.0.1/posix/join.ts *
│ └─┬ https://jsr.io/@std/path/1.0.1/windows/join.ts (2.41KB)
│   ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│   ├── https://jsr.io/@std/path/1.0.1/windows/_util.ts *
│   └─┬ https://jsr.io/@std/path/1.0.1/windows/normalize.ts (3.84KB)
│     ├── https://jsr.io/@std/path/1.0.1/_common/normalize.ts *
│     ├── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
│     ├── https://jsr.io/@std/path/1.0.1/_common/normalize_string.ts *
│     └── https://jsr.io/@std/path/1.0.1/windows/_util.ts *
├─┬ https://jsr.io/@std/path/1.0.1/relative.ts (1.08KB)
│ ├── https://jsr.io/@std/path/1.0.1/_os.ts *
│ ├─┬ https://jsr.io/@std/path/1.0.1/posix/relative.ts (3.25KB)
│ │ ├── https://jsr.io/@std/path/1.0.1/posix/_util.ts *
│ │ ├─┬ https://jsr.io/@std/path/1.0.1/posix/resolve.ts (1.84KB)
│ │ │ ├── https://jsr.io/@std/path/1.0.1/_common/normalize_string.ts *
│ │ │ ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│ │ │ └── https://jsr.io/@std/path/1.0.1/posix/_util.ts *
│ │ └─┬ https://jsr.io/@std/path/1.0.1/_common/relative.ts (287B)
│ │   └── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│ └─┬ https://jsr.io/@std/path/1.0.1/windows/relative.ts (4.24KB)
│   ├── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
│   ├─┬ https://jsr.io/@std/path/1.0.1/windows/resolve.ts (5.02KB)
│   │ ├── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
│   │ ├── https://jsr.io/@std/path/1.0.1/_common/normalize_string.ts *
│   │ ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│   │ └── https://jsr.io/@std/path/1.0.1/windows/_util.ts *
│   └── https://jsr.io/@std/path/1.0.1/_common/relative.ts *
├─┬ https://jsr.io/@std/path/1.0.1/resolve.ts (1.02KB)
│ ├── https://jsr.io/@std/path/1.0.1/_os.ts *
│ ├── https://jsr.io/@std/path/1.0.1/posix/resolve.ts *
│ └── https://jsr.io/@std/path/1.0.1/windows/resolve.ts *
├─┬ https://jsr.io/@std/path/1.0.1/constants.ts (705B)
│ └── https://jsr.io/@std/path/1.0.1/_os.ts *
├─┬ https://jsr.io/@std/media-types/1.0.2/content_type.ts (3.09KB)
│ ├─┬ https://jsr.io/@std/media-types/1.0.2/parse_media_type.ts (3.54KB)
│ │ └── https://jsr.io/@std/media-types/1.0.2/_util.ts (3.18KB)
│ ├─┬ https://jsr.io/@std/media-types/1.0.2/get_charset.ts (1.45KB)
│ │ ├── https://jsr.io/@std/media-types/1.0.2/parse_media_type.ts *
│ │ ├── https://jsr.io/@std/media-types/1.0.2/_util.ts *
│ │ └─┬ https://jsr.io/@std/media-types/1.0.2/_db.ts (1.34KB)
│ │   ├── https://jsr.io/@std/media-types/1.0.2/vendor/db.ts (190.69KB)
│ │   └── https://jsr.io/@std/media-types/1.0.2/_util.ts *
│ ├─┬ https://jsr.io/@std/media-types/1.0.2/format_media_type.ts (2.45KB)
│ │ └── https://jsr.io/@std/media-types/1.0.2/_util.ts *
│ ├── https://jsr.io/@std/media-types/1.0.2/_db.ts *
│ └─┬ https://jsr.io/@std/media-types/1.0.2/type_by_extension.ts (1.15KB)
│   └── https://jsr.io/@std/media-types/1.0.2/_db.ts *
├─┬ https://jsr.io/@std/http/1.0.0-rc.5/etag.ts (6.46KB)
│ └─┬ https://jsr.io/@std/encoding/1.0.1/base64.ts (3.18KB)
│   └── https://jsr.io/@std/encoding/1.0.1/_validate_binary_like.ts (798B)
├── https://jsr.io/@std/http/1.0.0-rc.5/status.ts (13.39KB)
├── https://jsr.io/@std/streams/1.0.0-rc.4/byte_slice_stream.ts (2.57KB)
├── https://jsr.io/@std/cli/1.0.0/parse_args.ts (21.94KB)
├── https://jsr.io/@std/http/1.0.0-rc.5/deno.json (415B)
├── https://jsr.io/@std/fmt/1.0.0-rc.1/bytes.ts (5.3KB)
└── https://jsr.io/@std/net/1.0.0-rc.2/get_network_address.ts (1.68KB)
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
