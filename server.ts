import Server from "lume/core/server.ts";
import REDIRECTS from "./_redirects.json" with { type: "json" };
import GO_LINKS from "./go.json" with { type: "json" };
import REDIRECT_LINKS from "./oldurls.json" with { type: "json" };
import {
  type Event,
  formatStatus,
  GA4Report,
  isDocument,
  isRedirect,
  isServerError,
} from "ga4";
import { apiDocumentContentTypeMiddleware } from "./middleware.ts";

const server = new Server({
  port: 8000,
  root: ".",
});

REDIRECTS["/api/"] = "/api/deno/";

for (const [name, url] of Object.entries(GO_LINKS)) {
  REDIRECTS[`/go/${name}/`] = url;
}

for (const [name, url] of Object.entries(REDIRECT_LINKS)) {
  REDIRECTS[name] = url;
}

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");
function ga4(
  request: Request,
  remoteAddr: Deno.Addr,
  response: Response,
  error?: unknown,
) {
  Promise.resolve().then(async () => {
    if (request.method !== "GET") {
      return;
    }

    if (!isDocument(request, response) && error == null) {
      return;
    }

    let event: Event | null = null;
    if (isRedirect(response)) {
      const redirectLocation = response.headers.get("location");
      event = { name: "redirect", params: { redirectLocation } };
    } else {
      const fetchDest = request.headers.get("sec-fetch-dest");
      if (fetchDest) {
        if (/^(document|i?frame|video)$/.test(fetchDest)) {
          event = { name: "page_view", params: {} };
        } else {
          event = null; // Don't report asset downloads.
        }
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType != null && /text\/html/.test(contentType)) {
          event = { name: "page_view", params: {} }; // Probably an old browser.
        } else {
          event = { name: "file_download", params: {} };
        }
      }
    }

    if (event == null && error == null) {
      return;
    }

    if (event != null) {
      // And add some extra HTTP metadata to the event.
      event.params.httpRequestMethod = request.method;
      event.params.httpResponseStatus = formatStatus(response);
      event.params.clientType = "browser";
    }

    // If an exception was thrown, build a separate event to report it.
    let exceptionEvent;
    if (error != null) {
      exceptionEvent = {
        name: "exception",
        params: {
          description: String(error),
          fatal: isServerError(response),
        },
      };
    } else {
      exceptionEvent = undefined;
    }

    // Create basic report.
    const report = new GA4Report({
      measurementId: GA4_MEASUREMENT_ID,
      request,
      response,
      conn: {
        remoteAddr,
        localAddr: server.addr!,
      },
    });

    // Override the default (page_view) event.
    report.event = event;

    // Add the exception event, if any.
    if (exceptionEvent != null) {
      report.events.push(exceptionEvent);
    }

    await report.send();
  }).catch((err) => {
    console.error(`Internal error: ${err}`);
  });
}

server.use(async (req, next, info) => {
  let err;
  let res: Response;
  try {
    const url = new URL(req.url, "http://localhost:8000");
    const redirect = REDIRECTS[url.pathname] ||
      (url.pathname.endsWith("/")
        ? REDIRECTS[url.pathname.slice(0, -1)]
        : REDIRECTS[url.pathname + "/"]);
    if (redirect) {
      res = new Response(null, {
        status: 301,
        headers: {
          "Location": redirect,
        },
      });
    } else {
      res = await next(req);
    }
    return res;
  } catch (e) {
    res = new Response("Internal Server Error", {
      status: 500,
    });
    err = e;
    throw e;
  } finally {
    ga4(
      req,
      info.remoteAddr,
      res!,
      err,
    );
  }
});
server.use(apiDocumentContentTypeMiddleware);

server.start();

console.log("Listening on http://localhost:8000");
