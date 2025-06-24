---
title: "Getting Started with OpenTelemetry in Deno"
description: "Set up basic OpenTelemetry instrumentation in a Deno application. This tutorial covers creating a simple HTTP server with custom metrics and traces, and viewing the telemetry data."
url: /examples/basic_opentelemetry_tutorial/
---

OpenTelemetry provides powerful observability tools for your applications. With
Deno's built-in OpenTelemetry support, you can easily instrument your code to
collect metrics, traces, and logs.

This tutorial will walk you through setting up a simple Deno application with
OpenTelemetry instrumentation.

## Prerequisites

- Deno 2.3 or later

## Step 1: Create a Simple HTTP Server

Let's start by creating a basic HTTP server that simulates a small web
application:

```ts title="server.ts"
import { metrics, trace } from "npm:@opentelemetry/api@1";

// Create a tracer and meter for our application
const tracer = trace.getTracer("my-server", "1.0.0");
const meter = metrics.getMeter("my-server", "1.0.0");

// Create some metrics
const requestCounter = meter.createCounter("http_requests_total", {
  description: "Total number of HTTP requests",
});

const requestDuration = meter.createHistogram("http_request_duration_ms", {
  description: "HTTP request duration in milliseconds",
  unit: "ms",
});

// Start the server
Deno.serve({ port: 8000 }, (req) => {
  // Record the start time for measuring request duration
  const startTime = performance.now();

  // Create a span for this request
  return tracer.startActiveSpan("handle_request", async (span) => {
    try {
      // Extract the path from the URL
      const url = new URL(req.url);
      const path = url.pathname;

      // Add attributes to the span
      span.setAttribute("http.route", path);
      span.setAttribute("http.method", req.method);
      span.updateName(`${req.method} ${path}`);

      // Add an event to the span
      span.addEvent("request_started", {
        timestamp: startTime,
        request_path: path,
      });

      // Simulate some processing time
      const waitTime = Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // Add another event to the span
      span.addEvent("processing_completed");

      // Create the response
      const response = new Response(`Hello from ${path}!`, {
        headers: { "Content-Type": "text/plain" },
      });

      // Record metrics
      requestCounter.add(1, {
        method: req.method,
        path,
        status: 200,
      });

      const duration = performance.now() - startTime;
      requestDuration.record(duration, {
        method: req.method,
        path,
      });

      span.setAttribute("request.duration_ms", duration);

      return response;
    } catch (error) {
      // Record error in span
      if (error instanceof Error) {
        span.recordException(error);
        span.setStatus({
          code: trace.SpanStatusCode.ERROR,
          message: error.message,
        });
      }

      return new Response("Internal Server Error", { status: 500 });
    } finally {
      // Always end the span
      span.end();
    }
  });
});
```

This server:

1. Creates a tracer and meter for our application
2. Sets up metrics to count requests and measure their duration
3. Creates a span for each request with attributes and events
4. Simulates some processing time
5. Records metrics for each request

## Step 2: Run the Server with OpenTelemetry Enabled

To run the server with OpenTelemetry, use these flags:

```sh
OTEL_DENO=true OTEL_SERVICE_NAME=my-server deno run --unstable-otel --allow-net server.ts
```

## Step 3: Create a Test Client

Let's create a simple client to send requests to our server:

```ts title="client.ts"
// Send 10 requests to different paths
for (let i = 0; i < 10; i++) {
  const path = ["", "about", "users", "products", "contact"][i % 5];
  const url = `http://localhost:8000/${path}`;

  console.log(`Sending request to ${url}`);

  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log(`Response from ${url}: ${text}`);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
  }
}
```

## Step 4: Run the Client

In a separate terminal, run the client:

```sh
deno run --allow-net client.ts
```

## Step 5: View the Telemetry Data

By default, Deno exports telemetry data to `http://localhost:4318` using the
OTLP protocol. You'll need an OpenTelemetry collector to receive and visualize
this data.

### Setting up a Local Collector

The quickest way to get started is with a local LGTM stack (Loki, Grafana,
Tempo, Mimir) in Docker:

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
  -v "$PWD"/lgtm/grafana:/data/grafana \
  -v "$PWD"/lgtm/prometheus:/data/prometheus \
  -v "$PWD"/lgtm/loki:/data/loki \
  -e GF_PATHS_DATA=/data/grafana \
  docker.io/grafana/otel-lgtm:0.8.1
```

Then access Grafana at http://localhost:3000 (username: admin, password: admin).

In Grafana, you can:

1. View **Traces** in Tempo to see the individual request spans
2. View **Metrics** in Mimir/Prometheus to see request counts and durations
3. View **Logs** in Loki to see any logs from your application

## Understanding What You're Seeing

### Traces

In the Traces view, you'll see spans for:

- Each HTTP request processed by your server
- Each fetch request made by your client
- The relationships between these spans

Click on any span to see its details, including:

- Duration
- Attributes (http.route, http.method, etc.)
- Events (request_started, processing_completed)

### Metrics

In the Metrics view, you can query for:

- `http_requests_total` - The counter tracking the number of HTTP requests
- `http_request_duration_ms` - The histogram of request durations

You can also see built-in Deno metrics like:

- `http.server.request.duration`
- `http.server.active_requests`

### Logs

In the Logs view, you'll see all console logs from your application with correct
trace context.

## Troubleshooting

If you're not seeing data in your collector:

1. Check that you've set `OTEL_DENO=true` and used the `--unstable-otel` flag
2. Verify the collector is running and accessible at the default endpoint
3. Check if you need to set `OTEL_EXPORTER_OTLP_ENDPOINT` to a different URL
4. Look for errors in your Deno console output

Remember that OpenTelemetry support in Deno is still marked as unstable and may
change in future versions.

🦕 This tutorial provides a simple starting point for users who want to
experiment with OpenTelemetry in Deno without diving into more complex concepts
immediately.

This basic example can be extended in many ways:

- Add more custom metrics for business logic
- Create additional spans for important operations
- Use baggage to pass context attributes between services
- Set up alerts based on metrics thresholds

For more advanced usage, see our
[Distributed Tracing with Context Propagation](/examples/otel_span_propagation_tutorial/)
tutorial.
