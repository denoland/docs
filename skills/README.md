# Agent skills

Reusable
[Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
for recurring maintenance on this docs site. Each subdirectory is one skill: a
`SKILL.md` with a `name` and a `description` of when to use it, plus any helper
files that skill needs.

These are instructions for whoever is doing the work, human or coding agent.
They capture how we keep [docs.deno.com](https://docs.deno.com) tutorials
correct and current, so the knowledge is not re-derived each time. Lume ignores
this directory (`site.ignore("skills")` in `_config.ts`), so nothing here is
published.

## Skills

| Skill                                                 | Use it when                                                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`modernize-tutorial`](./modernize-tutorial/SKILL.md) | A tutorial uses a deprecated API, an outdated scaffolder, or version-pinned doc links and needs bringing up to date. |
| [`verify-tutorial`](./verify-tutorial/SKILL.md)       | You want to confirm a tutorial actually works when followed, using Deno-native tooling.                              |
| [`audit-tutorials`](./audit-tutorials/SKILL.md)       | You want a ranked worklist of stale or broken tutorials, without editing anything.                                   |
| [`new-tutorial`](./new-tutorial/SKILL.md)             | You are adding a new tutorial and want it to follow this repo's conventions with verified code.                      |
| [`open-docs-pr`](./open-docs-pr/SKILL.md)             | You have a change ready and want to run the required checks and open a PR in the house style.                        |

## Using these with Claude Code

Claude Code auto-discovers skills from `.claude/skills/`, not from this
top-level directory. To make these live as project skills without duplicating
them, symlink the directory:

```console
mkdir -p .claude && ln -s ../skills .claude/skills
```

(`.claude/` is gitignored, so the symlink stays local to each checkout.) Other
agent tooling can point at `skills/` directly.

## Conventions every skill assumes

From [`AGENTS.md`](../AGENTS.md); skills restate the parts they depend on so
they work standalone.

- Tutorials live in `examples/tutorials/`. Bump `last_modified: YYYY-MM-DD` on
  every content page you change; CI enforces it.
- Before a PR: `deno fmt`, `deno lint`, `deno task test`, and
  `deno task build:light`.
- Prefer plain sentences and colons over em-dash joins. Frontmatter titles have
  no backticks.
- This is a Deno site: tutorial code must run under Deno-native tooling
  (`deno run`, `deno install`, `deno task`), never `npm`/`npx`/`node`.
