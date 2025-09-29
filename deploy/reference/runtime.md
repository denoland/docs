---
title: Runtime
description: "Details about the Deno Deploy runtime environment, including application lifecycle, startup, shutdown, and cold start optimization."
---

In Deno Deploy, all applications execute using a standard Deno runtime in a
secure, isolated Linux environment.

The Deno runtime used in Deno Deploy is [the standard Deno runtime](/runtime/),
with full support for all features of the Deno CLI, including JSR and NPM
dependencies, reading and writing to the file system, making network requests,
spawning subprocesses, and loading FFI and node native addons.

The Deno runtime runs using `--allow-all` permissions.

Custom flags cannot be passed to the Deno runtime.

## Runtime environment

The runtime environment is a Linux-based environment running either x64 or ARM64
architecture. The exact set of tools available in the runtime environment is
subject to change and thus cannot be relied upon.

Currently Deno Deploy runs on Deno 2.5.0

## Lifecycle

Deno Deploy runs applications in a serverless environment. This means that an
application is not always running and is only started when a request is
received. When no incoming traffic is received for a period of time, the
application is stopped.

Applications can be started and stopped at any time. They should start quickly
to respond to incoming requests without delay.

Multiple instances of the same application can run simultaneously. For example,
one instance could be running in the US and another in Europe. Each instance is
completely isolated from the others and they do not share CPU, memory, or disk
resources. Multiple instances can also start in the same region when needed,
such as to handle high traffic or during infrastructure updates.

### Startup

When the system decides to start an application, it provisions a new sandbox
environment for the application. This environment is isolated from all other
applications.

It then starts the application using the configured entrypoint and waits for the
HTTP server to start. If the application crashes before the HTTP server starts,
the request that triggered the start will fail with a 502 Bad Gateway error.

Once the application is started, incoming requests are routed to it and
responses are sent back to the client.

### Shutdown

The application remains alive until no new incoming requests are received or
responses (including response body bytes) are sent for a period of time. The
exact timeout is between 5 seconds and 10 minutes. WebSocket connections that
actively transmit data (including ping/pong frames) also keep the application
alive.

Once the system decides to stop the application, it sends a `SIGINT` signal to
the application as a trigger to shut down. From this point on, the application
has 5 seconds to shut down gracefully before it will be forcibly killed with a
`SIGKILL` signal.

### Eviction

Sometimes an isolate may shut down even if the application is actively receiving
traffic. Some examples of when this can happen are:

- An application was scaled up to handle load, but the load has decreased enough
  to be handled by a single instance again.
- The underlying server executing the instance is too resource constrained to
  continue running this application instance.
- The underlying infrastructure is being updated or has experienced a failure.

When the system decides to evict an application, it attempts to divert traffic
away from the instance being evicted as early as possible. Sometimes this means
that a request will wait for a new instance to boot up even though an existing
instance is already running.

When an application only serves requests that finish quickly, evictions are
usually unnoticeable. For applications that serve long-running requests or
WebSockets, evictions can be more noticeable because the application may need to
be evicted while still processing a request. The system will try to avoid these
scenarios, but it is not always possible.

After traffic has been diverted away from the old instance, the system sends a
`SIGINT` signal to trigger a graceful shutdown. The application should finish
processing any remaining requests quickly and shut down websockets and other
long-running connections. Clients making long-running requests should be
prepared to handle these disruptions and reconnect when disconnected.

5 seconds after the `SIGINT` signal is sent, the old instance will be forcibly
killed with a `SIGKILL` signal if it has not already shut down gracefully.

## Cold starts

Because applications are not always running, they may need to start when a
request is received. This is called a cold start. Cold starts in Deno Deploy are
highly optimized and complete within 100 milliseconds for hello world
applications, and within a few hundred milliseconds for larger applications.

Deno Deploy uses multiple optimizations to enable fast cold starts:

- Sandboxes and the Deno runtime are pre-provisioned to ensure they don't need
  to be created from scratch when starting an application.

- Applications start immediately when the client sends the first TCP packet to
  establish a TLS connection. For fast-starting applications, depending on the
  network round trip latency, the application may already be running before the
  client sends the HTTP request.

- File system access is optimized for frequently used startup files. Deno Deploy
  analyzes file access patterns during the build step's warmup phase and
  optimizes the file system for faster access.

When cold starts are slow, they can negatively impact user experience. To
optimize your application for quick startup:

1. Minimize dependencies used by your application.

2. Load infrequently accessed code and dependencies lazily using dynamic
   `import()`.

3. Minimize I/O operations during startup, especially top-level `await`
   operations and network requests.

If your application starts slowly, please [contact Deno support](../support) for
help investigating the issue.
