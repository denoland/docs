---
title: "Standard Library (@std)"
description: "An introduction to Deno's Standard Library. Learn about TypeScript-first modules, cross-platform compatibility, versioning, package management, and how to use standard modules in your Deno projects."
oldUrl:
  - /runtime/manual/basics/standard_library/"
  - /runtime/reference/std/"
---

Deno provides a standard library written in TypeScript. It is a set of standard
modules that can be reused by programs, allowing you to focus on your
application logic rather than "reinventing the wheel" for common tasks. All of
the modules in the Deno Standard Library are audited by the core team and are
guaranteed to work with Deno, ensuring consistency and reliability.

Many packages in the Deno Standard Library are also compatible with Node.js,
Cloudflare Workers, and other JavaScript environments. This allows you to write
code that can be run in multiple environments without modification.

The standard library is hosted on JSR and is available at:
[https://jsr.io/@std](https://jsr.io/@std). Packages are documented, tested, and
include usage examples.

## Packages

<!-- packages:start -->

- [@std/assert](./assert/) – Common assertion functions, especially useful for
  testing
- [@std/async](./async/) – Utilities for asynchronous operations, like delays,
  debouncing, or pooling
- [@std/bytes](./bytes/) – Utilities to manipulate Uint8Arrays that are not
  built-in to JavaScript
- [@std/cache](./cache/) – UNSTABLE: Cache utilities
- [@std/cbor](./cbor/) – UNSTABLE: Utilities for parsing and serializing Concise
  Binary Object Representation (CBOR)
- [@std/cli](./cli/) – Tools for creating interactive command line tools
- [@std/collections](./collections/) – Pure functions for common tasks related
  to collection types like arrays and objects
- [@std/crypto](./crypto/) – Extensions to the Web Crypto API
- [@std/csv](./csv/) – Reading and writing of comma-separated values (CSV) files
- [@std/data-structures](./data-structures/) – Common data structures like
  red-black trees and binary heaps
- [@std/datetime](./datetime/) – UNSTABLE: Utilities for dealing with Date
  objects
- [@std/dotenv](./dotenv/) – UNSTABLE: Parsing and loading environment variables
  from a `.env` file
- [@std/encoding](./encoding/) – Utilities for encoding and decoding common
  formats like hex, base64, and varint
- [@std/expect](./expect/) – Jest compatible `expect` assertion functions
- [@std/fmt](./fmt/) – Utilities for formatting values, such as adding colors to
  text, formatting durations, printf utils, formatting byte numbers.
- [@std/front-matter](./front-matter/) – Extract front matter from strings
- [@std/fs](./fs/) – Helpers for working with the file system
- [@std/html](./html/) – Functions for HTML, such as escaping or unescaping HTML
  entities
- [@std/http](./http/) – Utilities for building HTTP servers
- [@std/ini](./ini/) – UNSTABLE: Parsing and serializing of INI files
- [@std/internal](./internal/) – INTERNAL: The internal package for @std. Do not
  use this directly.
- [@std/io](./io/) – UNSTABLE: The utilities for advanced I/O operations using
  Reader and Writer interfaces.
- [@std/json](./json/) – (Streaming) parsing and serializing of JSON files
- [@std/jsonc](./jsonc/) – Parsing and serializing of JSONC files
- [@std/log](./log/) – UNSTABLE: A customizable logger framework
- [@std/math](./math/) – Basic math utilities
- [@std/media-types](./media-types/) – Utility functions for media types (MIME
  types)
- [@std/msgpack](./msgpack/) – Encoding and decoding for the msgpack format
- [@std/net](./net/) – Utilities for working with the network
- [@std/path](./path/) – Utilities for working with file system paths
- [@std/random](./random/) – UNSTABLE: Various utilities using random number
  generators. The package also provides seeded pseudo-random number generator.
- [@std/regexp](./regexp/) – Utilities for working with RegExp
- [@std/semver](./semver/) – Parsing and comparing of semantic versions (SemVer)
- [@std/streams](./streams/) – Utilities for working with the Web Streams API
- [@std/tar](./tar/) – UNSTABLE: Streaming utilities for working with tar
  archives.
- [@std/testing](./testing/) – Tools for testing Deno code like snapshot
  testing, bdd testing, and time mocking
- [@std/text](./text/) – Utilities for working with text
- [@std/toml](./toml/) – Parsing and serializing of TOML files
- [@std/ulid](./ulid/) – Generation of Universally Unique Lexicographically
  Sortable Identifiers (ULIDs)
- [@std/uuid](./uuid/) – Generators and validators for UUIDs
- [@std/webgpu](./webgpu/) – UNSTABLE: Utilities for working with the Web GPU
  API
- [@std/yaml](./yaml/) – Parsing and serializing of YAML files

<!-- packages:end -->

## Versioning and stability

Each package of the standard library is independently versioned. Packages follow
[semantic versioning rules](https://jsr.io/@std/semver). You can use
[version pinning or version ranges](/runtime/fundamentals/modules/#package-versions)
to prevent major releases from affecting your code.

## Importing standard library modules

To install packages from the Deno Standard Library, you can use the `deno add`
subcommand to add the package to your `deno.json` import map.

```sh
deno add jsr:@std/fs jsr:@std/path
```

The `deno.json` `imports` field will be updated to include those imports:

```json
{
  "imports": {
    "@std/fs": "jsr:@std/fs@^1.0.2",
    "@std/path": "jsr:@std/path@^1.0.3"
  }
}
```

You can then import these packages in your source code:

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```

Alternatively, you can import modules directly with the `jsr:` specifier:

```js
import { copy } from "jsr:@std/fs@^1.0.2";
import { join } from "jsr:@std/path@^1.0.3";

await copy("foo.txt", join("dist", "foo.txt"));
```

## Node.js compatibility

The Deno Standard Library is designed to be compatible with Node.js, Cloudflare
Workers, and other JavaScript environments. The standard library is written in
TypeScript and compiled to JavaScript, so it can be used in any JavaScript
environment.

```sh
npx jsr add @std/fs @std/path
```

Running this command will add those packages to your `package.json`:

```json
{
  "dependencies": {
    "@std/fs": "npm:@jsr/std__fs@^1.0.2",
    "@std/path": "npm:@jsr/std__path@^1.0.3"
  }
}
```

Then you can import them in your source code, just like you would with any other
Node.js package. TypeScript will automatically find the type definitions for
these packages.

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```
