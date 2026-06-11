# Examples backlog: coverage gaps vs Bun's guides

Tracking file generated from a head-to-head audit of
[docs.deno.com/examples](https://docs.deno.com/examples/) against
[Bun's guides](https://bun.com/guides) (June 2026). Each unchecked item is a
task-shaped guide Bun ships that we have no example/tutorial equivalent for.
Titles are Deno-flavored; each links to Bun's version for reference. Items that
exist on the Deno side but are misfiled or partial are flagged inline.

Audit context: we win on per-page depth and rationale (file reading, tests,
WebSockets, Docker); Bun wins on findability — one task, one page, titled the
way people search. This list closes that findability gap. Conventions worth
copying while writing these: show expected terminal output after commands, keep
each page answerable in one screen, and title pages as tasks.

Consolidation policy: where Bun atomizes one topic into many two-line pages
(binary/stream conversions), we write one page per source type with an anchored
section per variant, then surface every variant as its own entry in the examples
index and search, linking to the anchor — the same many-entries-few-pages model
as the API reference. Long-tail search is served by passage ranking on the
anchored headings; these SERPs are MDN-dominated either way, so maintainability
wins.

## Binary data (we cover 2 task shapes; 4 consolidated pages close ~22 gaps)

Existing: "Manipulating byte arrays", "Hex and base64 encoding". Bun ships a
micro-guide per pairwise conversion; we consolidate by source type instead — one
page per "from" type with an anchored section per target, and each conversion
listed as its own entry in the examples index/search pointing at the anchor
(same many-entries-few-pages model as the API reference).

- [x] Convert an ArrayBuffer — sections: to string, Uint8Array, Blob, DataView,
      array of numbers, `node:buffer` Buffer (Bun splits these:
      [to-string](https://bun.com/docs/guides/binary/arraybuffer-to-string),
      [to-typedarray](https://bun.com/docs/guides/binary/arraybuffer-to-typedarray),
      [to-blob](https://bun.com/docs/guides/binary/arraybuffer-to-blob),
      [to-array](https://bun.com/docs/guides/binary/arraybuffer-to-array),
      [to-buffer](https://bun.com/docs/guides/binary/arraybuffer-to-buffer))
- [x] Convert a Uint8Array — sections: to string, ArrayBuffer, Blob, DataView,
      ReadableStream, Buffer (Bun:
      [to-string](https://bun.com/docs/guides/binary/typedarray-to-string),
      [to-arraybuffer](https://bun.com/docs/guides/binary/typedarray-to-arraybuffer),
      [to-blob](https://bun.com/docs/guides/binary/typedarray-to-blob),
      [to-dataview](https://bun.com/docs/guides/binary/typedarray-to-dataview),
      [to-readablestream](https://bun.com/docs/guides/binary/typedarray-to-readablestream),
      [to-buffer](https://bun.com/docs/guides/binary/typedarray-to-buffer))
- [x] Convert a Blob — sections: to string, ArrayBuffer, Uint8Array,
      ReadableStream, DataView (Bun:
      [to-string](https://bun.com/docs/guides/binary/blob-to-string),
      [to-arraybuffer](https://bun.com/docs/guides/binary/blob-to-arraybuffer),
      [to-typedarray](https://bun.com/docs/guides/binary/blob-to-typedarray),
      [to-stream](https://bun.com/docs/guides/binary/blob-to-stream),
      [to-dataview](https://bun.com/docs/guides/binary/blob-to-dataview))
- [x] Convert a Buffer (`node:buffer` interop) — sections: to string,
      Uint8Array, ArrayBuffer, Blob, ReadableStream; include DataView-to-string
      here too (Bun:
      [to-string](https://bun.com/docs/guides/binary/buffer-to-string),
      [to-typedarray](https://bun.com/docs/guides/binary/buffer-to-typedarray),
      [to-arraybuffer](https://bun.com/docs/guides/binary/buffer-to-arraybuffer),
      [to-blob](https://bun.com/docs/guides/binary/buffer-to-blob),
      [to-readablestream](https://bun.com/docs/guides/binary/buffer-to-readablestream),
      [dataview-to-string](https://bun.com/docs/guides/binary/dataview-to-string))

## Streams (we cover 2 task shapes; 2 consolidated pages close ~12 gaps)

Existing: "Piping streams", "Fetch and stream data". Same consolidation model as
Binary data.

- [x] Convert a ReadableStream — sections: to string, JSON, Blob, Uint8Array,
      ArrayBuffer, array of chunks, `node:buffer` Buffer (Bun:
      [to-string](https://bun.com/docs/guides/streams/to-string),
      [to-json](https://bun.com/docs/guides/streams/to-json),
      [to-blob](https://bun.com/docs/guides/streams/to-blob),
      [to-typedarray](https://bun.com/docs/guides/streams/to-typedarray),
      [to-arraybuffer](https://bun.com/docs/guides/streams/to-arraybuffer),
      [to-array](https://bun.com/docs/guides/streams/to-array),
      [to-buffer](https://bun.com/docs/guides/streams/to-buffer))
- [x] Convert a Node.js Readable — sections: to string, JSON, Blob, Uint8Array,
      ArrayBuffer (Bun:
      [to-string](https://bun.com/docs/guides/streams/node-readable-to-string),
      [to-json](https://bun.com/docs/guides/streams/node-readable-to-json),
      [to-blob](https://bun.com/docs/guides/streams/node-readable-to-blob),
      [to-uint8array](https://bun.com/docs/guides/streams/node-readable-to-uint8array),
      [to-arraybuffer](https://bun.com/docs/guides/streams/node-readable-to-arraybuffer))

## Package management (we cover ~2 of ~15 task shapes)

Existing: "Import modules from npm", "Compatibility with Node & npm". Bun has 17
task guides here; ours mostly live as runtime fundamentals prose, not findable
task pages. Deno-flavored equivalents:

- [ ] Add a dependency with `deno add` (jsr: and npm:)
      ([Bun](https://bun.com/docs/guides/install/add))
- [ ] Manage dev-only dependencies in a Deno project
      ([Bun](https://bun.com/docs/guides/install/add-dev))
- [ ] Use a Git repository as a dependency
      ([Bun](https://bun.com/docs/guides/install/add-git))
- [ ] Use a tarball/local path as a dependency
      ([Bun](https://bun.com/docs/guides/install/add-tarball))
- [ ] Allow npm lifecycle scripts (`--allow-scripts`)
      ([Bun](https://bun.com/docs/guides/install/trusted))
- [ ] Configure a private npm registry / org scope (`.npmrc`,
      `DENO_AUTH_TOKENS`)
      ([Bun](https://bun.com/docs/guides/install/registry-scope))
- [ ] Override the default npm registry
      ([Bun](https://bun.com/docs/guides/install/custom-registry))
- [ ] Use Deno with an Azure Artifacts npm registry
      ([Bun](https://bun.com/docs/guides/install/azure-artifacts))
- [ ] Use Deno with JFrog Artifactory
      ([Bun](https://bun.com/docs/guides/install/jfrog-artifactory))
- [ ] Configure a monorepo using Deno workspaces
      ([Bun](https://bun.com/docs/guides/install/workspaces))
- [ ] Understand and review `deno.lock` in git diffs
      ([Bun](https://bun.com/docs/guides/install/git-diff-bun-lockfile))
- [ ] Alias a package under a different import name
      ([Bun](https://bun.com/docs/guides/install/npm-alias))
- [ ] Install dependencies in GitHub Actions (`setup-deno` + caching)
      ([Bun](https://bun.com/docs/guides/install/cicd))
- [ ] Migrate a project from `npm install` to Deno
      ([Bun](https://bun.com/docs/guides/install/from-npm-install-to-bun-install))

## HTTP (we cover 6 of ~14 task shapes)

Existing: Hello world, routing, serving files, streaming, file upload, CRUD with
SQLite, fetch ("HTTP requests").

- [x] Configure TLS/HTTPS on an HTTP server
      ([Bun](https://bun.com/docs/guides/http/tls)) — we only have a raw
      `tls_listener` example
- [x] Server-Sent Events (SSE) ([Bun](https://bun.com/docs/guides/http/sse))
- [x] Proxy HTTP requests using fetch
      ([Bun](https://bun.com/docs/guides/http/proxy))
- [x] Hot reload an HTTP server with `deno serve`/`--watch`
      ([Bun](https://bun.com/docs/guides/http/hot))
- [x] Scale an HTTP server across cores (`deno serve --parallel` / `reusePort`)
      ([Bun](https://bun.com/docs/guides/http/cluster))
- [x] fetch over a Unix domain socket (`Deno.createHttpClient`)
      ([Bun](https://bun.com/docs/guides/http/fetch-unix))
- [x] Streaming HTTP responses from an async iterator
      ([Bun](https://bun.com/docs/guides/http/stream-iterator))
- [x] Use Node.js streams in HTTP responses (`node:http` compat)
      ([Bun](https://bun.com/docs/guides/http/stream-node-streams-in-bun))

## WebSockets (we cover 2 of 5 task shapes)

Existing: "HTTP server: WebSockets", "Build a Realtime WebSocket Application"
(video), "Outbound WebSockets", chat app tutorial.

- [ ] Build a publish-subscribe WebSocket server
      ([Bun](https://bun.com/docs/guides/websocket/pubsub))
- [ ] Track per-socket contextual data
      ([Bun](https://bun.com/docs/guides/websocket/context))
- [ ] WebSocket message compression
      ([Bun](https://bun.com/docs/guides/websocket/compression))

## Processes (we cover most; 2 gaps)

Existing: spawn, collecting output, command line arguments, OS signals, process
information, command cancellation.

- [x] Read from stdin ([Bun](https://bun.com/docs/guides/process/stdin)) —
      `Deno.stdin` appears nowhere in examples
- [x] Communicate with a child process over IPC
      ([Bun](https://bun.com/docs/guides/process/ipc))

## Reading & writing files (we cover most; 4 gaps)

Existing: reading, writing, deleting, moving/renaming, existence checks,
watching, walking, temp files, symlinks, streaming file ops, "Stream output to a
local file", unix cat.

- [x] Get the MIME type of a file
      ([Bun](https://bun.com/docs/guides/read-file/mime))
- [x] Copy a file (`Deno.copyFile`)
      ([Bun](https://bun.com/docs/guides/write-file/file-cp)) — unused in any
      example today
- [x] Write a file incrementally with a writer
      ([Bun](https://bun.com/docs/guides/write-file/filesink))
- [x] Write to stdout (`Deno.stdout`)
      ([Bun](https://bun.com/docs/guides/write-file/stdout))

## Testing (we cover the core; ~10 task-shaped gaps)

Existing: writing tests, basics, mocking, spying, stubbing, snapshot testing,
coverage (+ threshold), BDD, web app testing, documentation tests. Bun's win
here is granularity — each discrete task is a findable page.

- [ ] Migrate from Jest to `deno test`
      ([Bun](https://bun.com/docs/guides/test/migrate-from-jest))
- [x] Run tests in watch mode
      ([Bun](https://bun.com/docs/guides/test/watch-mode))
- [x] Skip tests / mark tests as todo (`ignore`, `only`)
      ([Bun](https://bun.com/docs/guides/test/skip-tests))
- [x] Bail early on first failure (`--fail-fast`)
      ([Bun](https://bun.com/docs/guides/test/bail))
- [x] Set a per-test timeout ([Bun](https://bun.com/docs/guides/test/timeout))
- [x] Set the system time in tests (`@std/testing/time` FakeTime)
      ([Bun](https://bun.com/docs/guides/test/mock-clock))
- [x] Update snapshots (`--update`)
      ([Bun](https://bun.com/docs/guides/test/update-snapshots))
- [x] Filter and parallelize test runs
      ([Bun](https://bun.com/docs/guides/test/concurrent-test-glob))
- [x] Use Testing Library with Deno
      ([Bun](https://bun.com/docs/guides/test/testing-library))
- [x] Write browser DOM tests (deno-dom / happy-dom / linkedom)
      ([Bun](https://bun.com/docs/guides/test/happy-dom)) — partial: "Testing
      web applications"

## Utilities (we cover ~5 of ~14 task shapes)

Existing: UUIDs, ULID, hex/base64, hashing (digests), version, module metadata,
gzip *de*compression.

- [x] Hash and verify passwords (`@std`/bcrypt/argon2)
      ([Bun](https://bun.com/docs/guides/util/hash-a-password)) — we only show
      digests, never password hashing
- [x] Compress and decompress data — one page covering gzip and DEFLATE via
      CompressionStream (Bun: [gzip](https://bun.com/docs/guides/util/gzip),
      [deflate](https://bun.com/docs/guides/util/deflate))
- [x] Check if two objects are deeply equal
      ([Bun](https://bun.com/docs/guides/util/deep-equals))
- [x] Escape an HTML string
      ([Bun](https://bun.com/docs/guides/util/escape-html))
- [x] Sleep / delay execution ([Bun](https://bun.com/docs/guides/util/sleep))
- [x] Convert between file URLs and paths — one page, both directions (Bun:
      [file-url-to-path](https://bun.com/docs/guides/util/file-url-to-path),
      [path-to-file-url](https://bun.com/docs/guides/util/path-to-file-url))
- [ ] Find the path to an executable (`which`)
      ([Bun](https://bun.com/docs/guides/util/which-path-to-executable-bin))

## Runtime & tooling (5 task-shaped gaps)

- [ ] Debug Deno with VS Code / Chrome DevTools (`--inspect`)
      ([Bun](https://bun.com/docs/guides/runtime/vscode-debugger)) — exists in
      runtime reference, no task-shaped example
- [ ] Inspect memory usage with V8 heap snapshots
      ([Bun](https://bun.com/docs/guides/runtime/heap-snapshot))
- [ ] Run Deno in GitHub Actions (`setup-deno`)
      ([Bun](https://bun.com/docs/guides/runtime/cicd))
- [ ] Re-map import paths with import maps
      ([Bun](https://bun.com/docs/guides/runtime/tsconfig-paths)) — covered in
      prose, no task page
- [ ] Set the time zone for a Deno process
      ([Bun](https://bun.com/docs/guides/runtime/timezone))

## HTML processing (0 of 2)

Bun uses HTMLRewriter; Deno equivalents would use `deno-dom`/`linkedom`.

- [ ] Extract links from a webpage
      ([Bun](https://bun.com/docs/guides/html-rewriter/extract-links))
- [ ] Extract Open Graph / social meta tags from a page
      ([Bun](https://bun.com/docs/guides/html-rewriter/extract-social-meta))

## Deployment & ecosystem (we cover most; 7 gaps)

Existing: AWS Lambda, Digital Ocean, Google Cloud Run, Kinsta, Cloudflare
Workers, Deno Deploy, Docker (video + runtime reference), most frameworks
(React, Next, Fresh, Svelte, Vue, Astro, Nuxt, Qwik, Solid, Tanstack, Hono,
Express, Apollo, tRPC), and DB clients (Postgres, MySQL, Mongo, SQLite, Redis,
Prisma, Drizzle, Supabase, PlanetScale, DuckDB, Neon?).

- [ ] Deploy a Deno application on Railway
      ([Bun](https://bun.com/docs/guides/deployment/railway))
- [ ] Deploy a Deno application on Render
      ([Bun](https://bun.com/docs/guides/deployment/render))
- [ ] Create a Discord bot
      ([Bun](https://bun.com/docs/guides/ecosystem/discordjs))
- [ ] Run Deno as a daemon with systemd
      ([Bun](https://bun.com/docs/guides/ecosystem/systemd))
- [ ] Run Deno as a daemon with PM2
      ([Bun](https://bun.com/docs/guides/ecosystem/pm2))
- [ ] Add Sentry to a Deno app
      ([Bun](https://bun.com/docs/guides/ecosystem/sentry))
- [ ] Server-side render (SSR) a React component
      ([Bun](https://bun.com/docs/guides/ecosystem/ssr-react))

## Misfiled content to surface in the examples catalog (not new writing)

- [ ] Add the Docker guide (`/runtime/reference/docker/`) to the Examples
      catalog — it is our best deploy doc and is invisible from /examples/
- [ ] Add the debugging reference similarly if no new example is written

## Road to 300 (catalog expansion candidates)

Mined June 2026 by cross-referencing the @std library, web platform APIs, Deno
and node: API surfaces, and common server patterns against the existing catalog
(~238 items once open PRs land). Curated to exclude topics already covered.
Items marked (verify) need a support check before writing. Quick win first:

- [ ] Add the existing creating_and_verifying_jwt.ts example to the sidebar; it
      is published but absent from the catalog

### Server patterns (Network, highest search demand)

- [ ] Handle CORS in an HTTP server (preflight, origins, credentials)
- [ ] Set, read, and sign cookies (@std/http, HttpOnly/Secure)
- [ ] Gracefully shut down an HTTP server (signals + server.shutdown)
- [ ] Serve static files with caching headers (ETag, Cache-Control, 304s)
- [ ] Rate limit HTTP requests (token bucket per IP)
- [ ] HTTP server: Basic authentication (timing-safe comparison)
- [ ] Manage user sessions (cookie storage, expiry)
- [ ] Add OAuth login with GitHub (authorization code flow)
- [ ] Verify webhook signatures (HMAC validation)
- [ ] Health check and readiness endpoints
- [ ] Time out long-running requests on the server
- [ ] Paginate API results (offset and cursor)
- [ ] Generate an RSS feed
- [ ] Generate sitemap.xml and robots.txt
- [ ] Download a file to disk with progress
- [ ] Find a free port (@std/net getAvailablePort)
- [ ] Route fetch through an HTTP proxy (verify)

### Standard library (new category or spread across existing ones)

- [ ] Debounce a function (@std/async)
- [ ] Run async tasks with a concurrency limit (pooledMap)
- [ ] Add a timeout to any promise (deadline, abortable)
- [ ] Memoize an expensive function (@std/cache)
- [ ] Parse and compare semver versions
- [ ] Convert string case (@std/text)
- [ ] Escape special characters in regular expressions
- [ ] Parse and format dates (@std/datetime)
- [ ] Structured logging (@std/log, rotating files)
- [ ] Extract front matter from markdown files
- [ ] Format bytes and durations for humans (@std/fmt)
- [ ] Generate seeded random numbers (@std/random)

### Web standard APIs

- [ ] Match and route URLs with URLPattern
- [ ] Cancel fetch requests with AbortController
- [ ] Set a timeout on fetch with AbortSignal.timeout
- [ ] Deep clone objects with structuredClone
- [ ] Build and send forms with FormData
- [ ] Format numbers and currencies with Intl.NumberFormat
- [ ] Format dates for any locale with Intl.DateTimeFormat
- [ ] Format relative time with Intl.RelativeTimeFormat
- [ ] Pluralize and format lists with Intl.PluralRules and ListFormat
- [ ] Split text into words and sentences with Intl.Segmenter
- [ ] Measure code performance with performance marks and measures
- [ ] Create and dispatch custom events with EventTarget
- [ ] Communicate between workers with BroadcastChannel
- [ ] Cache HTTP responses with the Web Cache API
- [ ] Transform data with TransformStream

### Encoding

- [ ] Parsing and serializing INI files (@std/ini)
- [ ] Parsing JSONC (@std/jsonc)
- [ ] Parse large CSV files as streams (CsvParseStream)
- [ ] Stream JSON Lines data (NDJSON)
- [ ] Encode and decode MessagePack (@std/msgpack)
- [ ] Encode and decode CBOR (@std/cbor)
- [ ] Parse and generate XML (verify: likely third-party, not @std)
- [ ] Compress data with node:zlib

### System and FileSystem

- [ ] Pipe data into a subprocess (stdin with Deno.Command)
- [ ] Run a subprocess with custom env and working directory
- [ ] Detect a TTY and get terminal size
- [ ] Get OS information (Deno APIs and node:os)
- [ ] List network interfaces
- [ ] Set and read process exit codes
- [ ] Use EventEmitter from node:events
- [ ] Read input line by line with node:readline
- [ ] Use worker_threads in Deno
- [ ] Read and modify file metadata (stat, chmod, utime)
- [ ] Create and extract tar archives (@std/tar)
- [ ] Find files with glob patterns (expandGlob)
- [ ] Lock a file across processes (FsFile.lock)
- [ ] Truncate a file
- [ ] Create hard links

### Cryptography

- [ ] Sign and verify data with ECDSA (WebCrypto)
- [ ] Derive keys from passwords with PBKDF2 (AES key derivation)
- [ ] Generate cryptographically secure random values
- [ ] Compare secrets in constant time (timingSafeEqual)
- [ ] Hash large files with streams
- [ ] Hash and encrypt with node:crypto

### CLI and tooling

- [ ] Compile a script into a standalone executable (deno compile)
- [ ] Cross compile executables for other platforms
- [ ] Write and run benchmarks with Deno.bench (only a video exists)
- [ ] Publish a package to JSR step by step (only a video exists)
- [ ] Find and update outdated dependencies (deno outdated)
- [ ] Display progress bars and spinners (@std/cli)
- [ ] Control the terminal with ANSI escape codes
- [ ] Build a CLI with subcommands (parseArgs dispatch)

### Frameworks, deploys, and bigger tutorials

- [ ] Build a static site with Lume
- [ ] Use Vite with Deno
- [ ] Render markdown to HTML with syntax highlighting
- [ ] Server-side HTML templating (JSX precompile or Eta)
- [ ] Run Deno as a systemd service on a VPS
- [ ] Deploy Deno to Fly.io
- [ ] Vector similarity search with Postgres and pgvector
- [ ] Connection pooling for Postgres
- [ ] Build an MCP server with Deno
- [ ] Call native libraries with Deno FFI (task-shaped walkthrough)
- [ ] Build a Discord bot
- [ ] Send email over SMTP (nodemailer)
- [ ] Resize and convert images (verify library choice)
- [ ] Generate PDFs (pdf-lib)
- [ ] Generate QR codes
- [ ] Distribute work across a pool of web workers
- [ ] Automate a browser (Astral)
- [ ] Create custom OpenTelemetry spans
- [ ] Record custom OpenTelemetry metrics
- [ ] Atomic transactions in Deno KV
- [ ] Two-way streaming with WebSocketStream
- [ ] Run a compute shader with WebGPU

Excluded as already covered: FakeTime and fetch mocking (mocking tutorial),
@std/expect (testing tutorial), watch mode (hot reload example), recursive
directory copy (copy file example), debugging with DevTools (pointer card in
#3222), Angular (support unverified, low demand).

## Content consolidation candidates

- [ ] Databases: Redis, Prisma, and Mongoose each have a tutorial, a quick
      example, and/or a video covering overlapping material (now labeled "Redis"
      / "Redis quick start" / "(video)" after the relabel in #3218). Consolidate
      each product to one canonical page with the video embedded and redirect
      the retired URLs, the same way unzip_gzipped_file was folded into
      compress_decompress (#3210).

## Style follow-ups from the audit (apply when writing the above)

- [ ] Show expected terminal output after each command (Bun does this
      everywhere; doubles as reader self-verification)
- [ ] Strengthen the Postgres/database quick examples: env vars and error
      handling instead of hardcoded credentials
- [ ] Reconsider the example page layout: the two-column rendering (italic,
      right-aligned prose in a narrow left strip, code on the right) reads like
      a gimmick and makes it harder to follow what's going on than a plain
      vertical prose/code/prose/code flow. Likely fix is in
      `examples/_components/SnippetComponent.tsx` (stack prose above code, full
      width); while in there, render snippet prose backticks as `<code>` — today
      comments render as plain text, so backticks in existing examples (e.g.
      reading_files.ts) show up literally on the page.
