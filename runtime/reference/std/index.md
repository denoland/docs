---
title: "Deno Standard Library (@std)"
description: "Overview and guides for the modular Deno standard library packages on JSR."
---

The Deno standard library is published as a set of modular JSR packages under the `@std` scope.

## Packages

- [@std/assert](./assert/) – Common assertion functions, especially useful for testing
- [@std/async](./async/) – Utilities for asynchronous operations, like delays, debouncing, or pooling
- [@std/bytes](./bytes/) – Utilities to manipulate Uint8Arrays that are not built-in to JavaScript
- [@std/cache](./cache/) – UNSTABLE: Cache utilities
- [@std/cbor](./cbor/) – UNSTABLE: Utilities for parsing and serializing Concise Binary Object Representation (CBOR)
- [@std/cli](./cli/) – Tools for creating interactive command line tools
- [@std/collections](./collections/) – Pure functions for common tasks related to collection types like arrays and objects
- [@std/crypto](./crypto/) – Extensions to the Web Crypto API
- [@std/csv](./csv/) – Reading and writing of comma-separated values (CSV) files
- [@std/data-structures](./data-structures/) – Common data structures like red-black trees and binary heaps
- [@std/datetime](./datetime/) – UNSTABLE: Utilities for dealing with Date objects
- [@std/dotenv](./dotenv/) – UNSTABLE: Parsing and loading environment variables from a `.env` file
- [@std/encoding](./encoding/) – Utilities for encoding and decoding common formats like hex, base64, and varint
- [@std/expect](./expect/) – Jest compatible `expect` assertion functions
- [@std/fmt](./fmt/) – Utilities for formatting values, such as adding colors to text, formatting durations, printf utils, formatting byte numbers.
- [@std/front-matter](./front-matter/) – Extract front matter from strings
- [@std/fs](./fs/) – Helpers for working with the file system
- [@std/html](./html/) – Functions for HTML, such as escaping or unescaping HTML entities
- [@std/http](./http/) – Utilities for building HTTP servers
- [@std/ini](./ini/) – UNSTABLE: Parsing and serializing of INI files
- [@std/internal](./internal/) – INTERNAL: The internal package for @std. Do not use this directly.
- [@std/io](./io/) – UNSTABLE: The utilities for advanced I/O operations using Reader and Writer interfaces.
- [@std/json](./json/) – (Streaming) parsing and serializing of JSON files
- [@std/jsonc](./jsonc/) – Parsing and serializing of JSONC files
- [@std/log](./log/) – UNSTABLE: A customizable logger framework
- [@std/media-types](./media-types/) – Utility functions for media types (MIME types)
- [@std/msgpack](./msgpack/) – Encoding and decoding for the msgpack format
- [@std/net](./net/) – Utilities for working with the network
- [@std/path](./path/) – Utilities for working with file system paths
- [@std/random](./random/) – UNSTABLE: Various utilities using random number generators. The package also provides seeded pseudo-random number generator.
- [@std/regexp](./regexp/) – Utilities for working with RegExp
- [@std/semver](./semver/) – Parsing and comparing of semantic versions (SemVer)
- [@std/streams](./streams/) – Utilities for working with the Web Streams API
- [@std/tar](./tar/) – UNSTABLE: Streaming utilities for working with tar archives.
- [@std/testing](./testing/) – Tools for testing Deno code like snapshot testing, bdd testing, and time mocking
- [@std/text](./text/) – Utilities for working with text
- [@std/toml](./toml/) – Parsing and serializing of TOML files
- [@std/ulid](./ulid/) – Generation of Universally Unique Lexicographically Sortable Identifiers (ULIDs)
- [@std/uuid](./uuid/) – Generators and validators for UUIDs
- [@std/webgpu](./webgpu/) – UNSTABLE: Utilities for working with the Web GPU API
- [@std/yaml](./yaml/) – Parsing and serializing of YAML files

> This index and the individual package overview sections are generated. Add extra examples by creating files in `_overrides/<package>.md`.