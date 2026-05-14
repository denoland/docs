---
last_modified: 2026-05-13
title: "Cron"
description: "Schedule recurring tasks in Deno with the Deno.cron() runtime API, an unstable feature enabled via --unstable-cron."
---

[`Deno.cron()`](/api/deno/~/Deno.cron) is a Deno runtime API for scheduling
JavaScript or TypeScript code to run on a recurring schedule, expressed using
[cron syntax](https://en.wikipedia.org/wiki/Cron#UNIX-like). It ships with Deno
itself, so the same code that runs locally can be deployed without changes.

[`Deno.cron`](/api/deno/~/Deno.cron) is currently an unstable API. To use it
locally with `deno run`, enable the
[`--unstable-cron`](/runtime/reference/cli/unstable_flags/#--unstable-cron) flag
(or add `"cron"` to the
[`unstable`](/runtime/fundamentals/configuration/#unstable-features) array in
`deno.json`).

```sh
deno run --unstable-cron main.ts
```

<a href="/api/deno/~/Deno.cron" class="docs-cta runtime-cta">Deno.cron API
reference</a>

## Defining a cron job

[`Deno.cron()`](/api/deno/~/Deno.cron) takes a human-readable name, a schedule,
and a handler function. The name identifies the cron job in logs, the schedule
determines when the handler fires, and all times are in UTC.

```ts
Deno.cron("log-a-message", "* * * * *", () => {
  console.log("This runs once a minute.");
});
```

The schedule can be a standard 5-field cron expression or a structured object:

```ts
Deno.cron("hourly-task", { hour: { every: 1 } }, () => {
  console.log("This runs once an hour.");
});
```

Cron jobs must be registered at the top level of a module, before any server
starts. Definitions nested inside request handlers, conditionals, or callbacks
will not be picked up.

## Retries and backoff

By default, failed handler invocations are not retried. Pass a `backoffSchedule`
(an array of millisecond delays) to retry on failure:

```ts
Deno.cron(
  "retry-example",
  "* * * * *",
  { backoffSchedule: [1000, 5000, 10000] },
  () => {
    throw new Error("Will be retried up to three times.");
  },
);
```

## Running cron jobs in production

[`Deno.cron`](/api/deno/~/Deno.cron) keeps execution state in-memory in the Deno
CLI, which means each process maintains its own independent set of cron tasks.
For production workloads, [Deno Deploy](/deploy/reference/cron/) builds on top
of this runtime API: it discovers your [`Deno.cron()`](/api/deno/~/Deno.cron)
definitions at deployment time, schedules and invokes them, handles retries, and
surfaces runs in a dashboard — so you don't need to keep a long-running process
up yourself.
