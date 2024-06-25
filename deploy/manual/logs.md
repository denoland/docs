---
title: "Application logging"
---

Applications can generate logs at runtime using the console API, with methods
such as `console.log`, `console.error`, etc. These logs can be viewed in real
time by either:

- Navigating to the `Logs` panel of a project or deployment.
- Using the `logs` subcommand in
  [deployctl](https://docs.deno.com/deploy/manual/deployctl).

Logs will be streamed directly from the application to the log panel or
displayed in `deployctl logs`.

In addition to real-time logs, logs are also retained for a certain duration,
which depends on the subscription plan you are on. To view persisted logs, you
can:

- If you are using the log panel in your browser, switch from `Live` to either
  `Recent` or `Custom` in the dropdown menu next to the search box.
- If you prefer the command line, add `--since=<DATETIME>` and/or
  `--until=<DATETIME>` to your `deployctl logs` command. For more details,
  consult `deployctl logs --help`.

Logs older than the retention period are automatically deleted from the system.

Log messages have a maximum size of 2KB. Messages larger than this limit are
trimmed to 2KB.
