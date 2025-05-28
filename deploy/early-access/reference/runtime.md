---
title: Runtime
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

In Deno Deploy<sup>EA</sup> all applications execute using a standard Deno
runtime in a secure, isolated Linux environment.

The Deno runtime used in Deno Deploy<sup>EA</sup> is the standard Deno runtime,
with full support for all features of the Deno CLI, including JSR and NPM
dependencies, reading and writing to the file system, making network requests,
spawning subprocesses, and loading FFI and node native addons.

The Deno runtime runs using `--allow-all` permissions.

Custom flags can not be passed to the Deno runtime.

## Runtime environment

The runtime environment is a Linux-based environment running either x64 or ARM64
architecture. The exact set of tools available in the runtime environment is
subject to change and thus can not be relied upon.

Currently Deno Deploy<sup>EA</sup> runs on Deno 2.3.2.

## Lifecycle

Deno Deploy<sup>EA</sup> runs applications in a serverless environment. This
means that applications are not always running, and are only started when a
request is received. When no incoming traffic to the application is received for
a period of time, the application is stopped.

Applications can be started and stopped at any time. They thus should also start
quickly to be able to respond to incoming requests without delay.

Multiple instances of the same application can be running at the same time. For
example, one instance could be running in the US and another in Europe. Each
instance is completely isolated from each other, and they do not share any CPU,
memory, or disk resources. Multiple instances can also be started in the same
region if needed, for example to handle high traffic, or while underlying
infrastructure is being updated.

### Startup

When the system decides to start an application, it will provision a new sandbox
environment to run the application in. This environment is isolated from all
other applications.

It then starts the application using the configured entrypoint and waits for the
HTTP server to start. If the application crashes before the HTTP server starts,
the request that triggered the start will fail with a 502 Bad Gateway error.

Once the application is started, incoming requests are routed to it and
responses are sent back to the client.

### Shutdown

The application is kept alive until no new incoming requests are received, or
responses (or response body bytes) are sent for a period of time. The exact
timeout is between 5 seconds and 10 minutes. WebSocket connections that are
actively transmitting data (including ping/pong frames) cause the application to
be kept alive too.

Once the system has decided to stop the application, it will send a `SIGINT`
signal to the application as a trigger to shut down. From this point on, the
application has 5 seconds to shut down gracefully before it will be forcibly
killed with a `SIGKILL` signal.

### Eviction

Sometimes an isolate may be shut down even if the application is actively
receiving traffic. Some examples of when this can happen are:

- An application was scaled up to handle load, but the load has decreased enough
  to be handled by a single instance again.
- The underlying server that is executing the instance is too resource
  constrained to continue running this application instance.
- The underlying infrastructure is being updated or has experienced a failure.

When the system decides to evict an application like this, it will attempt to
divert traffic away from the instance that is being evicted as early as
possible. Sometimes this means that a request will be held to wait for a new
instance to boot up even though an existing instance is already running.

When an application only serves requests that finish quickly, they usually do
not even notice evictions. For applications that serve long-running requests or
WebSockets, evictions can be more noticeable because it is possible that the
application needs to be evicted while still processing a request. The system
will try to avoid scenarios like this, but it is not always possible.

After traffic has been diverted away from the old instance, the system will send
a `SIGINT` signal to the old instance to trigger a graceful shutdown. The
application should then finish processing any remaining requests as quickly as
possible, and shut down websockets and other long-running connections. Clients
that make long running requests should be prepared to handle these disruptions
and re-connect when they are disconnected.

5 seconds after the `SIGINT` signal is sent, the old instance will be forcibly
killed with a `SIGKILL` signal if it has not already shut down gracefully.

## Cold starts

Because applications are not always running, they may need to be started when a
request is received. This is called a cold start. Cold starts in Deno Deploy
<sup>EA</sup> are highly optimized and complete within 100 milliseconds for
hello world applications, and within a couple hundred milliseconds for larger
applications.

Deno Deploy<sup>EA</sup> uses multiple optimizations to enable fast cold starts:

- Sandboxes and the Deno runtime are pre-provisioned to ensure that they do not
  have to be provisioned from scratch when starting an application.

- Applications are started immediately when the client sends the first TCP
  packet to establish a TLS connection. For fast starting applications, and
  depending on the network round trip latency to the user, this can mean that
  the application is already started before the client has even sent the HTTP
  request.

- File system access is optimized for files that are used frequently during
  startup. Deno Deploy<sup>EA</sup> analyzes file access patterns during the
  warmup phase of the build step and optimizes the file system to make these
  accesses faster.

When cold starts are slow, they can be noticeable to users. Because of this, it
is important to optimize applications to start up quickly. Here are some tips
for optimizing cold starts:

1. Minimize the amount of dependencies that your application uses.

2. Load infrequently accessed code and dependencies lazily using dynamic
   `import()`.

3. Minimize the amount of I/O operations that happen during startup, for example
   as top level `await`, especially network requests.

If you feel that your application is slow to start, please
[contact Deno support](../support) and we will help you investigate the issue.
