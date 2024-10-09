/**
 * @title Deno Cron
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --unstable-cron <url>
 * @resource {https://docs.deno.com/deploy/kv/manual/cron} Deno Cron user guide
 * @resource {https://docs.deno.com/api/deno/~/Deno.cron} Deno Cron Runtime API docs
 * @group Unstable APIs
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>Deno Cron is a cron task scheduler built into the Deno runtime and works with
 * zero configuration on Deno Deploy. There's no overlapping cron executions and
 * has automatic handler retries on exceptions.
 */

// Create a cron job called "Log a message" that runs once a minute.
Deno.cron("Log a message", "* * * * *", () => {
  console.log("This will print once a minute.");
});

// Create a cron job with a backoff schedule measured in milliseconds.
Deno.cron("Retry example", "* * * * *", {
  backoffSchedule: [1000, 5000, 10000],
}, () => {
  throw new Error("Deno.cron will retry this three times, to no avail!");
});
