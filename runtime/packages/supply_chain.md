---
last_modified: 2026-06-23
title: "Supply chain management"
description: "Keep Deno dependencies deterministic and safe: lockfile discipline, minimum dependency age, publishing-trust policy, deno audit, intentional updates, and a recommended CI baseline."
---

Modern JavaScript projects pull code from many sources (JSR, npm, local
workspaces). Good supply chain management helps you achieve four goals:

- Determinism: everyone (and your CI) runs the exact same code.
- Security: unexpected upstream changes or compromises are detected early.
- Velocity: you can update dependencies intentionally when you choose.
- Resilience: builds keep working offline or when registries have outages.

This page builds on
[lockfiles](/runtime/packages/#lockfile-and-reproducible-installs) and
[vendoring](/runtime/packages/#vendoring-remote-modules) from the
[dependency management guide](/runtime/packages/).

## Core practices

1. Pin versions deliberately
   - For applications, prefer exact versions (for example
     `jsr:@luca/cases@1.2.3`).
   - For libraries, a caret range (`^1.2.3`) lets consumers get
     backwards‑compatible fixes.
   - Avoid unbounded (`*`) or overly broad ranges in production applications.
2. Commit your `deno.lock` file.
3. Enable a frozen lockfile in CI / production (`--frozen` or
   `"lock": { "frozen": true }`) so new, unseen dependencies fail the build
   instead of silently appearing.
4. Vendor when you need hermetic/offline builds (`"vendor": true`) or when you
   must patch third‑party code locally. Vendoring does not remove the need for a
   lockfile—it complements it.
5. Use `jsr:` and `npm:` specifiers with import map (`imports`) entries to
   centralize version management.
6. Periodically unfreeze and update consciously (for example on a weekly or
   sprint cadence) instead of ad‑hoc updates during feature work.
7. Set a [minimum dependency age](#minimum-dependency-age) so freshly published
   versions can't slip into an install before the ecosystem has had time to spot
   a compromised release.
8. Turn on a [publishing-trust policy](#publishing-trust-policy) so a version
   published with a weaker method than the one you already locked is rejected
   instead of silently accepted.

## Minimum dependency age

Deno can refuse to install any package version that is younger than a configured
age. This is a cheap, broad defence against npm supply-chain attacks: malicious
versions are usually detected and yanked within days, so delaying installs by a
similar window catches the bulk of them.

You can configure the same control in three places; pick whichever fits the
project:

- **`deno.json`**, apply project-wide:

  ```jsonc title="deno.json"
  {
    "minimumDependencyAge": "P3D"
  }
  ```

- **CLI flag**, apply ad-hoc, e.g. for a one-off install or in a CI step:

  ```sh
  deno install --minimum-dependency-age=P3D
  ```

- **`.npmrc`** (Deno 2.8+), matches the npm convention, useful when sharing the
  same `.npmrc` across npm and Deno tooling. The npm setting accepts a whole
  number of days only:

  ```ini title=".npmrc"
  min-release-age=3
  ```

`deno.json` and `--minimum-dependency-age` accept an
[ISO-8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) such as
`P3D` (3 days) or `PT72H` (72 hours), an integer (interpreted as minutes), an
absolute cutoff date (`2025-09-16`) or RFC3339 timestamp, or `0` to disable. The
field also supports an object form that exempts specific packages; see the
[`minimumDependencyAge` reference](/runtime/reference/deno_json/#minimum-dependency-age)
for the full shape, and
[`.npmrc` configuration](/runtime/fundamentals/node/#.npmrc-configuration) for
the other npm-registry options Deno reads.

## Publishing-trust policy

Where minimum dependency age delays new versions, a publishing-trust policy
looks at _how_ a version was published and refuses to quietly accept a weaker
method than you have already locked.

npm's full package metadata records the publishing method of each version. Deno
reads three signals from it:

- **Trusted publishing (OIDC)** - the version was published from CI through
  npm's OIDC trusted-publisher flow, with no long-lived token.
- **Provenance attestation** - the version ships a signed SLSA provenance
  attestation linking it to the source commit and build (published with
  `--provenance`).
- **Staged publishing** - a maintainer approved the version with a live 2FA
  challenge before it became installable.

Deno ranks these into a single trust level, from least to most trusted:

| Trust level                     | Signal                                          |
| ------------------------------- | ----------------------------------------------- |
| Plain                           | No publishing-trust signal                      |
| Provenance                      | Provenance attestation only                     |
| Trusted publishing              | OIDC trusted publisher only                     |
| Trusted publishing + provenance | Both of the above                               |
| Staged                          | Human-approved staged publish (ranks above all) |

A staged publish ranks highest because a person approved it with a live 2FA
challenge. This ordering mirrors pnpm's `trustPolicy: no-downgrade`.

The motivation is supply-chain safety: if a maintainer's token is stolen, an
attacker can publish a new version using a weaker publishing method than the
releases you have been trusting. The `no-downgrade` policy turns that silent
downgrade into a hard error.

Enable it in `.npmrc`:

```ini title=".npmrc"
trust-policy=no-downgrade
```

How it behaves:

- Deno records the resolved trust level on each npm entry in `deno.lock` (a
  `trust` field, omitted when the version is plain). That recorded level becomes
  the baseline for the next resolution.
- With `no-downgrade` on, Deno refuses to resolve any candidate version whose
  trust level is below the locked baseline for that package, and fetches the
  full packument so the signals are available.
- The baseline is the highest trust level recorded for a package in your
  lockfile, so protection grows as you lock higher-trust versions. The first
  time you lock a package there is no prior baseline to compare against.
- The policy is off by default. Existing lockfiles are unaffected until you turn
  it on, and any value other than `no-downgrade` leaves it off.

## Typical CI pattern

In Deno 2.8+, the single command [`deno ci`](/runtime/reference/cli/ci/)
encapsulates the recommended CI install flow (frozen lockfile + lifecycle
scripts):

```sh
deno ci
```

For older Deno versions, or to compose the steps manually:

```sh
# Install (resolve) dependencies exactly as locked; fail if drift or new deps
deno install --frozen --entrypoint main.ts

# (optional) Run with only cached modules to guarantee no network access
deno run --cached-only main.ts
```

If you rely on `npm` packages (`package.json` present), include `deno install`
(or `deno ci`) in CI before running tests so the `node_modules` directory is
materialized deterministically.

## Updating dependencies intentionally

When you decide to update:

1. Temporarily allow lockfile writes: add `--frozen=false` or set
   `"lock": { "frozen": false }`.
2. Change versions (edit `deno.json`, use `deno add <specifier>@<newVersion>`,
   or remove with `deno remove`).
3. Re-run `deno install --entrypoint main.ts` (optionally `--reload`) to update
   resolutions and integrity hashes.
4. Review the diff in `deno.lock` (and `vendor/` if used) in your pull request.
5. Re-enable the frozen lockfile.

## Troubleshooting a frozen lockfile

You may encounter errors like:

```text
error: The lockfile is frozen. Cannot add new entry for "jsr:@scope/pkg@1.3.0".
```

or:

```text
error: Module not found in frozen lockfile: https://example.com/dependency/mod.ts
```

Common causes and fixes:

| Symptom                                                    | Cause                                          | Fix                                                                                                                         |
| ---------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Need to bump a version but command fails with frozen error | Lockfile is in frozen mode                     | Re-run with `--frozen=false` (one-off) or temporarily set `"lock": { "frozen": false }`, then update and re-freeze          |
| New transitive dependency appears after editing code       | Code now imports something not in lockfile     | Unfreeze (`--frozen=false`) and run `deno install --entrypoint <entry>.ts` to record it                                     |
| Removed imports but lockfile still contains old entries    | Lockfile is additive; entries persist          | (Optional) regenerate: move `deno.lock` aside (`mv deno.lock deno.lock.old`), run install to recreate, compare, then commit |
| Lockfile corruption / merge conflict                       | Manual edit or conflict left inconsistent JSON | Delete conflicting sections and re-run install, or regenerate entirely                                                      |
| Using vendored deps but lockfile complains                 | Vendor dir out of sync with lockfile           | Re-run `deno install --entrypoint <entry>` (unfrozen) to sync both, then commit                                             |

## Safe regeneration checklist

Only regenerate the entire `deno.lock` when necessary (corruption, massive
pruning). When you do:

1. Back it up: `cp deno.lock deno.lock.bak`.
2. Remove it: `rm deno.lock`.
3. (If vendoring) remove or move the `vendor/` directory.
4. Run `deno install --entrypoint main.ts` to recreate.
5. Inspect the diff between old and new to catch unexpected additions.

## Vendor vs lockfile

These are complementary:

- Lockfile: records exact resolved versions + integrity hashes for remote and
  npm/JSR deps.
- Vendor directory: stores the actual source locally for hermetic, offline, and
  patchable builds.

Use both for maximum reproducibility. A frozen lockfile alone does not make your
build fully hermetic if the remote source disappears; vendoring closes that gap.

## Quick decision guide

| Need                               | Use                                            |
| ---------------------------------- | ---------------------------------------------- |
| Detect upstream tampering          | Lockfile (commit & freeze)                     |
| Offline / air-gapped build         | `vendor: true` + lockfile                      |
| Patch third-party code             | Vendoring or `scopes` overrides (short-term)   |
| Fast CI with integrity             | `deno install --frozen`                        |
| Intentionally upgrade              | Temporarily unfreeze, run install, review diff |
| Block a publishing-trust downgrade | `trust-policy=no-downgrade` in `.npmrc`        |

## Minimum supply chain baseline (recommended)

```json title="deno.json"
{
  "imports": {/* centralize versions */},
  "vendor": true,
  "lock": { "frozen": true }
}
```

Commit `deno.json`, `deno.lock`, and (if using vendor) the entire `vendor/`
directory.

:::tip Automate a weekly dependency refresh

A scheduled CI job that unfreezes, runs `deno add --latest` (or manually bumps
key packages), executes tests, and opens a pull request with the updated
`deno.lock` (and `vendor/`) keeps security patches flowing while keeping
day-to-day builds deterministic.

:::
