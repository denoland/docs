---
title: Observability
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Deno Deploy<sup>EA</sup> provides multiple observability features that can be
used to understand application performance, debug application errors, and
monitor application usage. These features are based on OpenTelemetry and the
[OpenTelemetry integration in Deno](/runtime/fundamentals/open_telemetry/).

There are three main observability features in Deno Deploy<sup>EA</sup>:

- **Logs**: unstructured debug information captured emitted by the application
  code.
- **Traces**: structured information about the handling of a request, including
  time taken for each step, and automatic capturing of outbound I/O through the
  likes of `fetch`.
- **Metrics**: structured, high level data about application performance and
  usage, such as request count, error count, and latency.

## Logs

Logs in Deno Deploy<sup>EA</sup> are captured using the standard `console` API.
The logs are queryable from the logs page in the Deno Deploy
<sup>EA</sup> dashboard.

Logs are viewed per application. The search bar on the logs page can be used to
filter based on the attributes below, and the log message.

Logs are associated with a specific trace and span if they are emitted inside
the context of a trace. For logs that have an associated trace, a "View trace"
button is shown in the logs page. This will open the relevant trace in an
overlay drawer for inspection.

## Traces

Traces in Deno Deploy<sup>EA</sup> are captured in three ways:

- Automatically for various built-in operations, such as incoming HTTP requests
  or outbound fetch. This can not be disabled.
- Automatically for some frameworks, such as Next.js, Fresh, and Astro. The
  exact set of frameworks and instrumented operations is subject to change.
- Manually when application code creates a new trace or span using the
  OpenTelemetry API. This requires manual instrumentation of the application
  code.

Traces are viewed per application. The search bar on the trace page can be used
to filter based on the attributes below, and the span name.

Clicking on a trace will open the trace overlay drawer, which shows all spans
that are part of the trace. The spans are shown in a waterfall view, which shows
the start and end time of each span, as well as the duration of each span. The
spans are grouped by their parent span, and the root span is shown at the top of
the waterfall view.

Clicking on any span will open the span details at the bottom of the drawer.
Captured span attributes are shown in a table here. For outbound HTTP requests
for example, this contains the HTTP method, URL, and status code.

In addition to the span attributes, the span details section also has a "Logs"
tab that shows all logs that were emitted in the context of the span.

Clicking on the "View logs" on the right of any trace will open the logs page
with the trace ID pre-filled in the search bar. This will show all logs that
were emitted in the context of the entire trace.

## Metrics

Metrics in Deno Deploy<sup>EA</sup> are captured automatically for various
built-in operations, such as incoming HTTP requests or outbound fetch. This can
not be disabled.

Metrics are viewed per application. The search bar on the metrics page can be
used to filter based on the attributes below. Metrics are shown in a time series
graph, which shows the value of the metric over time.

## Filtering

Logs, traces, and metrics can be filtered by general attributes:

- **Revision**: the ID of the application's revision that emitted the log,
  trace, or metric.

- **Context**: the context in which the log, trace, or metric was emitted. This
  can be either "Production" or "Development".

For logs and traces, the following additional filter is available:

- **Trace**: the ID of the trace that contained the log or spans.

For traces only, the following additional filter is available:

- **HTTP Method**: the HTTP method of the request that triggered the trace.

- **HTTP Path**: the path of the request that triggered the trace.

- **HTTP Status**: the HTTP status code of the response that was sent for the
  request that triggered the trace.

### Time range filter

By default, the logs, traces, and metrics pages show data for the last hour.
This can be changed using the time range filter in the top right corner of the
page. The time range filter can be set to a predefined time range, like "Last 1
hour", "Last 24 hours", or "Last 7 days", or a custom time range.

The custom time range can be set by clicking on the "Custom" button. A custom
time range can either be absolute (a specific start and end time) or relative (3
days ago, 1 hour from now, etc.). The time range filter is shown in the top
right corner of the page.

Relative time ranges use the same syntax as Grafana, where `now` is the current
time, and `now-1h` is 1 hour ago. Furthermore syntax such as `now-1h/h` can be
used to round the time to the nearest hour. Some examples:

- `now-1h` - 1 hour ago
- `now/h` - the start of the current hour
- `now-1h/h` - the start of the previous hour
- `now/d+3h` - 3 hours from the start of the current day
- `now-1d/d` - the start of the previous day
