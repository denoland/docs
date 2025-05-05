---
title: File-based routing
description: "Tutorial on implementing file-based routing in Deno. Learn how to create a dynamic routing system similar to Next.js, handle HTTP methods, manage nested routes, and build a flexible server architecture."
url: /examples/file_based_routing_tutorial/
oldUrl:
- /examples/http-server-file-router/
- /runtime/tutorials/file_based_routing/
---

If you've used frameworks like [Next.js](https://nextjs.org/), you might be
familiar with file based routing - you add a file in a specific directory and it
automatically becomes a route. This tutorial demonstrates how to create a simple
HTTP server that uses file based routing.

## Route requests

Create a new file called `server.ts`. This file will be used to route requests.
Set up an async function called `handler` that takes a request object as an
argument:

```ts title="server.ts"
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  let module;

  try {
    module = await import(`.${path}.ts`);
  } catch (_error) {
    return new Response("Not found", { status: 404 });
  }

  if (module[method]) {
    return module[method](req);
  }

  return new Response("Method not implemented", { status: 501 });
}

Deno.serve(handler);
```

The `handler` function sets up a path variable which contains the path,
extracted from the request URL, and a method variable which contains the request
method.

It then tries to import a module based on the path. If the module is not found,
it returns a 404 response.

If the module is found, it checks if the module has a method handler for the
request method. If the method handler is found, it calls the method handler with
the request object. If the method handler is not found, it returns a 501
response.

Finally, it serves the handler function using `Deno.serve`.

> The path could be any valid URL path such as `/users`, `/posts`, etc. For
> paths like `/users`, the file `./users.ts` will be imported. However, deeper
> paths like `/org/users` will require a file `./org/users.ts`. You can create
> nested routes by creating nested directories and files.

## Handle requests

Create a new file called `users.ts` in the same directory as `server.ts`. This
file will be used to handle requests to the `/users` path. We'll use a `GET`
request as an example. You could add more HTTP methods such as `POST`, `PUT`,
`DELETE`, etc.

In `users.ts`, set up an async function called `GET` that takes a request object
as an argument:

```ts title="users.ts"
export function GET(_req: Request): Response {
  return new Response("Hello from user.ts", { status: 200 });
}
```

## Start the server

To start the server, run the following command:

```sh
deno run --allow-net --allow-read server.ts
```

This will start the server on `localhost:8080`. You can now make a `GET` request
to `localhost:8000/users` and you should see the response `Hello from user.ts`.

This command requires the `--allow-net` and `--allow-read`
[permissions flags](/runtime/fundamentals/security/) to allow access to the
network to start the server and to read the `users.ts` file from the file
system.

🦕 Now you can set up routing in your apps based on file structure. You can
extend this example to add more routes and methods as needed.

<small>Thanks to [@naishe](https://github.com/naishe) for contributing this
tutorial.</small>
