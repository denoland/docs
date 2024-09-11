---
title: "Simple HTTP Web Server"
oldUrl:
  - /runtime/manual/examples/http_server/
---

## Introduction

An HTTP server is a software application that serves content over the web. It
listens for incoming requests from clients (like web browsers) and sends back
responses. HTTP servers are the backbone of the web, allowing you to access
websites, download files, and interact with web services. In simple terms, HTTP
servers deliver the content you see in your browser.

When you build your own HTTP server, you have complete control over its behavior
and can tailor it to your specific needs. You may be using it for local
development, to serve your HTML, CSS, and JavaScript files, or perhaps you're
building a REST API - having your own server lets you define endpoints, handle
requests and manage data.

## Tutorial

Deno offers multiple ways to create an HTTP server. In this tutorial, we'll look
at some of the most common methods.

### Deno.serve

The simplest way to create an HTTP server in Deno is by using `Deno.serve`.

We'll set up a basic HTTP server that responds to requests with the
[user-agent information](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent).
When you access the server at http://localhost:8080/, it will display the
user-agent string from your browser or client.

Create a new file called `server.ts` and add the following code:

```ts title="server.ts"
const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 200 });
};

console.log(`HTTP server running. Access it at: http://localhost:${port}/`);
Deno.serve({ port }, handler);
```

This code defines a function called `handler` that takes a `Request` object and
returns a `Response` object. The `handler` function extracts the user-agent
string from the request headers and sends it back as the response body.

The `Deno.serve` function creates an HTTP server that listens on the suggested
`port` and uses the `handler` function to process incoming requests.

You can run this code with:

```shell
deno run --allow-net server.ts
```

The server will start and display a message in the console. Open your browser
and navigate to [http://localhost:8080/](http://localhost:8080/) to see the
user-agent information.

The [`--allow-net` flag](/runtime/fundamentals/security/) is required to allow
the server to listen for incoming requests. This flag grants Deno permissions to
access the network.

### Initialise a server project

If you're planning to build a more complex server, you may want to create a new
project. Deno offers tools to do this for you using the `deno init` command:

```shell
deno init my_server --serve
```

This will create a basic http server project. You can then navigate into the
project directory and run the server with:

```shell
cd my_server
deno task dev
```

If you take a look at the `deno.json` file in your new project, you'll see a
`dev` task in the "tasks" field. This task serves the project and watches for
changes to your files.

```json title="deno.json"
"tasks": {
    "dev": "deno serve --watch -R main.ts"
},
```
