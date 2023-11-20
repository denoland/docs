import Admonition from "./_admonition.mdx";

# Scheduling cron tasks

<Admonition />

The [`Deno.cron`](https://deno.land/api?s=Deno.cron&unstable=) interface enables
you to configure JavaScript or TypeScript code that executes on a configurable
schedule using [cron syntax](https://en.wikipedia.org/wiki/Cron). In the example
below, we configure a block of JavaScript code that will execute every minute.

```ts
Deno.cron("Log a message", "* * * * *", () => {
  console.log("This will print once a minute.");
});
```

If you are new to cron syntax, it might be useful to check out
[crontab.guru](https://crontab.guru/), a browser-based tool that provides an
interactive interface to experiment with different cron syntaxes. There are also
a number of third party modules
[like this one](https://www.npmjs.com/package/cron-time-generator) that will
help you generate cron schedule strings.

## Static vs Dynamic Tasks

`Deno.cron` interface is designed to support static definition of cron tasks
based on pre-defined schedules. All `Deno.cron` tasks must be defined at the
top-level. Any nested `Deno.cron` invocations (e.g. inside
[`Deno.serve`](https://deno.land/api?s=Deno.serve&unstable=) handler) will
result in an error or will be ignored.

If you need to schedule tasks dynamically during your Deno program execution,
you can the [Deno Queues](./queue_overview) APIs.

## Time zone

`Deno.cron` schedules are specified using UTC time zone. This helps avoid issues
with time zones, which observe daylight saving time.

## Overlapping executions

It's possible for the next scheduled invocation of your cron task to overlap
with the previous invocation. If this occurs, `Deno.cron` will skip the next
scheduled invocation in order to avoid overlapping executions.

## Retrying failed runs

Failed cron invocations are automatically retried with a default retry policy.
If you would like to specify a custom retry policy, you can use the
`backoffSchedule` property to specify an array of wait times (in milliseconds)
to wait before retrying the function call again. In the following example, we
will attempt to retry failed callbacks three times - after one second, five
seconds, and then ten seconds.

```ts
Deno.cron("Retry example", "* * * * *", () => {
  throw new Error("Deno.cron will retry this three times, to no avail!");
}, {
  backoffSchedule: [1000, 5000, 10000],
});
```

## Deno CLI and Deno Deploy

Like other Deno platform built-ins (like queues and Deno KV), the `Deno.cron`
implementation works slightly differently when run using the CLI or Deno Deploy.

### Local behavior

The local implementation of `Deno.cron` keeps all of the execution state
in-memory. If you run multiple Deno programs that use `Deno.cron`, each program
will have its own independent set of cron tasks.

### Deno Deploy behavior

Deno Deploy offers serverless implementation of `Deno.cron` that is designed for
high availability and scale. Deno Deploy automatically extracts your `Deno.cron`
definitions at deployment time, and schedules them for execution using on-demand
isolates. Your latest production deployment holds the set of cron tasks that are
scheduled for execution. To add, remove, or modify cron tasks, simply modify
your `Deno.cron` code and create a new production deployment.

Deno Deploy guarantees that your cron tasks are executed at least once per each
scheduled time interval. This generally means that your cron handler will be
invoked once. In some failure scenarios, the handler may be invoked multiple
times for the same scheduled time interval.

#### Cron Dashboard

When you make a production deployment that includes a cron task, you can view a
list of all your cron tasks in the
[Deploy dashboard](https://dash.deno.com/projects) under the `Cron` tab for your
project.

![a listing of cron tasks in the Deno dashboard](./images/cron-tasks.png)

#### Limitations

- `Deno.cron` is only available for production deployments (not preview
  deployments)
- The exact invocation time of your `Deno.cron` handler may vary by up to a
  minute from the scheduled time

#### Pricing

`Deno.cron` invocations are charged at the same rate as inbound HTTP requests to
your deployments.

## Cron configuration examples

Here are a few common cron configurations, provided for your convenience.

```ts title="Run once a minute"
Deno.cron("Run once a minute", "* * * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="Run every fifteen minutes"
Deno.cron("Run every fifteen minutes", "*/15 * * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="Run once an hour, on the hour"
Deno.cron("Run once an hour, on the hour", "0 * * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="Run every three hours"
Deno.cron("Run every three hours", "0 */3 * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="Run every day at 1am"
Deno.cron("Run every day at 1am", "0 1 * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="Run every Wednesday at midnight"
Deno.cron("Run every Wednesday at midnight", "0 0 * * WED", () => {
  console.log("Hello, cron!");
});
```

```ts title="Run on the first of the month at midnight"
Deno.cron("Run on the first of the month at midnight", "0 0 1 * *", () => {
  console.log("Hello, cron!");
});
```
