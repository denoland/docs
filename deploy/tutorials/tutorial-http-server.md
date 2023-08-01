# Simple HTTP server

In this tutorial, let's build a HTTP server that responds to all incoming HTTP
requests with `Hello World` and a `200 OK` HTTP status. We will be using the
Deno Deploy playground to deploy and edit this script.

## **Step 1:** Write the HTTP server script

Before we start writing the actual script, let's go over some basics: Deno
Deploy lets you listen for incoming HTTP requests using the same
[server side HTTP API][native-http] as the Deno CLI. This API is rather low
level though, so instead of using this API directly we'll use the high level
HTTP API exposed by [`std/http`][std-http].

This API revolves around the
[`serve`](https://deno.land/std@0.140.0/http/server.ts) function.

```js
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

serve((_req) => {/* .. */});
```

> Note: the port number we listen on is not important, as Deno Deploy will
> automatically route requests from the outside world to whatever port we listen
> on.

The handler function is called with two arguments: a [`Request`][request]
object, and a [`ConnInfo`][conninfo] object. The `Request` object contains the
request data, and the `ConnInfo` object contains information about the
underlying connection, such as the origin IP address. You must return a
[`Response`][response] object from the handler function.

Let's use this information to finish our hello world script:

```js
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

serve((_req) => {
  return new Response("Hello World!", {
    headers: { "content-type": "text/plain" },
  });
});
```

## **Step 2:** Deploy script to Deno Deploy

1. Create a new playground project by visiting https://dash.deno.com/new, and
   clicking the **Play** button under the **Playground** card.
2. On the next screen, copy the code above into the editor on the left side of
   the screen.
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
[std-http]: https://deno.land/std/http
[request]: ../api/runtime-request
[conninfo]: https://doc.deno.land/https/deno.land%2Fstd%2Fhttp%2Fserver.ts#ConnInfo
[response]: ../api/runtime-response
