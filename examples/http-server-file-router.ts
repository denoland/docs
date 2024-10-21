/**
 * @title HTTP server: File based Routing
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net --allow-read <url>
 * @resource {https://docs.deno.com/deploy/api/dynamic-import} Manual: Dynamic Import
 * @resource {https://docs.deno.com/runtime/manual/basics/modules} Manual: Modules
 * @resource {https://docs.deno.com/api/deno/~/Deno.serve} Doc: Deno.serve
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Request} MDN: Request
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Response} MDN: Response
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URL} MDN: URL
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Request/method} MDN: HTTP request methods
 * @group Network
 *
 * If you've used frameworks like Next.js, you might be familiar with file based routing.
 * You add a file in a specific directory and it automatically becomes a route.
 * This example demonstrates how to create a simple HTTP server that uses file based routing.
 * Note: This is not an exhaustive example and is meant to be a starting point.
 *
 * Permissions required:
 * `--allow-net`: To start the HTTP server.
 * `--allow-read`: To read files from the file system for dynamic import.
 */

// File: ./users.ts

// This is a simple module that exports a `GET` handler for the /users route.
// You may implement other HTTP methods such as `POST`, `PUT`, and `DELETE` in this file.
export function GET(_req: Request): Response {
  return new Response("Hello from user.ts", { status: 200 });
}

// File: ./main.ts

// This is the main file that will be used to route requests.
async function handler(req: Request): Promise<Response> {
  // Extract the path and method from the request.
  const url = new URL(req.url);

  // `path` could be any valid URL path such as /users, /posts, etc.
  // For paths like `/users`, the file `./users.ts` will be imported.
  // However, deeper paths like `/org/users` will require a file `./org/users.ts`.
  // So, you can create nested routes by creating nested directories and files.
  const path = url.pathname;

  // method could be any of the HTTP methods such as GET, POST, PUT, DELETE, etc.
  const method = req.method;
  let module;
  try {
    // Dynamically import the module based on the path.
    // Notice the `.` prefix before the path. The path is relative to the current file.
    // Be aware of caveats when using dynamic imports. [Read more](https://docs.deno.com/deploy/api/dynamic-import)
    module = await import(`.${path}.ts`);
  } catch (_error) {
    // If the module is not found, return a 404 response.
    return new Response("Not found", { status: 404 });
  }

  // Check if the module has the method handler.
  if (module[method]) {
    // Call the method handler with the request.
    return module[method](req);
  }

  // If the method handler is not found, return a 501:Not Implemented response.
  return new Response("Method not implemented", { status: 501 });
}

// Start the server on the default port.
Deno.serve(handler);
