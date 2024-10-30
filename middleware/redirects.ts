import type { RequestHandler } from "lume/core/server.ts";
import GO_LINKS from "../go.json" with { type: "json" };
import REDIRECT_LINKS from "../oldurls.json" with { type: "json" };
import { existsSync } from "@std/fs";
import type Site from "lume/core/site.ts";
import { Page } from "lume/core/file.ts";

export default async function redirectsMiddleware(req: Request, next: RequestHandler, info: Deno.ServeHandlerInfo): Promise<Response> {
    const redirects = getRedirects();

    let res: Response;
    try {
        const url = new URL(req.url);
        const redirect = redirects[url.pathname] ||
            (url.pathname.endsWith("/")
                ? redirects[url.pathname.slice(0, -1)]
                : redirects[url.pathname + "/"]);
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
        throw e;
    }
}

let redirectsSingleton: Record<string, string> | null = null;

function getRedirects() {
    if (redirectsSingleton) {
        return redirectsSingleton;
    }

    let redirects: Record<string, string> = {};

    if (existsSync("./_redirects.json")) {
        console.log(`redirectsMiddleware: Reading redirects from '_redirects.json'...`);
        const redirectsAsBytes = Deno.readFileSync("./_redirects.json");
        const redirectsAsString = new TextDecoder().decode(redirectsAsBytes);
        redirects = JSON.parse(redirectsAsString) as Record<string, string>;
    } else {
        console.log(`redirectsMiddleware: No './_redirects.json' found.`);
    }

    console.log(`redirectsMiddleware: Found ${Object.keys(redirects).length} redirects.`);
    console.log(`redirectsMiddleware: Adding additional redirects...`);

    redirects["/api/"] = "/api/deno/";

    console.log(`redirectsMiddleware: Reading redirects from 'go.json'...`);
    for (const [name, url] of Object.entries(GO_LINKS)) {
        redirects[`/go/${name}/`] = url;
    }

    console.log(`redirectsMiddleware: Reading redirects from 'oldurls.json'...`);
    for (const [name, url] of Object.entries(REDIRECT_LINKS)) {
        redirects[name] = url;
    }

    console.log(`redirectsMiddleware: Loaded ${Object.keys(redirects).length} redirects.`);

    redirectsSingleton = redirects;
    return redirectsSingleton;
}

type Status = 301 | 302 | 307 | 308;
type Redirect = [string, string, Status];

export function toFileAndInMemory(redirects: Redirect[], site: Site): void {
    jsonWriter(redirects, site);

    if (!redirectsSingleton) {
        redirectsSingleton = {};
    }

    for (const [from, to] of redirects) {
        redirectsSingleton[from] = to;
    }

    console.log(`toFileAndInMemory: Added ${redirects.length} redirects.`);
}

// Copied from redirects plugin because it's not exported :'(
function jsonWriter(redirects: Redirect[], site: Site): void {
    const obj = Object.fromEntries(
        redirects.map((
            [from, to, code],
        ) => [from, code === 301 ? to : { to, code }]),
    );
    const page = Page.create({
        url: "_redirects.json",
        content: JSON.stringify(obj, null, 2),
    });
    site.pages.push(page);
}