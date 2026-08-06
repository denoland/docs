---
last_modified: 2026-07-16
title: "Stability and releases"
description: "Guide to Deno's stability guarantees and release process. Covering release channels, long-term support (LTS), unstable features, versioning policy, and how Deno maintains backward compatibility."
oldUrl:
  - /runtime/manual/runtime/stability/
  - /runtime/fundamentals/stability/
---

As of Deno 1.0.0, the `Deno` namespace APIs are stable. That means we will
strive to make code working under 1.0.0 continue to work in future versions.

## Release schedule, channels, and long term support

Deno releases a new stable, minor version (eg. v2.1.0, v2.0.0) on a 12 week
schedule.

Patch releases including bug fixes for the latest minor version are released as
needed - you can expect several patch releases before a new minor version is
released.

### Release channels

Deno is distributed on four release channels. Each channel is an independent
track with its own "latest" version and its own download location, so moving
along one track never moves you along another:

- `stable` - semver minor/patch releases, as described above. This is **the
  default** channel and is recommended for most users. Stable builds are
  downloaded from [GitHub releases](https://github.com/denoland/deno/releases).
- `lts` - long term support: a single stable minor line that receives only
  backwards-compatible bug fixes, recommended for enterprise users who prefer
  not to upgrade so often. See [Long Term Support](#long-term-support-(lts)).
- `rc` - a release candidate for the upcoming semver minor release.
- `canary` - an unstable build that changes multiple times per day, so you can
  try the latest bug fixes and features before they reach `stable`.

During a major-version prerelease cycle (such as 3.0), Deno also publishes
`alpha` and `beta` channels. Every channel except `stable` is served from Deno's
download server at `dl.deno.land`.

### Choosing a channel

Your installed Deno belongs to exactly one channel, and that channel is baked
into the binary when it is built. `deno upgrade` reads your current binary's
channel to decide what "latest" means, and the update notice you occasionally
see is based on the same thing. An LTS binary, for example, prints
`A new LTS release of Deno is available` and tells you to run
`deno upgrade lts`.

A version number does not, by itself, identify a channel. The same version can
ship as two byte-different builds: `2.9.3`, for instance, exists both as a
stable release and as an LTS release. They are built from the same source and
carry the same version string, and differ only in an embedded channel marker and
where they are downloaded from. There is no way to ask for "the LTS build of
2.9.3" by version number, because the version string is identical for both. You
select a build by channel, not by version, and a bare version number always
resolves to the **stable** build.

| Command                   | Resolves to                             | Resulting build |
| ------------------------- | --------------------------------------- | --------------- |
| `deno upgrade`            | latest **stable** release               | stable          |
| `deno upgrade 2.9.3`      | version 2.9.3 on the **stable** channel | stable          |
| `deno upgrade lts`        | latest **lts** release                  | lts             |
| `deno upgrade rc`         | latest **rc** release                   | rc              |
| `deno upgrade canary`     | latest canary build                     | canary          |
| `deno upgrade <git-hash>` | that specific canary build              | canary          |

To switch channels on purpose, pass the channel name, for example
`deno upgrade lts` or `deno upgrade stable`. Because a plain version number
always selects the stable build, a user on LTS who runs `deno upgrade 2.9.3`
downloads the stable build and moves off the `lts` channel onto `stable`. To
stay on LTS, upgrade with `deno upgrade lts`.

A channel name always resolves to that channel's newest build, so
`deno upgrade lts` installs the latest LTS release and there is no
`deno upgrade` form that pins an older LTS patch version. A version number only
ever selects a stable (or `rc`, `alpha`, `beta`) build, never an LTS one. See
[`deno upgrade`](/runtime/reference/cli/upgrade/) for more.

### Long Term Support (LTS)

Deno offers an LTS (long-term support) channel: a single stable minor line that
we maintain with only backwards-compatible bug fixes. It is aimed at enterprise
users who prefer to stay on one release line without absorbing new features or
breaking changes. Install or update it with `deno upgrade lts`.

The LTS channel is active on the Deno 2.9 line, starting with **v2.9.3**, and is
maintained until January 31st, 2027.

| LTS release version | LTS maintenance start | LTS maintenance end |
| ------------------- | --------------------- | ------------------- |
| v2.1                | Feb 1st, 2025         | Apr 30th, 2025      |
| v2.2                | May 1st, 2025         | Oct 31st, 2025      |
| v2.5                | Nov 1st, 2025         | Apr 30th, 2026      |
| v2.9                | Jul 1st, 2026         | Jan 31st, 2027      |

LTS backports include:

- Security patches
- Critical bug fixes (e.g., crashes, incorrect computations)
- **Critical** performance improvements _may_ be backported based on severity.

**API changes and major new features will not be backported.**

## Unstable APIs

When introducing new APIs, these are first marked as unstable. This means that
the API may change in the future. These APIs are not available to use unless you
explicitly pass an unstable flag, like `--unstable-kv`.
[Learn more about `--unstable-*` flags](/runtime/reference/cli/unstable_flags).

There are also some non-runtime features of Deno that are considered unstable,
and are locked behind unstable flags. For example, the
`--unstable-sloppy-imports` flag is used to enable `import`ing code without
specifying file extensions.

## Standard library

The Deno Standard Library ([jsr.io/@std](https://jsr.io/@std)) is mostly stable.
All standard library modules that are version 1.0.0 or higher are considered
stable. All other modules (0.x) are considered unstable, and may change in the
future.

Using unstable standard library modules is not recommended for production code,
but it is a great way to experiment with new features and provide feedback to
the Deno team. It is not necessary to use any unstable flags to use unstable
standard library modules.
