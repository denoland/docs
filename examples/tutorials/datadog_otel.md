---
title: Using Deno with Datadog
description: "Learn how to monitor your Deno applications with Datadog using OpenTelemetry. This tutorial covers setup, configuration, and sending traces, metrics, and logs to Datadog."
url: /examples/datadog_otel_tutorial
---

# Using Deno with Datadog

This tutorial will guide you through integrating your Deno applications with
Datadog for monitoring and observability using OpenTelemetry.

## Prerequisites

- A Datadog account with an API key
- Deno installed on your system
- Basic knowledge of Deno and OpenTelemetry concepts

## Overview

Deno has built-in support for [OpenTelemetry](https://opentelemetry.io/), which
makes it possible to send telemetry data (traces, metrics, and logs) to Datadog.
This enables you to:

1. Monitor the performance of your Deno applications
2. Track and troubleshoot errors
3. Gain insights into application behavior and user patterns
4. Set up alerts for critical issues

## Setting Up Datadog with Deno

### Step 1: Configure Deno to use OpenTelemetry

To enable OpenTelemetry in Deno, you need to run your scripts with the
`--unstable-otel` flag and set the appropriate environment variables:

```sh
OTEL_DENO=true deno run --unstable-otel your_app.ts
```

### Step 2: Configure the OpenTelemetry exporter for Datadog

Datadog accepts data via the OpenTelemetry Protocol (OTLP). You'll need to
configure Deno to send data to Datadog's OTLP endpoint by setting the following
environment variables:

```sh
# For US region (replace <YOUR_API_KEY> with your Datadog API key)
export OTEL_EXPORTER_OTLP_ENDPOINT="https://api.datadoghq.com/api/v1/traces"
export OTEL_EXPORTER_OTLP_HEADERS="DD-API-KEY=<YOUR_API_KEY>"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"

# For EU region
# export OTEL_EXPORTER_OTLP_ENDPOINT="https://api.datadoghq.eu/api/v1/traces"
```

### Step 3: Configure service and resource information

Set service name and resource attributes to properly organize your data in
Datadog:

```sh
export OTEL_SERVICE_NAME="your-deno-service"
export OTEL_RESOURCE_ATTRIBUTES="deployment.environment=production,service.version=1.0.0"
```

### Step 4: Run your Deno application

Run your application with all the required configurations:

```sh
OTEL_DENO=true \
OTEL_SERVICE_NAME="your-deno-service" \
OTEL_RESOURCE_ATTRIBUTES="deployment.environment=production,service.version=1.0.0" \
OTEL_EXPORTER_OTLP_ENDPOINT="https://api.datadoghq.com/api/v1/traces" \
OTEL_EXPORTER_OTLP_HEADERS="DD-API-KEY=<YOUR_API_KEY>" \
OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf" \
deno run --unstable-otel your_app.ts
```

## Custom Instrumentation with Datadog

While Deno automatically instruments certain operations like HTTP requests, you
can add custom instrumentation to track specific operations in your application.

### Tracing with Custom Spans

```ts
import { trace } from "npm:@opentelemetry/api@1";

// Create a tracer
const tracer = trace.getTracer("my-deno-app", "1.0.0");

// Create a custom span
function processOrder(orderId: string) {
  return tracer.startActiveSpan("process_order", (span) => {
    try {
      // Add custom attributes to help filter and analyze in Datadog
      span.setAttribute("order.id", orderId);

      // Your business logic here
      const orderDetails = fetchOrderDetails(orderId);
      const result = processPayment(orderDetails);

      // More attributes based on the result
      span.setAttribute("payment.status", result.status);
      span.setAttribute("payment.amount", result.amount);

      return result;
    } catch (error) {
      // Record errors to show them in Datadog
      span.recordException(error);
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;
    } finally {
      // Always end the span
      span.end();
    }
  });
}
```

### Custom Metrics

You can create custom metrics to track business-specific data:

```ts
import { metrics } from "npm:@opentelemetry/api@1";

// Create a meter
const meter = metrics.getMeter("my-deno-app", "1.0.0");

// Create a counter for tracking orders
const orderCounter = meter.createCounter("orders.processed", {
  description: "Number of orders processed",
  unit: "1",
});

// Create a histogram for tracking order values
const orderValueHistogram = meter.createHistogram("orders.value", {
  description: "Distribution of order values",
  unit: "USD",
});

// Usage in code
function processOrder(order) {
  // Increment counter with attributes for segmentation in Datadog
  orderCounter.add(1, {
    "order.type": order.type,
    "customer.tier": order.customerTier,
  });

  // Record order value
  orderValueHistogram.record(order.totalAmount, {
    "order.type": order.type,
    "payment.method": order.paymentMethod,
  });

  // Process the order...
}
```

## Example: HTTP Server with Datadog Monitoring

Here's a complete example of a simple HTTP server with Datadog monitoring:

```ts
import { metrics, trace } from "npm:@opentelemetry/api@1";

// Create instrumentations
const tracer = trace.getTracer("deno-web-server", "1.0.0");
const meter = metrics.getMeter("deno-web-server", "1.0.0");

// Create metrics
const requestCounter = meter.createCounter("http.requests.total", {
  description: "Total number of HTTP requests",
  unit: "1",
});

const requestDuration = meter.createHistogram("http.requests.duration", {
  description: "HTTP request duration",
  unit: "ms",
});

// Define routes
const ROUTES = {
  INDEX: new URLPattern({ pathname: "/" }),
  USERS: new URLPattern({ pathname: "/users" }),
  USER: new URLPattern({ pathname: "/users/:id" }),
};

// Start HTTP server
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const startTime = performance.now();

  // Get the active span (created automatically by Deno.serve)
  const span = trace.getActiveSpan();

  try {
    // Route the request
    if (ROUTES.INDEX.test(url)) {
      // Update the span with route information
      span.setAttribute("http.route", "/");
      span.updateName(`${req.method} /`);

      return new Response("Welcome to our API");
    } else if (ROUTES.USERS.test(url)) {
      span.setAttribute("http.route", "/users");
      span.updateName(`${req.method} /users`);

      // Custom business logic span
      return tracer.startActiveSpan("fetch_users", (childSpan) => {
        try {
          // Simulate database query
          childSpan.setAttribute("db.operation", "SELECT");
          childSpan.setAttribute("db.table", "users");

          const users = [{ id: 1, name: "User 1" }, { id: 2, name: "User 2" }];
          return new Response(JSON.stringify(users), {
            headers: { "Content-Type": "application/json" },
          });
        } finally {
          childSpan.end();
        }
      });
    } else if (ROUTES.USER.test(url)) {
      const match = ROUTES.USER.exec(url);
      const userId = match?.pathname.groups.id;

      span.setAttribute("http.route", "/users/:id");
      span.updateName(`${req.method} /users/:id`);
      span.setAttribute("user.id", userId);

      return new Response(`User ID: ${userId}`);
    } else {
      span.setAttribute("http.route", "not_found");
      return new Response("Not Found", { status: 404 });
    }
  } catch (error) {
    // Record the error
    span.recordException(error);
    span.setStatus({
      code: trace.SpanStatusCode.ERROR,
      message: (error as Error).message,
    });

    return new Response("Internal Server Error", { status: 500 });
  } finally {
    // Record metrics
    const duration = performance.now() - startTime;

    requestCounter.add(1, {
      "http.method": req.method,
      "http.route": span.getAttribute("http.route") as string,
      "http.status_code": 200, // Simplified for this example
    });

    requestDuration.record(duration, {
      "http.method": req.method,
      "http.route": span.getAttribute("http.route") as string,
    });
  }
});

console.log("Server running on http://localhost:8000");
```

## Viewing Data in Datadog

After setting up your application and generating some telemetry data:

1. Log in to your Datadog account
2. Navigate to APM > Traces to view distributed traces
3. Check APM > Services to see your service metrics
4. Use Metrics Explorer to create custom dashboards
5. Navigate to Logs if you've enabled log collection

## Advanced Configuration

### Sampling

To control the volume of data sent to Datadog, you can adjust trace sampling:

```sh
# Sample only 20% of traces
export OTEL_TRACES_SAMPLER=parentbased_traceidratio
export OTEL_TRACES_SAMPLER_ARG=0.2
```

### Separate Endpoints for Different Telemetry Types

You can configure separate endpoints for metrics, traces, and logs:

```sh
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="https://api.datadoghq.com/api/v1/traces"
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT="https://api.datadoghq.com/api/v1/metrics"
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT="https://api.datadoghq.com/api/v1/logs"
```

### Console Logging Configuration

Control how console logs are handled with OpenTelemetry:

```sh
# Options: capture, replace, ignore
export OTEL_DENO_CONSOLE="capture"
```

## Troubleshooting

### No Data in Datadog

1. Verify your API key is correct
2. Check that your endpoint URLs match your Datadog region
3. Ensure `OTEL_DENO` is set to `true`
4. Verify you're using the `--unstable-otel` flag

### Missing Spans or Metrics

1. Check your service name is correctly set
2. Ensure spans are properly ended with `span.end()`
3. For metrics, ensure you're using the correct types (counter, histogram, etc.)

🦕 Using Deno with Datadog via OpenTelemetry provides powerful monitoring
capabilities for your applications. By following this tutorial, you can set up
comprehensive observability for your Deno services, track performance metrics,
and quickly identify and resolve issues.

The OpenTelemetry integration in Deno is still under development. Check the
[OTEL docs](/runtime/fundamentals/open_telemetry/) for updates and changes to
the API.
