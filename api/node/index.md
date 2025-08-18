---
title: "Node.js Built-in APIs"
description: "Complete reference for Node.js built-in modules and globals supported in Deno. Explore Node.js APIs including fs, http, crypto, process, buffer, and more with compatibility information."
layout: doc.tsx
oldUrl:
  - /runtime/manual/node/compatibility/
  - /runtime/manual/npm_nodejs/compatibility_mode/
---

Deno provides comprehensive support for Node.js built-in modules and globals,
enabling seamless migration of Node.js applications and libraries. These APIs
follow Node.js specifications and provide familiar functionality for developers
transitioning from Node.js.



## Key Features

- **Built-in Module Support**: Access Node.js modules using `node:` prefix
  (e.g., `import fs from "node:fs"`)
- **Global Objects**: Node.js global objects available in npm package scope
- **Compatibility Layer**: Seamless interoperability with existing Node.js code
- **Performance**: Native implementations optimized for Deno runtime

## Core Modules

### File System

- **`node:fs`** - File system operations (read, write, watch, stats)
- **`node:fs/promises`** - Promise-based file system API
- **`node:path`** - Cross-platform path utilities

### Network & HTTP

- **`node:http`** - HTTP server and client functionality
- **`node:https`** - HTTPS server and client with TLS support
- **`node:http2`** - HTTP/2 server and client implementation
- **`node:net`** - TCP networking utilities
- **`node:dns`** - DNS resolution and lookup functions

### Process & System

- **`node:process`** - Process information and control
- **`node:os`** - Operating system utilities and information
- **`node:child_process`** - Spawn and manage child processes
- **`node:cluster`** - Multi-process clustering support

### Crypto & Security

- **`node:crypto`** - Cryptographic functionality (hashing, encryption,
  certificates)
- **`node:tls`** - TLS/SSL secure communication layer

### Data & Streams

- **`node:stream`** - Stream interfaces (readable, writable, transform)
- **`node:buffer`** - Binary data handling with Buffer class
- **`node:zlib`** - Data compression and decompression
- **`node:string_decoder`** - Decode buffers to strings

### Utilities

- **`node:util`** - Utility functions (promisify, inspect, types)
- **`node:events`** - Event emitter pattern implementation
- **`node:url`** - URL parsing and formatting utilities
- **`node:querystring`** - Query string utilities
- **`node:assert`** - Assertion testing support

### Development & Testing

- **`node:vm`** - Virtual machine contexts for code execution
- **`node:repl`** - Read-Eval-Print Loop functionality
- **`node:inspector`** - V8 inspector integration for debugging

## Global Objects

Node.js global objects are available in the npm package scope and can be
imported from relevant `node:` modules:

- **`Buffer`** - Binary data manipulation
- **`process`** - Process information and environment
- **`global`** - Global namespace object
- **`__dirname`** / **`__filename`** - Module path information
- **Web Standards** - `fetch`, `URL`, `TextEncoder`, `crypto`, and more

## Usage Examples

### Basic Module Import

```javascript
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Synchronous file reading
const data = fs.readFileSync("file.txt", "utf8");

// Asynchronous file reading
const content = await readFile("file.txt", "utf8");

// Path manipulation
const fullPath = path.join("/users", "documents", "file.txt");
```

### HTTP Server

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js API in Deno!");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Crypto Operations

```javascript
import crypto from "node:crypto";

// Generate hash
const hash = crypto.createHash("sha256");
hash.update("Hello World");
const digest = hash.digest("hex");

// Generate random bytes
const randomBytes = crypto.randomBytes(16);
```

## Compatibility

Node compatibility is an ongoing project. Most core Node.js APIs are supported
with high fidelity. For detailed compatibility information:

- View our [Node.js compatibility guide](/runtime/reference/node_apis/)
- Check [Node.js test results](https://node-test-viewer.deno.dev/) for specific
  test coverage
- [Report compatibility issues](https://github.com/denoland/deno/issues) on
  GitHub

## Migration from Node.js

When migrating from Node.js to Deno:

1. **Update imports**: Use `node:` prefix for built-in modules
2. **Check compatibility**: Verify your dependencies work with Deno
3. **Use npm specifiers**: Import npm packages with `npm:` prefix
4. **Review permissions**: Configure Deno's permission system as needed

For more guidance, see our
[migration guide](/runtime/reference/migration_guide/).
