/**
 * @title Find and update outdated dependencies
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/runtime/reference/cli/outdated/} Doc: deno outdated
 * @resource {https://docs.deno.com/runtime/fundamentals/modules/} Doc: Modules and dependencies
 * @group CLI
 *
 * Dependencies pinned months ago quietly fall behind. The deno outdated
 * subcommand compares what your lockfile resolves to against the newest
 * versions on JSR and npm, and can rewrite deno.json for you.
 */

// This script imports one dependency at an old version, the kind of pin
// that accumulates in any project over time.
import { basename } from "jsr:@std/path@1.0.6";

console.log(basename("/tmp/projects/report.txt"));

// The walkthrough below uses a project with a deno.json import map and a
// lockfile created back when these versions were current:
//
//   {
//     "imports": {
//       "@std/path": "jsr:@std/path@^1.0.6",
//       "chalk": "npm:chalk@^4.1.0"
//     }
//   }

// Running deno outdated prints a table. Current is what the lockfile
// resolves today, Update is the newest version that still satisfies the
// semver range in deno.json, and Latest is the newest version overall:
//
//   deno outdated
//   ┌───────────────┬─────────┬────────┬────────┐
//   │ Package       │ Current │ Update │ Latest │
//   ├───────────────┼─────────┼────────┼────────┤
//   │ jsr:@std/path │ 1.0.6   │ 1.1.5  │ 1.1.5  │
//   ├───────────────┼─────────┼────────┼────────┤
//   │ npm:chalk     │ 4.1.0   │ 4.1.2  │ 5.6.2  │
//   └───────────────┴─────────┴────────┴────────┘
//
//   Run deno update --latest to update to the latest available versions,
//   or deno outdated --help for more information.

// The --update flag applies the Update column. It respects the semver
// ranges, so chalk moves to the newest 4.x release and does not cross into
// the 5.x major:
//
//   deno outdated --update
//   Updated 2 dependencies:
//    - jsr:@std/path ^1.0.6 -> ^1.1.5
//    - npm:chalk     ^4.1.0 -> ^4.1.2

// Adding --latest crosses major version boundaries and applies the Latest
// column instead:
//
//   deno outdated --update --latest
//   Updated 2 dependencies:
//    - jsr:@std/path ^1.0.6 -> ^1.1.5
//    - npm:chalk     ^4.1.0 -> ^5.6.2

// Both forms rewrite deno.json in place. After --update --latest the import
// map reads:
//
//   {
//     "imports": {
//       "@std/path": "jsr:@std/path@^1.1.5",
//       "chalk": "npm:chalk@^5.6.2"
//     }
//   }

// Major version jumps can contain breaking changes, so review the changelog
// before reaching for --latest. The plain deno outdated command makes no
// changes at all and is always safe to run.
