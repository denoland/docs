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

- [x] Add a dependency with `deno add` (jsr: and npm:)
      ([Bun](https://bun.com/docs/guides/install/add))
- [x] Manage dev-only dependencies in a Deno project
      ([Bun](https://bun.com/docs/guides/install/add-dev))
- [x] Use a Git repository as a dependency
      ([Bun](https://bun.com/docs/guides/install/add-git))
- [x] Use a tarball/local path as a dependency
      ([Bun](https://bun.com/docs/guides/install/add-tarball))
- [x] Allow npm lifecycle scripts (`--allow-scripts`)
      ([Bun](https://bun.com/docs/guides/install/trusted))
- [x] Configure a private npm registry / org scope (`.npmrc`,
      `DENO_AUTH_TOKENS`)
      ([Bun](https://bun.com/docs/guides/install/registry-scope))
- [x] Override the default npm registry
      ([Bun](https://bun.com/docs/guides/install/custom-registry))
- [x] Use Deno with an Azure Artifacts npm registry
      ([Bun](https://bun.com/docs/guides/install/azure-artifacts))
- [x] Use Deno with JFrog Artifactory
      ([Bun](https://bun.com/docs/guides/install/jfrog-artifactory))
- [x] Configure a monorepo using Deno workspaces
      ([Bun](https://bun.com/docs/guides/install/workspaces))
- [x] Understand and review `deno.lock` in git diffs
      ([Bun](https://bun.com/docs/guides/install/git-diff-bun-lockfile))
- [x] Alias a package under a different import name
      ([Bun](https://bun.com/docs/guides/install/npm-alias))
- [x] Install dependencies in GitHub Actions (`setup-deno` + caching)
      ([Bun](https://bun.com/docs/guides/install/cicd))
- [x] Migrate a project from `npm install` to Deno
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

- [x] Build a publish-subscribe WebSocket server
      ([Bun](https://bun.com/docs/guides/websocket/pubsub))
- [x] Track per-socket contextual data
      ([Bun](https://bun.com/docs/guides/websocket/context))
- [x] WebSocket message compression
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
- [x] Find the path to an executable (`which`)
      ([Bun](https://bun.com/docs/guides/util/which-path-to-executable-bin))

## Runtime & tooling (5 task-shaped gaps)

- [x] Debug Deno with VS Code / Chrome DevTools (`--inspect`)
      ([Bun](https://bun.com/docs/guides/runtime/vscode-debugger)) — exists in
      runtime reference, no task-shaped example
- [x] Inspect memory usage with V8 heap snapshots
      ([Bun](https://bun.com/docs/guides/runtime/heap-snapshot))
- [x] Run Deno in GitHub Actions (`setup-deno`)
      ([Bun](https://bun.com/docs/guides/runtime/cicd))
- [x] Re-map import paths with import maps
      ([Bun](https://bun.com/docs/guides/runtime/tsconfig-paths)) — covered in
      prose, no task page
- [x] Set the time zone for a Deno process
      ([Bun](https://bun.com/docs/guides/runtime/timezone))

## HTML processing (0 of 2)

Bun uses HTMLRewriter; Deno equivalents would use `deno-dom`/`linkedom`.

- [x] Extract links from a webpage
      ([Bun](https://bun.com/docs/guides/html-rewriter/extract-links))
- [x] Extract Open Graph / social meta tags from a page
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

- [x] Add the Docker guide (`/runtime/reference/docker/`) to the Examples
      catalog — it is our best deploy doc and is invisible from /examples/
- [x] Add the debugging reference similarly if no new example is written

## Road to 300 (catalog expansion candidates)

Mined June 2026 by cross-referencing the @std library, web platform APIs, Deno
and node: API surfaces, and common server patterns against the existing catalog
(~238 items once open PRs land). Curated to exclude topics already covered.
Items marked (verify) need a support check before writing. Quick win first:

- [x] Add the existing creating_and_verifying_jwt.ts example to the sidebar; it
      is published but absent from the catalog

### Server patterns (Network, highest search demand)

- [x] Handle CORS in an HTTP server (preflight, origins, credentials)
- [x] Set, read, and sign cookies (@std/http, HttpOnly/Secure)
- [x] Gracefully shut down an HTTP server (signals + server.shutdown)
- [x] Serve static files with caching headers (ETag, Cache-Control, 304s)
- [x] Rate limit HTTP requests (token bucket per IP)
- [x] HTTP server: Basic authentication (timing-safe comparison)
- [x] Manage user sessions (cookie storage, expiry)
- [ ] Add OAuth login with GitHub (authorization code flow)
- [x] Verify webhook signatures (HMAC validation)
- [x] Health check and readiness endpoints
- [x] Time out long-running requests on the server
- [x] Paginate API results (offset and cursor)
- [x] Generate an RSS feed
- [x] Generate sitemap.xml and robots.txt
- [x] Download a file to disk with progress
- [x] Find a free port (@std/net getAvailablePort)
- [x] Route fetch through an HTTP proxy (verify)

### Standard library (new category or spread across existing ones)

- [x] Debounce a function (@std/async)
- [x] Run async tasks with a concurrency limit (pooledMap)
- [x] Add a timeout to any promise (deadline, abortable)
- [x] Memoize an expensive function (@std/cache)
- [x] Parse and compare semver versions
- [x] Convert string case (@std/text)
- [x] Escape special characters in regular expressions
- [x] Parse and format dates (@std/datetime)
- [x] Structured logging (@std/log, rotating files)
- [x] Extract front matter from markdown files (PR #3238)
- [x] Format bytes and durations for humans (@std/fmt)
- [x] Generate seeded random numbers (@std/random) (PR #3238)

### Web standard APIs

- [x] Match and route URLs with URLPattern
- [x] Cancel fetch requests with AbortController
- [x] Set a timeout on fetch with AbortSignal.timeout
- [x] Deep clone objects with structuredClone
- [x] Build and send forms with FormData
- [x] Format numbers and currencies with Intl.NumberFormat
- [x] Format dates for any locale with Intl.DateTimeFormat
- [x] Format relative time with Intl.RelativeTimeFormat
- [x] Pluralize and format lists with Intl.PluralRules and ListFormat
- [x] Split text into words and sentences with Intl.Segmenter
- [x] Measure code performance with performance marks and measures
- [x] Create and dispatch custom events with EventTarget
- [x] Communicate between workers with BroadcastChannel
- [x] Cache HTTP responses with the Web Cache API
- [x] Transform data with TransformStream

### Encoding

- [x] Parsing and serializing INI files (@std/ini)
- [x] Parsing JSONC (@std/jsonc)
- [x] Parse large CSV files as streams (CsvParseStream)
- [x] Stream JSON Lines data (NDJSON)
- [x] Encode and decode MessagePack (@std/msgpack)
- [x] Encode and decode CBOR (@std/cbor)
- [x] Parse and generate XML (@libs/xml from JSR) (PR #3238)
- [x] Compress data with node:zlib

### System and FileSystem

- [x] Pipe data into a subprocess (stdin with Deno.Command)
- [x] Run a subprocess with custom env and working directory
- [x] Detect a TTY and get terminal size
- [x] Get OS information (Deno APIs and node:os)
- [x] List network interfaces
- [x] Set and read process exit codes
- [x] Use EventEmitter from node:events
- [x] Read input line by line with node:readline
- [x] Use worker_threads in Deno
- [x] Read and modify file metadata (stat, chmod, utime)
- [x] Create and extract tar archives (@std/tar)
- [x] Find files with glob patterns (expandGlob)
- [x] Lock a file across processes (FsFile.lock)
- [x] Truncate a file
- [x] Create hard links

### Cryptography

- [x] Sign and verify data with ECDSA (WebCrypto)
- [x] Derive keys from passwords with PBKDF2 (AES key derivation)
- [x] Generate cryptographically secure random values
- [x] Compare secrets in constant time (timingSafeEqual)
- [x] Hash large files with streams
- [x] Hash and encrypt with node:crypto

### CLI and tooling

- [x] Compile a script into a standalone executable (deno compile)
- [x] Cross compile executables for other platforms
- [x] Write and run benchmarks with Deno.bench (only a video exists)
- [x] Publish a package to JSR step by step (covered by an existing docs page; example tutorial dropped from #3238 in review)
- [x] Find and update outdated dependencies (deno outdated)
- [x] Display progress bars and spinners (@std/cli)
- [x] Control the terminal with ANSI escape codes
- [x] Build a CLI with subcommands (parseArgs dispatch)

### Frameworks, deploys, and bigger tutorials

- [ ] Build a static site with Lume
- [ ] Use Vite with Deno
- [x] Render markdown to HTML with syntax highlighting (@deno/gfm) (#3251)
- [x] Server-side HTML templating with Eta (#3251)
- [ ] Run Deno as a systemd service on a VPS
- [ ] Deploy Deno to Fly.io
- [ ] Vector similarity search with Postgres and pgvector
- [ ] Connection pooling for Postgres
- [x] Build an MCP server with Deno (#3251)
- [x] Call native libraries with Deno FFI (quick example: dlopen, UnsafeCallback) (PR #3238)
- [ ] Build a Discord bot
- [ ] Send email over SMTP (nodemailer)
- [x] Resize and convert images (sharp) (#3251)
- [x] Generate PDFs (pdf-lib) (#3251)
- [x] Generate QR codes (@libs/qrcode) (#3251)
- [x] Distribute work across a pool of web workers (PR #3238)
- [ ] Automate a browser (Astral)
- [x] Create custom OpenTelemetry spans (already covered by the basic OpenTelemetry setup tutorial; not duplicated)
- [x] Record custom OpenTelemetry metrics (already covered by the basic OpenTelemetry setup tutorial; not duplicated)
- [x] Atomic transactions in Deno KV (PR #3238)
- [x] Two-way streaming with WebSocketStream (PR #3238)
- [x] Run a compute shader with WebGPU (PR #3238)
- [x] Bundle code with Deno.bundle (from API coverage analysis) (PR #3238)
- [x] Rich output in Jupyter notebooks (Deno.jupyter) (PR #3238)
- [x] Upgrade a TCP connection to TLS with Deno.startTls (PR #3238)
- [x] Communicate over QUIC (PR #3238)
- [x] Connect two peers with WebTransport (PR #3238)

Excluded as already covered: FakeTime and fetch mocking (mocking tutorial),
@std/expect (testing tutorial), watch mode (hot reload example), recursive
directory copy (copy file example), debugging with DevTools (pointer card in
#3222), Angular (support unverified, low demand).

## Content consolidation candidates

- [x] Databases: Redis, Prisma, and Mongoose each have a tutorial, a quick
      example, and/or a video covering overlapping material (now labeled "Redis"
      / "Redis quick start" / "(video)" after the relabel in #3218). Done in
      #3249: the Mongoose and Prisma video pages were retired (URLs redirect to
      the written tutorials, videos stay on the YouTube channel) since the
      recordings predate and risk contradicting the tutorials. Redis keeps both
      pages (quick start vs caching tutorial cover different ground) and now
      cross-links them.

## Style follow-ups from the audit (apply when writing the above)

- [x] Show expected terminal output after each command (doubles as reader
      self-verification). Applied to the project-init tutorial in #3249 (real
      captured output of deno init, deno task dev, deno test); apply to more
      tutorials as they are touched.
- [x] Strengthen the Postgres/database quick examples: env vars and error
      handling instead of hardcoded credentials. Done in #3249 (PG* env vars
      with localhost fallbacks, .env / --env-file note, error code reporting,
      pool closed in finally).
- [ ] Reconsider the example page layout: the two-column rendering (italic,
      right-aligned prose in a narrow left strip, code on the right) reads like
      a gimmick and makes it harder to follow what's going on than a plain
      vertical prose/code/prose/code flow. Likely fix is in
      `examples/_components/SnippetComponent.tsx` (stack prose above code, full
      width); while in there, render snippet prose backticks as `<code>` — today
      comments render as plain text, so backticks in existing examples (e.g.
      reading_files.ts) show up literally on the page.
