---
title: "Stability"
oldUrl: /runtime/manual/runtime/stability/
---

As of Deno 1.0.0, the `Deno` namespace APIs are stable. That means we will
strive to make code working under 1.0.0 continue to work in future versions.

When introducing new APIs, these are first marked as unstable. This means that
the API may change in the future. These APIs are not available to use unless you
explicitly pass an unstable flag, like `--unstable-kv`.
[Learn more about `--unstable-*` flags](/runtime/reference/cli/unstable_flags).

There are also some non-runtime features of Deno that are considered unstable,
and are locked behind unstable flags. For example, the
`--unstable-sloppy-imports` flag is used to enable `import`ing code without
specifying file extensions.

## Standard library

The Deno Standard Library (https://jsr.io/@std) is partially stable. All
standard library modules that are version 1.0.0 or higher are considered stable.
All other modules (0.x) are considered unstable, and may change in the future.

Using unstable standard library modules is not recommended for production code,
but it is a great way to experiment with new features and provide feedback to
the Deno team. It is not necessary to use any unstable flags to use unstable
standard library modules.
