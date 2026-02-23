---
title: Cron
description: "Scheduling and managing cron jobs in Deno Deploy, including defining cron jobs in code, execution lifecycle, retries, and observability."
---

Cron jobs are scheduled tasks that run automatically on a defined schedule. You
define cron jobs in your code using the `Deno.cron()` API, deploy your application,
and the platform discovers and runs them on schedule.

## Defining cron jobs in code

`Deno.cron()` takes a human-readable name, a schedule, and a handler function.
The name identifies the cron job in the dashboard and logs, the schedule determines
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

### Organizing cron declarations

You must register cron jobs at the module top level, before `Deno.serve()` starts.
The platform extracts `Deno.cron()` definitions at deployment time by evaluating
your module's top-level code — this is how it discovers which cron jobs exist and
what their schedules are. Cron jobs registered inside request handlers,
conditionals, or after the server starts will not be picked up.

As the number of cron jobs grows, keeping them all in your main entrypoint can get
noisy. A common convention is to define cron handlers in a dedicated file and
import it at the top of your entrypoint.

```typescript title="crons.ts"
Deno.cron("cleanup-old-data", "0 * * * *", async () => {
  await deleteExpiredRecords();
});

Deno.cron("sync-data", "*/15 * * * *", async () => {
  await syncExternalData();
});
```

```typescript title="main.ts"
import "./crons.ts";

Deno.serve(handler);
```

Because `Deno.cron()` calls execute at the module top level, the import alone is
enough to register them — no need to call or re-export anything.

For projects with many cron jobs, you can use a `crons/` directory with one file per
cron job or group of related cron jobs, and a barrel file that re-exports them:

```typescript title="crons/mod.ts"
import "./cleanup.ts";
import "./sync.ts";
```

```typescript title="main.ts"
import "./crons/mod.ts";

Deno.serve(handler);
```

### Restrictions

There are a couple of restrictions to keep in mind when defining cron jobs. The
name passed to `Deno.cron()` can be at most **256 characters** long — this is
the identifier that appears in the dashboard and logs, so keeping it concise is
good practice regardless. On free organizations, each revision can register at
most **10 cron jobs**. If your project needs more, upgrading to a paid plan removes
this limit.

## Execution lifecycle & status

When a cron job is due, it fires independently on each timeline where it's
registered. Each execution runs the handler from that timeline's active
revision. For example, if a `cleanup-old-data` cron job is registered in both the
production timeline and a `staging` branch timeline, the production execution
runs the handler from the production revision, and the staging execution runs
the handler from the staging revision. Each execution will be billed as one
inbound HTTP request.

Cron job executions progress through these statuses:

| Status      | Color  | Description                             |
| ----------- | ------ | --------------------------------------- |
| **Running** | Yellow | Cron job handler is currently executing  |
| **OK**      | Green  | Completed successfully                  |
| **Error**   | Red    | Failed — hover to see the error message |

The platform prevents overlapping executions: the same cron job cannot run
concurrently. If a cron job is still running when the next scheduled invocation is
due, that invocation is skipped. This avoids resource contention and ensures
each execution can complete without interference.

## Retries & backoff

By default, failed cron job executions are not retried. You can optionally provide a
`backoffSchedule` array to enable retries and control exactly when each one
happens.

The `backoffSchedule` is an array of delays in milliseconds, where each element
specifies how long to wait before the next retry attempt:

- Maximum **5 retries** per execution
- Maximum delay per retry: **1 hour** (3,600,000 ms)
- Retries do not affect the cron job schedule — the next scheduled run will be
  executed on time, even if the previous run has retries pending. If a retry and
  the next scheduled run coincide, the later one will be skipped as per the
  overlapping policy described above.

Example: `backoffSchedule: [1000, 5000, 10000]` retries up to 3 times with
delays of 1s, 5s, and 10s.

## Dashboard

The **Cron** tab in the app sidebar gives you an overview of all registered
cron jobs across your project. Each entry shows the cron job's schedule, its most recent
executions, and the active [timelines](/deploy/reference/timelines/) it belongs
to. When a cron job with the same name is registered with different schedules on
different timelines, each distinct schedule appears as its own entry so you can
track them independently.

Click "View Details" on any cron job to open its detail page, which shows the full
execution history. You can filter executions using the search bar:

- **`status:<value>`** — filter by status (`ok`, `error`, `running`)
- **`timeline:<name>`** — filter by timeline name (substring match,
  case-insensitive)

## Observability integration

Cron job executions produce OpenTelemetry traces. Click "View Trace" in the
execution history to navigate to the
[Observability](/deploy/reference/observability/) traces page for that specific
trace.

On the traces page, you can use these cron-related filters:

- **`kind:cron`** — show only cron spans
- **`cron.name:<name>`** — filter by cron name
- **`cron.schedule:<schedule>`** — filter by schedule expression

## Timelines

Cron jobs run on production and git branch
[timelines](/deploy/reference/timelines/). The platform extracts `Deno.cron()`
definitions at deployment time and schedules them for execution, so each
timeline runs the set of cron jobs defined in its active revision's code. To add,
remove, or modify cron jobs, update your code and deploy a new revision. Rolling
back to a previous deployment re-registers the cron jobs from that deployment. You
can see which cron jobs are currently registered in a given timeline from its page
in the dashboard.
