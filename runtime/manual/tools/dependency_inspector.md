# `deno info`, dependency inspector

`deno info [URL]` will inspect an ES module and all of its dependencies.

```shell
deno info jsr:@std/http@0.220.1/file_server
local: /home/deno/.cache/deno/deps/https/jsr.io/b6f7f02b0c3dabb5351109a394aa66c313dd3d073f563a3bfe943fcc5ba850c5
emit: /home/deno/.cache/deno/gen/https/jsr.io/b6f7f02b0c3dabb5351109a394aa66c313dd3d073f563a3bfe943fcc5ba850c5.js
type: TypeScript
dependencies: 43 unique
size: 318.45KB

https://jsr.io/@std/http/0.220.1/file_server.ts (23.77KB)
├─┬ https://jsr.io/@std/path/0.220.1/posix/join.ts (721B)
│ ├── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts (307B)
│ └─┬ https://jsr.io/@std/path/0.220.1/posix/normalize.ts (1.03KB)
│   ├─┬ https://jsr.io/@std/path/0.220.1/_common/normalize.ts (263B)
│   │ └── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│   ├─┬ https://jsr.io/@std/path/0.220.1/_common/normalize_string.ts (2.25KB)
│   │ └── https://jsr.io/@std/path/0.220.1/_common/constants.ts (1.97KB)
│   └─┬ https://jsr.io/@std/path/0.220.1/posix/_util.ts (391B)
│     └── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
├── https://jsr.io/@std/path/0.220.1/posix/normalize.ts *
├─┬ https://jsr.io/@std/path/0.220.1/extname.ts (547B)
│ ├── https://jsr.io/@std/path/0.220.1/_os.ts (705B)
│ ├─┬ https://jsr.io/@std/path/0.220.1/posix/extname.ts (2.13KB)
│ │ ├── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
│ │ ├── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│ │ └── https://jsr.io/@std/path/0.220.1/posix/_util.ts *
│ └─┬ https://jsr.io/@std/path/0.220.1/windows/extname.ts (2.29KB)
│   ├── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
│   ├── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│   └─┬ https://jsr.io/@std/path/0.220.1/windows/_util.ts (828B)
│     └── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
├─┬ https://jsr.io/@std/path/0.220.1/join.ts (510B)
│ ├── https://jsr.io/@std/path/0.220.1/_os.ts *
│ ├── https://jsr.io/@std/path/0.220.1/posix/join.ts *
│ └─┬ https://jsr.io/@std/path/0.220.1/windows/join.ts (2.42KB)
│   ├─┬ https://jsr.io/@std/assert/0.220.1/assert.ts (524B)
│   │ └── https://jsr.io/@std/assert/0.220.1/assertion_error.ts (446B)
│   ├── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│   ├── https://jsr.io/@std/path/0.220.1/windows/_util.ts *
│   └─┬ https://jsr.io/@std/path/0.220.1/windows/normalize.ts (3.7KB)
│     ├── https://jsr.io/@std/path/0.220.1/_common/normalize.ts *
│     ├── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
│     ├── https://jsr.io/@std/path/0.220.1/_common/normalize_string.ts *
│     └── https://jsr.io/@std/path/0.220.1/windows/_util.ts *
├─┬ https://jsr.io/@std/path/0.220.1/relative.ts (788B)
│ ├── https://jsr.io/@std/path/0.220.1/_os.ts *
│ ├─┬ https://jsr.io/@std/path/0.220.1/posix/relative.ts (2.93KB)
│ │ ├── https://jsr.io/@std/path/0.220.1/posix/_util.ts *
│ │ ├─┬ https://jsr.io/@std/path/0.220.1/posix/resolve.ts (1.55KB)
│ │ │ ├── https://jsr.io/@std/path/0.220.1/_common/normalize_string.ts *
│ │ │ ├── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│ │ │ └── https://jsr.io/@std/path/0.220.1/posix/_util.ts *
│ │ └─┬ https://jsr.io/@std/path/0.220.1/_common/relative.ts (287B)
│ │   └── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│ └─┬ https://jsr.io/@std/path/0.220.1/windows/relative.ts (3.88KB)
│   ├── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
│   ├─┬ https://jsr.io/@std/path/0.220.1/windows/resolve.ts (4.73KB)
│   │ ├── https://jsr.io/@std/path/0.220.1/_common/constants.ts *
│   │ ├── https://jsr.io/@std/path/0.220.1/_common/normalize_string.ts *
│   │ ├── https://jsr.io/@std/path/0.220.1/_common/assert_path.ts *
│   │ └── https://jsr.io/@std/path/0.220.1/windows/_util.ts *
│   └── https://jsr.io/@std/path/0.220.1/_common/relative.ts *
├─┬ https://jsr.io/@std/path/0.220.1/resolve.ts (528B)
│ ├── https://jsr.io/@std/path/0.220.1/_os.ts *
│ ├── https://jsr.io/@std/path/0.220.1/posix/resolve.ts *
│ └── https://jsr.io/@std/path/0.220.1/windows/resolve.ts *
├─┬ https://jsr.io/@std/path/0.220.1/constants.ts (348B)
│ └── https://jsr.io/@std/path/0.220.1/_os.ts *
├─┬ https://jsr.io/@std/media-types/0.220.1/content_type.ts (3.04KB)
│ ├─┬ https://jsr.io/@std/media-types/0.220.1/parse_media_type.ts (3.23KB)
│ │ └── https://jsr.io/@std/media-types/0.220.1/_util.ts (3.28KB)
│ ├─┬ https://jsr.io/@std/media-types/0.220.1/get_charset.ts (1.18KB)
│ │ ├── https://jsr.io/@std/media-types/0.220.1/parse_media_type.ts *
│ │ ├── https://jsr.io/@std/media-types/0.220.1/_util.ts *
│ │ └─┬ https://jsr.io/@std/media-types/0.220.1/_db.ts (1.26KB)
│ │   ├── https://jsr.io/@std/media-types/0.220.1/vendor/mime-db.v1.52.0.ts (182.13KB)
│ │   └── https://jsr.io/@std/media-types/0.220.1/_util.ts *
│ ├─┬ https://jsr.io/@std/media-types/0.220.1/format_media_type.ts (1.73KB)
│ │ └── https://jsr.io/@std/media-types/0.220.1/_util.ts *
│ ├── https://jsr.io/@std/media-types/0.220.1/_db.ts *
│ └─┬ https://jsr.io/@std/media-types/0.220.1/type_by_extension.ts (912B)
│   └── https://jsr.io/@std/media-types/0.220.1/_db.ts *
├─┬ https://jsr.io/@std/http/0.220.1/etag.ts (5.91KB)
│ └─┬ https://jsr.io/@std/encoding/0.220.1/base64.ts (2.58KB)
│   └── https://jsr.io/@std/encoding/0.220.1/_util.ts (798B)
├── https://jsr.io/@std/http/0.220.1/status.ts (11.27KB)
├─┬ https://jsr.io/@std/streams/0.220.1/byte_slice_stream.ts (1.41KB)
│ └── https://jsr.io/@std/assert/0.220.1/assert.ts *
├─┬ https://jsr.io/@std/cli/0.220.1/parse_args.ts (21.9KB)
│ └─┬ https://jsr.io/@std/assert/0.220.1/assert_exists.ts (724B)
│   └── https://jsr.io/@std/assert/0.220.1/assertion_error.ts *
├── https://jsr.io/@std/fmt/0.220.1/colors.ts (12.57KB)
├── https://jsr.io/@std/http/0.220.1/deno.json (461B)
└── https://jsr.io/@std/fmt/0.220.1/bytes.ts (4.43KB)
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
