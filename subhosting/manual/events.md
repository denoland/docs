# Deployment events

During the lifetime of a deployment execution, several events are recorded into
its execution logs. Using the
[deployment logs API](https://apidocs.deno.com/#get-/deployments/-deploymentId-/app_logs),
these event logs can be used to understand and monitor the behavior of your
deployments.

## Boot

```json
"isolate start time: 96.67 ms (user time: 6.13 ms)";
```

The `boot` event is emitted after the deployment has successfully booted and is
running. It logs the time elapsed since receiving the initial request that
prompted the deployment to boot, until the deployment is ready to start handling
it. Alongside the start time as a whole, the event also logs the part of it that
was spent executing the deployment's Javascript code (referred to as the "user
time").

## Memory Limit

```json
"Memory limit exceeded, terminated";
```

The `memory-limit` event is emitted when the deployment is terminated for
exceeding the
[memory limit allowed per deployment execution](https://deno.com/deploy/pricing?subhosting).
In some cases, it is followed by an event URN to cross-reference it with any
observability artifact generated as a result:

```json
"Memory limit exceeded, terminated (urn:dd-hard-memory-limit:deno:pcx8pcbpc34b:048730b1-0e1f-4df7-8f92-e64233415322)";
```

All the requests that where in-flight when the deployment was terminated receive
a 502 response with the code `"MEMORY_LIMIT"`.

## CPU Time Limit

```json
"CPU time limit exceeded, see https://deno.com/deploy/docs/pricing-and-limit (urn:dd-time-limit:deno:pcx8pcbpc34b:b8c729c0-e17a-4ce1-a6df-4267cbeb6d5c)";
```

The `time-limit` event is emitted when the deployment is terminated for
exceeding the
[CPU-time limit allowed per request](https://deno.com/deploy/pricing?subhosting).
The event URN included in the log can be used to cross-reference it with any
observability artifact generated as a result.

All the requests that where in-flight when the deployment was terminated receive
a 502 response with the code `"TIME_LIMIT"`.
