---
title: Crons
description: "Scheduling and managing cron jobs in Deno Deploy, including defining crons in code, execution lifecycle, retries, and observability."
---

Crons are scheduled tasks that run automatically on a defined schedule. You
define crons in your code using the `Deno.cron()` API, deploy your application,
and the platform discovers and runs them on schedule.

## Defining crons in code

`Deno.cron()` takes a human-readable name, a schedule, and a handler function.
The name identifies the cron in the dashboard and logs, the schedule determines
when it fires, and the handler contains the code to run on each invocation. The
schedule can be either a standard
[5-field cron expression](https://en.wikipedia.org/wiki/Cron#UNIX-like) or a
structured object. All times are UTC — this avoids ambiguity around daylight
saving transitions. See the
[full API reference](https://docs.deno.com/api/deno/~/Deno.cron) for details.

```typescript
Deno.cron("cleanup-old-data", "0 * * * *", () => {
  console.log("Cleaning up old data...");
});

Deno.cron(
  "sync-data",
  "*/15 * * * *",
  {
    backoffSchedule: [1000, 5000, 10000],
  },
  async () => {
    await syncExternalData();
  },
);
```

### Common schedule expressions

| Schedule                       | Expression     |
| ------------------------------ | -------------- |
| Every minute                   | `* * * * *`    |
| Every 15 minutes               | `*/15 * * * *` |
| Every hour                     | `0 * * * *`    |
| Every 3 hours                  | `0 */3 * * *`  |
| Daily at 1 AM                  | `0 1 * * *`    |
| Every Wednesday at midnight    | `0 0 * * WED`  |
| First of the month at midnight | `0 0 1 * *`    |

### Top-level registration

You must register crons at the module top level, before `Deno.serve()` starts.
The platform extracts `Deno.cron()` definitions at deployment time by evaluating
your module's top-level code — this is how it discovers which crons exist and
what their schedules are. Crons registered inside request handlers,
conditionals, or after the server starts will not be picked up.

## Execution lifecycle & status

Cron executions progress through these statuses:

| Status      | Color  | Description                             |
| ----------- | ------ | --------------------------------------- |
| **Running** | Yellow | Cron handler is currently executing     |
| **OK**      | Green  | Completed successfully                  |
| **Error**   | Red    | Failed — hover to see the error message |

The platform prevents overlapping executions: the same cron cannot run
concurrently. If a cron is still running when the next scheduled invocation is
due, that invocation is skipped. This avoids resource contention and ensures
each execution can complete without interference.

## Retries & backoff

By default, failed cron executions are not retried. You can optionally provide a
`backoffSchedule` array to enable retries and control exactly when each one
happens.

The `backoffSchedule` is an array of delays in milliseconds, where each element
specifies how long to wait before the next retry attempt:

- Maximum **5 retries** per execution
- Maximum delay per retry: **1 hour** (3,600,000 ms)
- Retries do not affect the cron schedule — the next scheduled run will be
  executed on time, even if the previous run has retries pending. If a retry and
  the next scheduled run coincide, the later one will be skipped as per the
  overlapping policy described above.

Example: `backoffSchedule: [1000, 5000, 10000]` retries up to 3 times with
delays of 1s, 5s, and 10s.

## Dashboard

The **Crons** tab in the app sidebar gives you an overview of all registered
crons across your project. Each entry shows the cron's schedule, its most recent
executions, and the active [timelines](/deploy/reference/timelines/) it belongs
to. When a cron with the same name is registered with different schedules on
different timelines, each distinct schedule appears as its own entry so you can
track them independently.

Click "View Details" on any cron to open its detail page, which shows the full
execution history. You can filter executions using the search bar:

- **`status:<value>`** — filter by status (`ok`, `error`, `running`)
- **`timeline:<name>`** — filter by timeline name (substring match,
  case-insensitive)

## Observability integration

Cron executions produce OpenTelemetry traces. Click "View Trace" in the
execution history to navigate to the
[Observability](/deploy/reference/observability/) traces page for that specific
trace.

On the traces page, you can use these cron-related filters:

- **`kind:cron`** — show only cron spans
- **`cron.name:<name>`** — filter by cron name
- **`cron.schedule:<schedule>`** — filter by schedule expression

## Timelines

Crons run on production and git branch
[timelines](/deploy/reference/timelines/). The platform extracts `Deno.cron()`
definitions at deployment time and schedules them for execution, so each
timeline runs the set of crons defined in its active revision's code. To add,
remove, or modify crons, update your code and deploy a new revision. Rolling
back to a previous deployment re-registers the crons from that deployment. You
can see which crons are currently registered in a given timeline from its page
in the dashboard.

## Limitations

- Crons must be registered at the module top level (before `Deno.serve()`)
- No concurrent executions of the same cron
- Maximum **5 retries** per execution
- Maximum backoff delay: **1 hour** (3,600,000 ms)
- Cron executions are billed as inbound HTTP requests
