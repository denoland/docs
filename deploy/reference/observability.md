---
title: Observability
description: "Comprehensive overview of monitoring features in Deno Deploy, including logs, traces, metrics, and filtering options."
---

Deno Deploy provides comprehensive observability features to help you understand
application performance, debug errors, and monitor usage. These features
leverage OpenTelemetry and the
[built-in OpenTelemetry integration in Deno](/runtime/fundamentals/open_telemetry/).

The three main observability features in Deno Deploy are:

- **Logs**: Unstructured debug information emitted by your application code
- **Traces**: Structured information about request handling, including execution
  time for each step and automatic capture of outbound I/O operations
- **Metrics**: Structured, high-level data about application performance and
  usage, such as request count, error count, and latency

## Logs

Logs in Deno Deploy are captured using the standard `console` API and can be
queried from the logs page in the dashboard.

Logs are organized by application. You can use the search bar to filter logs
based on various attributes and message content.

When logs are emitted inside the context of a trace, they become associated with
that specific trace and span. For such logs, a "View trace" button appears in
the logs interface, allowing you to open the relevant trace in an overlay drawer
for detailed inspection.

## Traces

Traces in Deno Deploy are captured in three ways:

- **Automatically for built-in operations**: Incoming HTTP requests, outbound
  fetch calls, and other system operations are traced automatically. This cannot
  be disabled.
- **Automatically for supported frameworks**: Frameworks like Next.js, Fresh,
  and Astro include built-in instrumentation. The specific frameworks and
  operations covered may change over time.
- **Manually through custom instrumentation**: Your application code can create
  new traces or spans using the OpenTelemetry API.

Traces are organized by application. The search bar lets you filter based on
various attributes and span names.

Clicking a trace opens the trace overlay drawer, showing all spans within that
trace in a waterfall view. This visualization displays the start time, end time,
and duration of each span, grouped by parent span with the root span at the top.

Clicking any span shows its details at the bottom of the drawer, including all
captured attributes. For example, outbound HTTP requests include the method,
URL, and status code.

The span details section also includes a "Logs" tab showing all logs emitted
within the selected span's context.

You can click "View logs" on any trace to open the logs page with the trace ID
pre-filled in the search bar, showing all logs related to that trace.

## Metrics

Metrics in Deno Deploy are automatically captured for various operations such as
incoming HTTP requests and outbound fetch calls. This automatic capture cannot
be disabled.

Metrics are organized by application and displayed in time-series graphs showing
values over time. You can use the search bar to filter metrics based on various
attributes.

## Filtering

Logs, traces, and metrics can be filtered using these general attributes:

- **Revision**: The ID of the application revision that emitted the data
- **Context**: The context in which the data was emitted ("Production" or
  "Development")

For logs and traces, this additional filter is available:

- **Trace**: The ID of the trace containing the log or spans

For traces only, these additional filters are available:

- **HTTP Method**: The HTTP method of the request that triggered the trace
- **HTTP Path**: The path of the request that triggered the trace
- **HTTP Status**: The HTTP status code of the response

### Time range filter

By default, the observability pages show data for the last hour. You can change
this using the time range filter in the top right corner of each page.

You can select predefined time ranges like "Last 1 hour," "Last 24 hours," or
"Last 7 days," or set a custom time range by clicking the "Custom" button.

Custom time ranges can be either absolute (specific start and end times) or
relative (e.g., 3 days ago, 1 hour from now). Relative time ranges use the same
syntax as Grafana:

- `now` - the current time
- `now-1h` - 1 hour ago
- `now/h` - the start of the current hour
- `now-1h/h` - the start of the previous hour
- `now/d+3h` - 3 hours from the start of the current day
- `now-1d/d` - the start of the previous day page. The time range filter can be
  set to a predefined time range, like "Last 1 hour", "Last 24 hours", or "Last
  7 days", or a custom time range.

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
