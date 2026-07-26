---
last_modified: 2026-07-02
title: "How to adopt Deno"
description: "A low-risk, step-by-step path for introducing Deno to an existing Node.js codebase and team: start with tooling, add a CI check alongside Node, use Deno as your package manager, pilot a project, then switch the runtime."
---

You don't have to adopt Deno all at once, and you don't need the whole team on
board to start. Deno is designed to slot into an existing Node.js and npm
codebase one piece at a time. Each step below is independently useful and fully
reversible, so you can stop at any point, keep your `package.json`, and still
come out ahead.

This guide lays out a path from "try it on one file" to "team runtime,"
ordered from lowest risk to highest. Start at the top, go as far as makes sense,
and follow the links for the mechanics of each step.

## Step 1: Start with tooling, not the runtime

The safest place to start changes nothing about how your application runs.
[`deno fmt`](/runtime/reference/cli/fmt/) and
[`deno lint`](/runtime/reference/cli/lint/) operate on your existing files,
need no configuration, and don't affect runtime behavior:

```sh
deno fmt
deno lint
```

Because Deno is a single binary with no dependencies to install, a teammate can
try these without adding anything to `package.json` or `node_modules`. This is
the easiest thing to put in front of a skeptical team: it replaces `prettier`
and `eslint` with one tool and zero config, and it touches nothing else.

## Step 2: Add a Deno check to CI, alongside Node

Once formatting and linting are useful locally, add them as a job next to your
existing Node jobs. Your build, test, and deploy steps stay exactly as they are:

```yaml
jobs:
  deno-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
      - run: deno lint
```

This is the first place the team sees Deno running in the pipeline, with no
runtime risk. For more CI patterns, see
[Continuous integration](/runtime/reference/continuous_integration/).

## Step 3: Use Deno as your package manager

The next step still leaves your app running on Node.
[`deno install`](/runtime/reference/cli/install/) reads the same `package.json`,
resolves the same npm packages, and writes a `node_modules` directory, just like
`npm install`:

```sh
deno install
```

From here you can keep running the app with `node` and use Deno only as a
faster, more secure package manager. For the full command mapping and the
caveats to know, see the guide for the tool you're coming from:
[npm](/runtime/migrate/migrate_from_npm/),
[Yarn](/runtime/migrate/migrate_from_yarn/),
[pnpm](/runtime/migrate/migrate_from_pnpm/), or
[Bun](/runtime/migrate/migrate_from_bun/).

## Step 4: Run scripts and tests with Deno

With dependencies in place, you can start running things through Deno without
committing the whole app to it. [`deno task`](/runtime/reference/cli/task/) runs
the `scripts` in your `package.json`, the same way `npm run` does:

```sh
deno task start
```

You can also point [`deno test`](/runtime/reference/cli/test/) at a single test
file or directory to see how it handles a small, low-stakes slice of your suite
before moving the rest. Pick something contained here: a build script, an
internal tool, or one folder of tests, rather than the whole application.

## Step 5: Pilot a project, then switch the runtime

When the team is comfortable, run one project on the Deno runtime itself with
[`deno run`](/runtime/reference/cli/run/). Choose a low-stakes pilot first, such
as a new internal service, a CLI, or a script, rather than your most important
app. Because `package.json` still works and nothing is rewritten, you can revert
by going back to `node` if you hit a snag.

The mechanics of running an existing project on Deno, including permissions,
how CommonJS and ES modules are resolved, and the handful of errors most
projects hit on first run, are covered in detail in the
[Migrate from Node.js](/runtime/migrate/migrate_from_node/) guide. When the
pilot is stable, roll the same steps out to larger apps.

## Why this is safe to try

Each argument here is one you can hand to a teammate who isn't sold yet:

- **Reversible.** You keep your `package.json`, and Deno reads it directly.
  Backing a step out means running `npm` or `node` again, with nothing to undo.
- **Incremental.** Every step is valuable on its own. Tooling-only adoption is a
  complete, useful outcome even if you never switch the runtime.
- **No lock-in.** Deno doesn't require rewriting your code or maintaining a
  parallel config. The same repository keeps working under both tools while you
  decide.

## Next steps

- **[Migrate from Node.js](/runtime/migrate/migrate_from_node/).** The full,
  hands-on guide to running an existing Node project on the Deno runtime.
- **[Node.js and npm compatibility](/runtime/fundamentals/node/).** What's
  supported and the known gaps.
- **[Use Deno in an existing Node.js project](/examples/migrate_node_project_tutorial/).**
  A step-by-step tutorial version of the migration path.
