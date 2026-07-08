---
last_modified: 2026-07-08
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
[`unstable`](/runtime/reference/deno_json/#unstable-features) array in
`deno.json`).

```sh
deno run --unstable-cron main.ts
```

<a href="/api/deno/~/Deno.cron" class="docs-cta runtime-cta">Deno.cron API
reference</a>

## Defining a cron job

[`Deno.cron()`](/api/deno/~/Deno.cron) takes a human-readable name, a schedule,
and a handler function. The name identifies the cron job in logs, the schedule
determines when the handler fires, and the handler contains the code to run on
each invocation.

The schedule can be either a 5-field cron expression or a structured object.

```ts
Deno.cron("log-a-message", "* * * * *", () => {
  console.log("This runs once a minute.");
});

Deno.cron("hourly-task", { hour: { every: 1 } }, () => {
  console.log("This runs once an hour.");
});
```

:::note

All times are UTC — this avoids ambiguity around daylight saving transitions.

:::

Cron jobs must be registered at the top level of a module, before any server
starts. Definitions nested inside request handlers, conditionals, or callbacks
will not be picked up.

## Cron Syntax and Rules

Deno uses a **Saffron-compatible** parser that strictly requires a **5-field**
format:

```sh
┌───────────── minute (0-59)
│ ┌─────────── hour (0-23)
│ │ ┌───────── day of month (1-31)
│ │ │ ┌─────── month (1-12 or JAN-DEC)
│ │ │ │ ┌───── day of week (1-7 or SUN-SAT)
│ │ │ │ │
* * * * *
```

Each field accepts an exact value, `*` (every value), a range (`1-5`), a list
(`1,3,5`), or a step (`*/15` for every fifteenth unit), plus advanced macros:

| Field        | Allowed Values      | Allowed Special Characters |
| ------------ | ------------------- | -------------------------- |
| Minute       | `0-59`              | `*` `-` `,` `/`            |
| Hour         | `0-23`              | `*` `-` `,` `/`            |
| Day of Month | `1-31`              | `*` `-` `,` `/` `L` `W`    |
| Month        | `1-12` or `JAN-DEC` | `*` `-` `,` `/`            |
| Day of Week  | `1-7` or `SUN-SAT`  | `*` `-` `,` `/` `L` `#`    |

:::note

Unlike traditional UNIX cron engines (which use `0-6` where `0` is Sunday), Deno
maps numeric days of the week from **1** to **7** (1 = Sunday, 7 = Saturday).

:::

### Advanced Features

Deno's parser introduces powerful features for advanced scheduling:

- **Wraparound Ranges:** Inverted ranges that cross time boundaries are
  supported. Useful for night-time windows or end-of-month + start-of-next-month
  logic.

- **Last Day of Month:** Specifying `L` in the _Day of Month_ field triggers the
  task on the exact last day of the current month (28, 29, 30, or 31).\
  Specifying `L-<offset>` triggers on the last day minus the offset (e.g., `L-1`
  is the second-to-last day). The offset can be from `1` to `30`.

- **Nearest Weekday:** Specifying `<day>W` triggers on the closest weekday
  (Mon–Fri) to the given date.\
  `LW` or `L-<offset>W` works relative to the end of the month.

- **Last Day of Week:** Specifying `<day>L` triggers on the last specific day of
  the week in that month. Standalone `L` is equivalent to `7L`.

- **N-th Day of Week:** `<day>#<nth>` triggers on the n-th specific day of the
  week in a month. The `<nth>` value can be from `1` to `5`.

### Examples

| Expression              | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `0 9 * * 2-6`           | Every weekday at 09:00                                    |
| `5/10 8-18 * * *`       | Every 10 minutes starting at :05, between 8 AM and 6 PM   |
| `59-0 23-0 31-1 12-1 *` | From end of December to beginning of January (wraparound) |
| `0 0 L * *`             | Last day of every month at midnight                       |
| `0 0 LW * *`            | Last weekday of every month at midnight                   |
| `0 0 L-30W * *`         | Nearest weekday to (end of month - 30 days) at midnight   |
| `0 0 1W * *`            | Nearest weekday to the 1st of the month at midnight       |
| `0 0 * * 7L`            | Last Saturday of every month at midnight                  |
| `0 0 * * MON#2`         | Second Monday of every month at midnight                  |
| `*/10 20-4 * * *`       | Every 10 minutes during night hours (wraparound)          |

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

## OpenTelemetry

When [OpenTelemetry](/runtime/fundamentals/open_telemetry/) is enabled
(`OTEL_DENO=true`), each [`Deno.cron()`](/api/deno/~/Deno.cron) invocation
automatically produces an OpenTelemetry span. This lets you trace cron execution
alongside your other instrumented code:

```sh
OTEL_DENO=true deno run --unstable-cron main.ts
```

Each cron invocation creates a span named after the cron job. The span covers
the duration of the handler function, and any spans created inside the handler
are nested under it as children.
