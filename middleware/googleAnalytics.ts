import { isDocument, isRedirect, formatStatus, isServerError, GA4Report } from "https://raw.githubusercontent.com/denoland/ga4/04a1ce209116f158b5ef1658b957bdb109db68ed/mod.ts";
import { type Event } from "ga4";
import type { RequestHandler } from "lume/core/server.ts";
import type Server from "lume/core/server.ts";
import nullMiddleware from "./null.ts";

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");

export default function createGAMiddleware(server: Server | { addr?: Deno.Addr } | null = null) {
    if (GA4_MEASUREMENT_ID == null) {
        console.warn("createGAMiddleware: GA4_MEASUREMENT_ID is not set. Google Analytics middleware will be disabled.");
        return nullMiddleware;
    }

    if (server == null) {
        console.warn("createGAMiddleware: Server object is not provided. Google Analytics middleware will be disabled.");
        return nullMiddleware;
    }

    return async function googleAnalyticsMiddleware(req: Request, next: RequestHandler, info: Deno.ServeHandlerInfo): Promise<Response> {
        let err;
        let res: Response;
        try {
            res = await next(req);
            return res;
        } catch (e) {
            res = new Response("Internal Server Error", {
                status: 500,
            });
            err = e;
            throw e;
        } finally {
            sendGAEvent(
                server,
                req,
                info.remoteAddr,
                res!,
                err,
            );
        }
    };
}

async function sendGAEvent(
    server: { addr?: Deno.Addr },
    request: Request,
    remoteAddr: Deno.Addr,
    response: Response,
    error?: unknown) {
    try {
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
    }
    catch (err) {
        console.error(`Internal error: ${err}`);
    }
}
