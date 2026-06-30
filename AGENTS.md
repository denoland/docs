# Working on the Deno docs

This repository builds [docs.deno.com](https://docs.deno.com), a
[Lume](https://lume.land/) static site. This file lays out the ground rules for
agents and contributors making changes. For the full developer guide (local
setup, search, API reference generation) see [README.md](./README.md).

## Project layout

Content lives in a few top-level folders:

- `runtime/` - Deno CLI and runtime docs
- `deploy/` - Deno Deploy docs
- `subhosting/` - Deno Subhosting docs
- `examples/` - the [Examples](https://docs.deno.com/examples) section
- `ai/`, `sandbox/` - additional product sections

Most pages are markdown processed as MDX, so JSX syntax works inside `.md`
files. Left navigation for each section is configured in the `_data.ts` file in
that section's directory (for example `runtime/_data.ts`).

CLI commands each get a reference page under `runtime/reference/cli/`. The
generated API reference served at `/api` comes from `deno doc` over the Deno
source, not from files here.

## Before you open a pull request

Run these locally and make sure they pass:

```console
deno fmt          # format markdown, TypeScript, and JSON
deno lint         # lint the codebase
deno task test    # frontmatter, sidebar, and API link tests
```

The build must also succeed without broken links or invalid MDX:

```console
deno task build:light
```

Open small fixes as pull requests against `main` directly. For larger changes,
file a GitHub issue first to get feedback on the shape before writing the docs.

## Content rules

These are enforced in review and, where noted, in CI.

### Keep `last_modified` fresh

Every content page carries a `last_modified: YYYY-MM-DD` field in its
frontmatter. Whenever you change a page, bump that date to the day of the change
in the same pull request. CI enforces this: `frontmatter_test` checks that every
page has a valid `last_modified`, and the Freshness workflow fails when a page
is edited without bumping it. Check your branch with:

```console
deno task check:freshness
```

### Guides teach, reference enumerates

A topic's depth lives in exactly one place. Guide pages (like `/runtime/test/`)
teach the opinionated path with minimal flags and link out for detail. Reference
pages (under `/runtime/reference/`) enumerate every flag, field, and option.
Don't repeat flag documentation in a guide: link to the reference instead. A
guide may include at most one summary table when it links to the full reference.

### Mark version-specific behavior

When documenting behavior added or changed in a specific Deno version, say so
where it's documented: an info admonition titled with the version
(`:::info Deno 2.8`) for a callout, or an inline "(Deno 2.8+)" for a brief
mention. Don't version-mark behavior older than the previous major release.

### Formatting and prose style

- Run `deno fmt` before committing. Generated content and hand-written prose
  both need to pass formatting; wrap long lines so they survive the format step.
- CLI command page titles must be exactly the command name (for example
  `deno run`); put descriptions in the `description` frontmatter field.
- Frontmatter titles must not contain backticks.
- Prefer plain sentences and colons over em-dash joins.

## Examples

Examples in `examples/scripts/` are single TypeScript files, no more than 50
lines, self-contained, and runnable with only Deno builtins and the standard
library. Each starts with a JSDoc comment carrying `@title`, `@difficulty`,
`@tags`, `@run`, and `@group` pragmas. Introduce at most one or two concepts per
example and keep the code easy to read. See the Examples section of
[README.md](./README.md) for the full pragma reference.
