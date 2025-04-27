---
title: "Contributing and support"
description: "Guide to contributing to the Deno project and ecosystem. Learn about different Deno repositories, contribution guidelines, and how to submit effective pull requests."
oldUrl:
  - /runtime/manual/contributing/
  - /runtime/manual/contributing/contribute
  - /runtime/manual/references/contributing/
  - /runtime/contributing/contribute/
---

We welcome and appreciate all contributions to Deno.

This page serves as a helper to get you started on contributing.

## Projects

There are numerous repositories in the [`denoland`](https://github.com/denoland)
organization that are part of the Deno ecosystem.

Repositories have different scopes, use different programming languages and have
varying difficulty level when it comes to contributions.

To help you decide which repository might be the best to start contributing
(and/or falls into your interest), here's a short comparison (**codebases
primarily comprise the languages in bold**):

### [deno](https://github.com/denoland/deno)

This is the main repository that provides the `deno` CLI.

Languages: **Rust**, **JavaScript**, **TypeScript**

### [deno_std](https://github.com/denoland/deno_std)

The standard library for Deno.

Languages: **TypeScript**, WebAssembly

### [fresh](https://github.com/denoland/fresh)

The next-gen web framework.

Languages: **TypeScript**, TSX

### [deno_lint](https://github.com/denoland/deno_lint)

Linter that powers `deno lint` subcommand.

Languages: **Rust**

### [deno_doc](https://github.com/denoland/deno_doc)

Documentation generator that powers `deno doc` subcommand, and reference
documentation on https://docs.deno.com/api, and https://jsr.io.

Languages: **Rust**

### [rusty_v8](https://github.com/denoland/rusty_v8)

Rust bindings for the V8 JavaScript engine. Very technical and low-level.

Languages: **Rust**

### [serde_v8](https://github.com/denoland/deno_core/tree/main/serde_v8)

Library that provides bijection layer between V8 and Rust objects. Based on
[`serde`](https://crates.io/crates/serde) library. Very technical and low-level.

Languages: **Rust**

### [deno_docker](https://github.com/denoland/deno_docker)

Official Docker images for Deno.

## General remarks

- Read the [style guide](/runtime/contributing/style_guide).

- Please don't make [the benchmarks](https://deno.land/benchmarks) worse.

- Ask for help in the [community chat room](https://discord.gg/deno).

- If you are going to work on an issue, mention so in the issue's comments
  _before_ you start working on the issue.

- If you are going to work on a new feature, create an issue and discuss with
  other contributors _before_ you start working on the feature; we appreciate
  all contributions but not all proposed features will be accepted. We don't
  want you to spend hours working on code that might not be accepted.

- Please be professional in the forums. We follow
  [Rust's code of conduct](https://www.rust-lang.org/policies/code-of-conduct)
  (CoC). Have a problem? Email [ry@tinyclouds.org](mailto:ry@tinyclouds.org).

## Submitting a pull request

Before submitting a PR to any of the repos, please make sure the following is
done:

1. Give the PR a descriptive title.

Examples of good PR title:

- fix(std/http): Fix race condition in server
- docs(console): Update docstrings
- feat(doc): Handle nested re-exports

Examples of bad PR title:

- fix #7123
- update docs
- fix bugs

2. Ensure there is a related issue and that it is referenced in the PR text.
3. Ensure there are tests that cover the changes.

## Documenting APIs

It is important to document all public APIs and we want to do that inline with
the code. This helps ensure that code and documentation are tightly coupled
together.

### JavaScript and TypeScript

All publicly exposed APIs and types, both via the `deno` module as well as the
global/`window` namespace should have JSDoc documentation. This documentation is
parsed and available to the TypeScript compiler, and therefore easy to provide
further downstream. JSDoc blocks come just prior to the statement they apply to
and are denoted by a leading `/**` before terminating with a `*/`. For example:

```ts
/** A simple JSDoc comment */
export const FOO = "foo";
```

Find more at: https://jsdoc.app/

### Rust

Use
[this guide](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html)
for writing documentation comments in Rust code.
