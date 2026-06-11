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
- [ ] Convert a Node.js Readable — sections: to string, JSON, Blob, Uint8Array,
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

- [ ] Configure TLS/HTTPS on an HTTP server
      ([Bun](https://bun.com/docs/guides/http/tls)) — we only have a raw
      `tls_listener` example
- [ ] Server-Sent Events (SSE) ([Bun](https://bun.com/docs/guides/http/sse))
- [ ] Proxy HTTP requests using fetch
      ([Bun](https://bun.com/docs/guides/http/proxy))
- [ ] Hot reload an HTTP server with `deno serve`/`--watch`
      ([Bun](https://bun.com/docs/guides/http/hot))
- [ ] Scale an HTTP server across cores (`deno serve --parallel` / `reusePort`)
      ([Bun](https://bun.com/docs/guides/http/cluster))
- [ ] fetch over a Unix domain socket (`Deno.createHttpClient`)
      ([Bun](https://bun.com/docs/guides/http/fetch-unix))
- [ ] Streaming HTTP responses from an async iterator
      ([Bun](https://bun.com/docs/guides/http/stream-iterator))
- [ ] Use Node.js streams in HTTP responses (`node:http` compat)
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

- [ ] Read from stdin ([Bun](https://bun.com/docs/guides/process/stdin)) —
      `Deno.stdin` appears nowhere in examples
- [ ] Communicate with a child process over IPC
      ([Bun](https://bun.com/docs/guides/process/ipc))

## Reading & writing files (we cover most; 4 gaps)

Existing: reading, writing, deleting, moving/renaming, existence checks,
watching, walking, temp files, symlinks, streaming file ops, "Stream output to a
local file", unix cat.

- [ ] Get the MIME type of a file
      ([Bun](https://bun.com/docs/guides/read-file/mime))
- [ ] Copy a file (`Deno.copyFile`)
      ([Bun](https://bun.com/docs/guides/write-file/file-cp)) — unused in any
      example today
- [ ] Write a file incrementally with a writer
      ([Bun](https://bun.com/docs/guides/write-file/filesink))
- [ ] Write to stdout (`Deno.stdout`)
      ([Bun](https://bun.com/docs/guides/write-file/stdout))

## Testing (we cover the core; ~10 task-shaped gaps)

Existing: writing tests, basics, mocking, spying, stubbing, snapshot testing,
coverage (+ threshold), BDD, web app testing, documentation tests. Bun's win
here is granularity — each discrete task is a findable page.

- [ ] Migrate from Jest to `deno test`
      ([Bun](https://bun.com/docs/guides/test/migrate-from-jest))
- [ ] Run tests in watch mode
      ([Bun](https://bun.com/docs/guides/test/watch-mode))
- [ ] Skip tests / mark tests as todo (`ignore`, `only`)
      ([Bun](https://bun.com/docs/guides/test/skip-tests))
- [ ] Bail early on first failure (`--fail-fast`)
      ([Bun](https://bun.com/docs/guides/test/bail))
- [ ] Set a per-test timeout ([Bun](https://bun.com/docs/guides/test/timeout))
- [ ] Set the system time in tests (`@std/testing/time` FakeTime)
      ([Bun](https://bun.com/docs/guides/test/mock-clock))
- [ ] Update snapshots (`--update`)
      ([Bun](https://bun.com/docs/guides/test/update-snapshots))
- [ ] Filter and parallelize test runs
      ([Bun](https://bun.com/docs/guides/test/concurrent-test-glob))
- [ ] Use Testing Library with Deno
      ([Bun](https://bun.com/docs/guides/test/testing-library))
- [ ] Write browser DOM tests (deno-dom / happy-dom / linkedom)
      ([Bun](https://bun.com/docs/guides/test/happy-dom)) — partial: "Testing
      web applications"

## Utilities (we cover ~5 of ~14 task shapes)

Existing: UUIDs, ULID, hex/base64, hashing (digests), version, module metadata,
gzip *de*compression.

- [ ] Hash and verify passwords (`@std`/bcrypt/argon2)
      ([Bun](https://bun.com/docs/guides/util/hash-a-password)) — we only show
      digests, never password hashing
- [ ] Compress and decompress data — one page covering gzip and DEFLATE via
      CompressionStream (Bun: [gzip](https://bun.com/docs/guides/util/gzip),
      [deflate](https://bun.com/docs/guides/util/deflate))
- [ ] Check if two objects are deeply equal
      ([Bun](https://bun.com/docs/guides/util/deep-equals))
- [ ] Escape an HTML string
      ([Bun](https://bun.com/docs/guides/util/escape-html))
- [ ] Sleep / delay execution ([Bun](https://bun.com/docs/guides/util/sleep))
- [ ] Convert between file URLs and paths — one page, both directions (Bun:
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
