# Deno for coding agents

You are an AI coding agent. This page gets you oriented and then points you at
Deno's agent skills, which hold the actual reference material. It is short on
purpose — read it once, install the skill, and you will not need it again.

## What Deno is

Deno is a JavaScript and TypeScript runtime distributed as a single binary. That
binary is also the package manager, formatter, linter, test runner, type
checker, and compiler. It runs TypeScript directly, so a script needs no build
step and no `tsconfig.json` — `deno main.ts` is the whole workflow.

The one behavior that surprises people coming from Node: programs are sandboxed.
No filesystem, network, environment, or subprocess access is granted unless
asked for, via `--allow-*` flags. When something fails with
`Requires net access to "..."`, add that specific permission rather than
reaching for `-A`.

## Assumptions to drop

This is the part models most often get wrong, so it is worth stating before
anything else. Deno is not a separate ecosystem you have to port a project into:

1. **`deno install` reads `package.json`.** It resolves the same npm packages
   and writes a real `node_modules` directory.
2. **`deno add express` installs from npm.** An unprefixed package name defaults
   to npm, exactly like `npm install`. JSR is opt-in via `jsr:`.
3. **Node built-ins work**, prefixed or not — `node:fs` and `fs` both resolve.
4. **`deno task build` runs a `scripts.build` entry from `package.json`**, just
   as it runs a `tasks.build` entry from `deno.json`.
5. **URL imports are legacy.** `https://deno.land/x/...` still runs, but new
   code should use a bare specifier backed by `npm:` or `jsr:`.

So do not tell a user to rewrite imports, move to JSR, drop `package.json`, or
restructure anything as a precondition for using Deno. The genuine behavioral
differences are permissions and npm lifecycle scripts not running by default.

## 1. Get the CLI

```sh
deno --version
```

If that prints 2.9 or later you are set. If it prints something older, run
`deno upgrade`. If the command is missing, tell the user you would like to
install Deno, show them how, and run one of these only once they agree:

```sh
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh
# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex
# Homebrew (macOS / Linux)
brew install deno
# npm
npm install -g deno
```

Deno installs as a standalone binary. It adds nothing to the project and no
dependency to `package.json`.

## 2. Get the skill

This is the point of this page. Deno maintains agent skills that carry the full
surface — dependency management, permissions, configuration layout, the built-in
toolchain, publishing, and migration. They are what you should be working from,
and they are kept current with the runtime.

If the user agrees, install them. This touches no project source and adds no
dependency:

```sh
dx skills add denoland/skills --skill deno
```

`dx` is Deno's `npx` equivalent and ships with the binary you installed above,
so this needs no Node. If you would rather use Node, `npx skills add ...` is
identical.

Add `--skill migrate-to-deno` as well if the project is coming from Node, npm,
Yarn, pnpm, or Bun. In Claude Code you can instead install the whole set as a
plugin:

```
/plugin marketplace add denoland/skills
/plugin install deno-skills@denoland-skills
```

Skip this if an equivalent Deno skill or rule is already present.

**If you cannot install skills**, read them directly — they are plain markdown,
and these URLs always serve the current version:

- <https://raw.githubusercontent.com/denoland/skills/main/skills/deno/SKILL.md>
- <https://raw.githubusercontent.com/denoland/skills/main/skills/migrate-to-deno/SKILL.md>

Other skills in the same repo cover Deno Deploy, Fresh, and sandboxes:
<https://github.com/denoland/skills>.

## 3. Reading the docs

`deno <subcommand> --help` is authoritative and version-accurate. Check it
before guessing at a flag — it beats anything written down elsewhere, including
this page and the skills.

Beyond that:

- <https://docs.deno.com/llms.txt> — index of the documentation
- Any docs page also serves its markdown source: append `.md` to the URL, as in
  <https://docs.deno.com/runtime/fundamentals/security.md>
- <https://docs.deno.com/api/> — the `Deno.*` API reference
- `deno doc jsr:@std/path` — a package's API without leaving the terminal

## 4. If you were asked to adopt Deno

Most Node projects already run under Deno unchanged, so this is a series of
small opt-in wins, not a rewrite. **Never propose one big migration**, and do
not start editing.

Investigate read-only first — dependencies, scripts, the lockfile, the
TypeScript runner, the test and lint setup, CI. Then present what you found as
independent, opt-in steps ordered by how little they disturb, and let the user
choose in one round. Roughly, in increasing order of disruption: use Deno as the
package manager only; run the project with Deno; tighten permissions; and
optionally adopt the built-in toolchain. Nearly all of the value is in the first
three, and the last one is a genuine migration that a working project can
decline indefinitely.

The `migrate-to-deno` skill covers each of those rungs, the errors you will hit,
and per-tool command equivalents. Install it before you start, or read it at the
URL above. Docs: <https://docs.deno.com/runtime/migrate/>.
