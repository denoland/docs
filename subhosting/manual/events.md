# Deployment events

During the lifetime of a deployment execution, several events are recorded into
its execution logs. Using the
[deployment logs API](https://apidocs.deno.com/#get-/deployments/-deploymentId-/app_logs),
these event logs can be used to understand and monitor the behavior of your
deployments.

The following events are emitted during the execution of a deployment:

| Event         | Log Line                                                                       | Description                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `boot`        | `isolate start time: 96.67 ms (user time: 6.13 ms)`                            | The deployment booted successfully                                                                                                                                               |
| `memoryLimit` | `Memory limit exceeded, terminated`                                            | The deployment exceeded the memory limit and exited. In some cases, it is followed by an event URN to cross-reference it with any observability artifact generated as a result   |
| `timeLimit`   | `CPU time limit exceeded, see https://deno.com/deploy/docs/pricing-and-limits` | The deployment exceeded the CPU time limit and exited. In some cases, it is followed by an event URN to cross-reference it with any observability artifact generated as a result |
