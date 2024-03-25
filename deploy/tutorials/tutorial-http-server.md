# Simple HTTP server

In this tutorial, let's build a HTTP server that responds to all incoming HTTP
requests with `Hello, world!` and a `200 OK` HTTP status. We will be using the
Deno Deploy playground to deploy and edit this script.

## **Step 1:** Write the HTTP server script

A simple HTTP server can be written with a single line of code in Deno using
[`Deno.serve`](https://deno.land/api?s=Deno.serve):

```js title="One-line HTTP server"
Deno.serve(() => new Response("Hello, world!"));
```

While this type of server is useful for getting started, `Deno.serve` is capable
of supporting more advanced usage as well
([API reference docs](https://deno.land/api?s=Deno.serve)). Below is an example
of a more complex server that takes advantage of other API features.

```ts title="More complex Hello World server"
Deno.serve({
  onListen: ({ port }) => {
    console.log("Deno server listening on *:", port);
  },
}, (req: Request, conn: Deno.ServeHandlerInfo) => {
  // Get information about the incoming request
  const method = req.method;
  const ip = conn.remoteAddr.hostname;
  console.log(`${ip} just made an HTTP ${method} request.`);

  // Return a web standard Response object
  return new Response("Hello, world!");
});
```

## **Step 2:** Deploy script to Deno Deploy

1. Create a new playground project by visiting https://dash.deno.com/new, and
   clicking the **Play** button under the **Playground** card.
2. On the next screen, copy the code above (either the short or the longer
   example) into the editor on the left side of the screen.
3. Press the **Save & Deploy** button on the right side of the top toolbar (or
   press <kbd>Ctrl</kbd>+<kbd>S</kbd>).

You can preview the result on the right side of the playground editor, in the
preview pane.

You will see that if you change the script (for example `Hello, World!` ->
`Hello, Galaxy!`) and then re-deploy, the preview will automatically update. The
URL shown at the top of the preview pane can be used to visit the deployed page
from anywhere.

Even in the playground editor, scripts are deployed worldwide across our entire
global network. This guarantees fast and reliable performance, no matter the
location of your users.

[native-http]: https://deno.land/manual@v1.15.1/runtime/http_server_apis
[std-http]: https://jsr.io/@std/http
[request]: ../api/runtime-request
[conninfo]: https://doc.deno.land/https/deno.land%2Fstd%2Fhttp%2Fserver.ts#ConnInfo
[response]: ../api/runtime-response
