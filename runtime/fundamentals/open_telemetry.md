---
title: OpenTelemetry
description: "Learn how to implement observability in Deno applications using OpenTelemetry. Covers tracing, metrics collection, and integration with monitoring systems."
---

:::caution

The OpenTelemetry integration for Deno is still in development and may change.
To use it, you must pass the `--unstable-otel` flag to Deno.

:::

Deno has built in support for [OpenTelemetry](https://opentelemetry.io/).

> OpenTelemetry is a collection of APIs, SDKs, and tools. Use it to instrument,
> generate, collect, and export telemetry data (metrics, logs, and traces) to
> help you analyze your software’s performance and behavior.
>
> <i>- https://opentelemetry.io/</i>

This integration enables you to monitor your Deno applications using
OpenTelemetry observability tooling with instruments like logs, metrics, and
traces.

Deno provides the following features:

- Exporting of collected metrics, traces, and logs to a server using the
  OpenTelemetry protocol.
- [Automatic instrumentation](#auto-instrumentation) of the Deno runtime with
  OpenTelemetry metrics, traces, and logs.
- [Collection of user defined metrics, traces, and logs](#user-metrics) created
  with the `npm:@opentelemetry/api` package.

## Quick start

To enable the OpenTelemetry integration, run your Deno script with the
`--unstable-otel` flag and set the environment variable `OTEL_DENO=true`:

```sh
OTEL_DENO=true deno run --unstable-otel my_script.ts
```

This will automatically collect and export runtime observability data to an
OpenTelemetry endpoint at `localhost:4318` using Protobuf over HTTP
(`http/protobuf`).

:::tip

If you do not have an OpenTelemetry collector set up yet, you can get started
with a
[local LGTM stack in Docker](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)
(Loki (logs), Grafana (dashboard), Tempo (traces), and Mimir (metrics)) by
running the following command:

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
```

You can then access the Grafana dashboard at `http://localhost:3000` with the
username `admin` and password `admin`.

:::

This will automatically collect and export runtime observability data like
`console.log`, traces for HTTP requests, and metrics for the Deno runtime.
[Learn more about auto instrumentation](#auto-instrumentation).

You can also create your own metrics, traces, and logs using the
`npm:@opentelemetry/api` package.
[Learn more about user defined metrics](#user-metrics).

## Auto instrumentation

Deno automatically collects and exports some observability data to the OTLP
endpoint.

This data is exported in the built-in instrumentation scope of the Deno runtime.
This scope has the name `deno`. The version of the Deno runtime is the version
of the `deno` instrumentation scope. (e.g. `deno:2.1.4`).

### Traces

Deno automatically creates spans for various operations, such as:

- Incoming HTTP requests served with `Deno.serve`.
- Outgoing HTTP requests made with `fetch`.

#### `Deno.serve`

When you use `Deno.serve` to create an HTTP server, a span is created for each
incoming request. The span automatically ends when response headers are sent
(not when the response body is done sending).

The name of the created span is `${method}`. The span kind is `server`.

The following attributes are automatically added to the span on creation:

- `http.request.method`: The HTTP method of the request.
- `url.full`: The full URL of the request (as would be reported by `req.url`).
- `url.scheme`: The scheme of the request URL (e.g. `http` or `https`).
- `url.path`: The path of the request URL.
- `url.query`: The query string of the request URL.

After the request is handled, the following attributes are added:

- `http.status_code`: The status code of the response.

Deno does not automatically add a `http.route` attribute to the span as the
route is not known by the runtime, and instead is determined by the routing
logic in a user's handler function. If you want to add a `http.route` attribute
to the span, you can do so in your handler function using
`npm:@opentelemetry/api`. In this case you should also update the span name to
include the route.

```ts
import { trace } from "npm:@opentelemetry/api@1";

const INDEX_ROUTE = new URLPattern({ pathname: "/" });
const BOOK_ROUTE = new URLPattern({ pathname: "/book/:id" });

Deno.serve(async (req) => {
  const span = trace.getActiveSpan();
  if (INDEX_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/");
    span.updateName(`${req.method} /`);

    // handle index route
  } else if (BOOK_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/book/:id");
    span.updateName(`${req.method} /book/:id`);

    // handle book route
  } else {
    return new Response("Not found", { status: 404 });
  }
});
```

#### `fetch`

When you use `fetch` to make an HTTP request, a span is created for the request.
The span automatically ends when the response headers are received.

The name of the created span is `${method}`. The span kind is `client`.

The following attributes are automatically added to the span on creation:

- `http.request.method`: The HTTP method of the request.
- `url.full`: The full URL of the request.
- `url.scheme`: The scheme of the request URL.
- `url.path`: The path of the request URL.
- `url.query`: The query string of the request URL.

After the response is received, the following attributes are added:

- `http.status_code`: The status code of the response.

### Metrics

The following metrics are automatically collected and exported:

#### `Deno.serve` / `Deno.serveHttp`

##### `http.server.request.duration`

A histogram of the duration of incoming HTTP requests served with `Deno.serve`
or `Deno.serveHttp`. The time that is measured is from when the request is
received to when the response headers are sent. This does not include the time
to send the response body. The unit of this metric is seconds. The histogram
buckets are
`[0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0]`.

This metric is recorded with the following attributes:

- `http.request.method`: The HTTP method of the request.
- `url.scheme`: The scheme of the request URL.
- `network.protocol.version`: The version of the HTTP protocol used for the
  request (e.g. `1.1` or `2`).
- `server.address`: The address that the server is listening on.
- `server.port`: The port that the server is listening on.
- `http.response.status_code`: The status code of the response (if the request
  has been handled without a fatal error).
- `error.type`: The type of error that occurred (if the request handling was
  subject to an error).

##### `http.server.active_requests`

A gauge of the number of active requests being handled by `Deno.serve` or
`Deno.serveHttp` at any given time. This is the number of requests that have
been received but not yet responded to (where the response headers have not yet
been sent). This metric is recorded with the following attributes:

- `http.request.method`: The HTTP method of the request.
- `url.scheme`: The scheme of the request URL.
- `server.address`: The address that the server is listening on.
- `server.port`: The port that the server is listening on.

##### `http.server.request.body.size`

A histogram of the size of the request body of incoming HTTP requests served
with `Deno.serve` or `Deno.serveHttp`. The unit of this metric is bytes. The
histogram buckets are
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`.

This metric is recorded with the following attributes:

- `http.request.method`: The HTTP method of the request.
- `url.scheme`: The scheme of the request URL.
- `network.protocol.version`: The version of the HTTP protocol used for the
  request (e.g. `1.1` or `2`).
- `server.address`: The address that the server is listening on.
- `server.port`: The port that the server is listening on.
- `http.response.status_code`: The status code of the response (if the request
  has been handled without a fatal error).
- `error.type`: The type of error that occurred (if the request handling was
  subject to an error).

##### `http.server.response.body.size`

A histogram of the size of the response body of incoming HTTP requests served
with `Deno.serve` or `Deno.serveHttp`. The unit of this metric is bytes. The
histogram buckets are
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`.

This metric is recorded with the following attributes:

- `http.request.method`: The HTTP method of the request.
- `url.scheme`: The scheme of the request URL.
- `network.protocol.version`: The version of the HTTP protocol used for the
  request (e.g. `1.1` or `2`).
- `server.address`: The address that the server is listening on.
- `server.port`: The port that the server is listening on.
- `http.response.status_code`: The status code of the response (if the request
  has been handled without a fatal error).
- `error.type`: The type of error that occurred (if the request handling was
  subject to an error).

### Logs

The following logs are automatically collected and exported:

- Any logs created with `console.*` methods such as `console.log` and
  `console.error`.
- Any logs created by the Deno runtime, such as debug logs, `Downloading` logs,
  and similar.
- Any errors that cause the Deno runtime to exit (both from user code, and from
  the runtime itself).

Logs raised from JavaScript code will be exported with the relevant span
context, if the log occurred inside of an active span.

`console` auto instrumentation can be configured using the `OTEL_DENO_CONSOLE`
environment variable:

- `capture`: Logs are emitted to stdout/stderr and are also exported with
  OpenTelemetry. (default)
- `replace`: Logs are only exported with OpenTelemetry, and not emitted to
  stdout/stderr.
- `ignore`: Logs are emitted only to stdout/stderr, and will not be exported
  with OpenTelemetry.

## User metrics

In addition to the automatically collected telemetry data, you can also create
your own metrics and traces using the `npm:@opentelemetry/api` package.

You do not need to configure the `npm:@opentelemetry/api` package to use it with
Deno. Deno sets up the `npm:@opentelemetry/api` package automatically when the
`--unstable-otel` flag is passed. There is no need to call
`metrics.setGlobalMeterProvider()`, `trace.setGlobalTracerProvider()`, or
`context.setGlobalContextManager()`. All configuration of resources, exporter
settings, etc. is done via environment variables.

Deno works with version `1.x` of the `npm:@opentelemetry/api` package. You can
either import directly from `npm:@opentelemetry/api@1`, or you can install the
package locally with `deno add` and import from `@opentelemetry/api`.

```sh
deno add npm:@opentelemetry/api@1
```

For both traces and metrics, you need to define names for the tracer and meter
respectively. If you are instrumenting a library, you should name the tracer or
meter after the library (such as `my-awesome-lib`). If you are instrumenting an
application, you should name the tracer or meter after the application (such as
`my-app`). The version of the tracer or meter should be set to the version of
the library or application.

### Traces

To create a new span, first import the `trace` object from
`npm:@opentelemetry/api` and create a new tracer:

```ts
import { trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");
```

Then, create a new span using the `tracer.startActiveSpan` method and pass a
callback function to it. You have to manually end the span by calling the `end`
method on the span object returned by `startActiveSpan`.

```ts
function myFunction() {
  return tracer.startActiveSpan("myFunction", (span) => {
    try {
      // do myFunction's work
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

`span.end()` should be called in a `finally` block to ensure that the span is
ended even if an error occurs. `span.recordException` and `span.setStatus`
should also be called in a `catch` block, to record any errors that occur.

Inside of the callback function, the created span is the "active span". You can
get the active span using `trace.getActiveSpan()`. The "active span" will be
used as the parent span for any spans created (manually, or automatically by the
runtime) inside of the callback function (or any functions that are called from
the callback function).
[Learn more about context propagation](#context-propagation).

The `startActiveSpan` method returns the return value of the callback function.

Spans can have attributes added to them during their lifetime. Attributes are
key value pairs that represent structured metadata about the span. Attributes
can be added using the `setAttribute` and `setAttributes` methods on the span
object.

```ts
span.setAttribute("key", "value");
span.setAttributes({ success: true, "bar.count": 42n, "foo.duration": 123.45 });
```

Values for attributes can be strings, numbers (floats), bigints (clamped to
u64), booleans, or arrays of any of these types. If an attribute value is not
one of these types, it will be ignored.

The name of a span can be updated using the `updateName` method on the span
object.

```ts
span.updateName("new name");
```

The status of a span can be set using the `setStatus` method on the span object.
The `recordException` method can be used to record an exception that occurred
during the span's lifetime. `recordException` creates an event with the
exception stack trace and name and attaches it to the span. **`recordException`
does not set the span status to `ERROR`, you must do that manually.**

```ts
import { SpanStatusCode } from "npm:@opentelemetry/api@1";

span.setStatus({
  code: SpanStatusCode.ERROR,
  message: "An error occurred",
});
span.recordException(new Error("An error occurred"));

// or

span.setStatus({
  code: SpanStatusCode.OK,
});
```

Spans can also have
[events](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addEvent)
and
[links](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addLink)
added to them. Events are points in time that are associated with the span.
Links are references to other spans.

Spans can also be created manually with `tracer.startSpan` which returns a span
object. This method does not set the created span as the active span, so it will
not automatically be used as the parent span for any spans created later, or any
`console.log` calls. A span can manually be set as the active span for a
callback, by using the [context propagation API](#context-propagation).

Both `tracer.startActiveSpan` and `tracer.startSpan` can take an optional
options bag containing any of the following properties:

- `kind`: The kind of the span. Can be `SpanKind.CLIENT`, `SpanKind.SERVER`,
  `SpanKind.PRODUCER`, `SpanKind.CONSUMER`, or `SpanKind.INTERNAL`. Defaults to
  `SpanKind.INTERNAL`.
- `startTime` A `Date` object representing the start time of the span, or a
  number representing the start time in milliseconds since the Unix epoch. If
  not provided, the current time will be used.
- `attributes`: An object containing attributes to add to the span.
- `links`: An array of links to add to the span.
- `root`: A boolean indicating whether the span should be a root span. If
  `true`, the span will not have a parent span (even if there is an active
  span).

After the options bag, both `tracer.startActiveSpan` and `tracer.startSpan` can
also take a `context` object from the
[context propagation API](#context-propagation).

Learn more about the full tracing API in the
[OpenTelemetry JS API docs](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.TraceAPI.html).

### Metrics

To create a metric, first import the `metrics` object from
`npm:@opentelemetry/api` and create a new meter:

```ts
import { metrics } from "npm:@opentelemetry/api@1";

const meter = metrics.getMeter("my-app", "1.0.0");
```

Then, an instrument can be created from the meter, and used to record values:

```ts
const counter = meter.createCounter("my_counter", {
  description: "A simple counter",
  unit: "1",
});

counter.add(1);
counter.add(2);
```

Each recording can also have associated attributes:

```ts
counter.add(1, { color: "red" });
counter.add(2, { color: "blue" });
```

:::tip

In OpenTelemetry, metric attributes should generally have low cardinality. This
means that there should not be too many unique combinations of attribute values.
For example, it is probably fine to have an attribute for which continent a user
is on, but it would be too high cardinality to have an attribute for the exact
latitude and longitude of the user. High cardinality attributes can cause
problems with metric storage and exporting, and should be avoided. Use spans and
logs for high cardinality data.

:::

There are several types of instruments that can be created with a meter:

- **Counter**: A counter is a monotonically increasing value. Counters can only
  be positive. They can be used for values that are always increasing, such as
  the number of requests handled.

- **UpDownCounter**: An up-down counter is a value that can both increase and
  decrease. Up-down counters can be used for values that can increase and
  decrease, such as the number of active connections or requests in progress.

- **Gauge**: A gauge is a value that can be set to any value. They are used for
  values that do not "accumulate" over time, but rather have a specific value at
  any given time, such as the current temperature.

- **Histogram**: A histogram is a value that is recorded as a distribution of
  values. Histograms can be used for values that are not just a single number,
  but a distribution of numbers, such as the response time of a request in
  milliseconds. Histograms can be used to calculate percentiles, averages, and
  other statistics. They have a predefined set of boundaries that define the
  buckets that the values are placed into. By default, the boundaries are
  `[0.0, 5.0, 10.0, 25.0, 50.0, 75.0, 100.0, 250.0, 500.0, 750.0, 1000.0, 2500.0, 5000.0, 7500.0, 10000.0]`.

There are also several types of observable instruments. These instruments do not
have a synchronous recording method, but instead return a callback that can be
called to record a value. The callback will be called when the OpenTelemetry SDK
is ready to record a value, for example just before exporting.

```ts
const counter = meter.createObservableCounter("my_counter", {
  description: "A simple counter",
  unit: "1",
});
counter.addCallback((res) => {
  res.observe(1);
  // or
  res.observe(1, { color: "red" });
});
```

There are three types of observable instruments:

- **ObservableCounter**: An observable counter is a counter that can be observed
  asynchronously. It can be used for values that are always increasing, such as
  the number of requests handled.
- **ObservableUpDownCounter**: An observable up-down counter is a value that can
  both increase and decrease, and can be observed asynchronously. Up-down
  counters can be used for values that can increase and decrease, such as the
  number of active connections or requests in progress.
- **ObservableGauge**: An observable gauge is a value that can be set to any
  value, and can be observed asynchronously. They are used for values that do
  not "accumulate" over time, but rather have a specific value at any given
  time, such as the current temperature.

Learn more about the full metrics API in the
[OpenTelemetry JS API docs](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.MetricsAPI.html).

## Context propagation

In OpenTelemetry, context propagation is the process of passing some context
information (such as the current span) from one part of an application to
another, without having to pass it explicitly as an argument to every function.

In Deno, context propagation is done using the rules of `AsyncContext`, the TC39
proposal for async context propagation. The `AsyncContext` API is not yet
exposed to users in Deno, but it is used internally to propagate the active span
and other context information across asynchronous boundaries.

A quick overview how AsyncContext propagation works:

- When a new asynchronous task is started (such as a promise, or a timer), the
  current context is saved.
- Then some other code can execute concurrently with the asynchronous task, in a
  different context.
- When the asynchronous task completes, the saved context is restored.

This means that async context propagation essentially behaves like a global
variable that is scoped to the current asynchronous task, and is automatically
copied to any new asynchronous tasks that are started from this current task.

The `context` API from `npm:@opentelemetry/api@1` exposes this functionality to
users. It works as follows:

```ts
import { context } from "npm:@opentelemetry/api@1";

// Get the currently active context
const currentContext = context.active();

// You can add create a new context with a value added to it
const newContext = currentContext.setValue("id", 1);

// The current context is not changed by calling setValue
console.log(currentContext.getValue("id")); // undefined

// You can run a function inside a new context
context.with(newContext, () => {
  // Any code in this block will run with the new context
  console.log(context.active().getValue("id")); // 1

  // The context is also available in any functions called from this block
  function myFunction() {
    return context.active().getValue("id");
  }
  console.log(myFunction()); // 1

  // And it is also available in any asynchronous callbacks scheduled from here
  setTimeout(() => {
    console.log(context.active().getValue("id")); // 1
  }, 10);
});

// Outside, the context is still the same
console.log(context.active().getValue("id")); // undefined
```

The context API integrates with spans too. For example, to run a function in the
context of a specific span, the span can be added to a context, and then the
function can be run in that context:

```ts
import { context, trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");

const span = tracer.startSpan("myFunction");
const contextWithSpan = trace.setSpan(context.active(), span);

context.with(contextWithSpan, () => {
  const activeSpan = trace.getActiveSpan();
  console.log(activeSpan === span); // true
});

// Don't forget to end the span!
span.end();
```

Learn more about the full context API in the
[OpenTelemetry JS API docs](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.ContextAPI.html).

## Configuration

The OpenTelemetry integration can be enabled by setting the `OTEL_DENO=true`
environment variable.

The endpoint and protocol for the OTLP exporter can be configured using the
`OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_PROTOCOL` environment
variables.

If the endpoint requires authentication, headers can be configured using the
`OTEL_EXPORTER_OTLP_HEADERS` environment variable.

Endpoint can all be overridden individually for metrics, traces, and logs by
using specific environment variables, such as:

- `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT`
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`
- `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT`

For more information on headers that can be used to configure the OTLP exporter,
[see the OpenTelemetry website](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options).

The resource that is associated with the telemetry data can be configured using
the `OTEL_SERVICE_NAME` and `OTEL_RESOURCE_ATTRIBUTES` environment variables. In
addition to attributes set via the `OTEL_RESOURCE_ATTRIBUTES` environment
variable, the following attributes are automatically set:

- `service.name`: If `OTEL_SERVICE_NAME` is not set, the value is set to
  `<unknown_service>`.
- `process.runtime.name`: `deno`
- `process.runtime.version`: The version of the Deno runtime.
- `telemetry.sdk.name`: `deno-opentelemetry`
- `telemetry.sdk.language`: `deno-rust`
- `telemetry.sdk.version`: The version of the Deno runtime, plus the version of
  the `opentelemetry` Rust crate being used by Deno, separated by a `-`.

Metric collection frequency can be configured using the
`OTEL_METRIC_EXPORT_INTERVAL` environment variable. The default value is `60000`
milliseconds (60 seconds).

Span exporter batching can be configured using the batch span processor
environment variables described in the
[OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-span-processor).

Log exporter batching can be configured using the batch log record processor
environment variables described in the
[OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-log-record-processor).

## Limitations

While the OpenTelemetry integration for Deno is in development, there are some
limitations to be aware of:

- Traces are always sampled (i.e. `OTEL_TRACE_SAMPLER=parentbased_always_on`).
- Traces do not support events.
- Traces only support links with no attributes.
- Automatic propagation of the trace context in `Deno.serve` and `fetch` is not
  supported.
- Metric exemplars are not supported.
- Custom log streams (e.g. logs other than `console.log` and `console.error`)
  are not supported.
- The only supported exporter is OTLP - other exporters are not supported.
- Only `http/protobuf` and `http/json` protocols are supported for OTLP. Other
  protocols such as `grpc` are not supported.
- Metrics from observable (asynchronous) meters are not collected on process
  exit/crash, so the last value of metrics may not be exported. Synchronous
  metrics are exported on process exit/crash.
- The limits specified in the `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT`,
  `OTEL_ATTRIBUTE_COUNT_LIMIT`, `OTEL_SPAN_EVENT_COUNT_LIMIT`,
  `OTEL_SPAN_LINK_COUNT_LIMIT`, `OTEL_EVENT_ATTRIBUTE_COUNT_LIMIT`, and
  `OTEL_LINK_ATTRIBUTE_COUNT_LIMIT` environment variable are not respected for
  trace spans.
- The `OTEL_METRIC_EXPORT_TIMEOUT` environment variable is not respected.
- HTTP methods are that are not known are not normalized to `_OTHER` in the
  `http.request.method` span attribute as per the OpenTelemetry semantic
  conventions.
- The HTTP server span for `Deno.serve` does not have an OpenTelemetry status
  set, and if the handler throws (ie `onError` is invoked), the span will not
  have an error status set and the error will not be attached to the span via
  event.
- There is no mechanism to add a `http.route` attribute to the HTTP client span
  for `fetch`, or to update the span name to include the route.
