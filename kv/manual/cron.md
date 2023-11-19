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

## Retrying failed runs

If you would like to automatically retry failled function invocations for the
callback used in `Deno.cron`, you can use the `backoffSchedule` property to
specify an array of wait times (in milliseconds) to wait before retrying the
function call again. In the following example, we will attempt to retry failed
callbacks three times - after one second, five seconds, and then ten seconds.

```ts
Deno.cron("Retry example", "* * * * *", () => {
  throw new Error("Deno.cron will retry this three times, to no avail!");
}, {
  backoffSchedule: [1000, 5000, 10000],
});
```

## TODO - describe the abort signal usage?

TODO

## Deno CLI and Deno Deploy

Like other Deno platform built-ins (like queues and Deno KV), the `Deno.cron`
implementation works slightly differently when run using the CLI or Deno Deploy.

### Local behavior

TODO: describe local behavior

### Deno Deploy behavior

TODO: describe Deploy behavior

When you make a production deployment that includes a cron task, you can view a
list of all your cron tasks in the
[Deploy dashboard](https://dash.deno.com/projects) under the `Cron` tab for your
project.

![a listing of cron tasks in the Deno dashboard](./images/cron-tasks.png)

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
