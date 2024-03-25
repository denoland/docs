# `deno cache`

**Purpose:** Pre-download and compile remote dependencies along with their
static imports, storing them in the local cache.

**Usage:**

- Cache a specific module and its dependencies without executing any code:
  ```
  deno cache jsr:@std/http@^0/file_server
  deno cache npm:express
  ```

**Behavior:**

- Modules cached using `deno cache` are stored in `$DENO_DIR`, a centralized
  directory. Its location varies by OS. For instance, on macOS, it's typically
  `/Users/ry/Library/Caches/deno`. You can see the location by running
  `deno info` with no arguments.
- Subsequent executions of cached modules don't require downloads or
  compilation, unless `--reload` is used to force updates.

This ensures faster execution times for scripts that have already been cached,
by avoiding unnecessary network requests and recompilation.
