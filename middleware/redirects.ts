import { existsSync } from "@std/fs";
import type { RequestHandler } from "lume/core/server.ts";
import GO_LINKS from "../go.json" with { type: "json" };
import REDIRECT_LINKS from "../oldurls.json" with { type: "json" };
import { cliNow } from "../timeUtils.ts";
import { log } from "lume/core/utils/log.ts";

let redirectsSingleton: Record<string, string> | null = null;

function getRedirects() {
  if (redirectsSingleton) {
    return redirectsSingleton;
  }

  const redirects = loadFromJson();
  addGoLinksAndRedirectLinks(redirects);

  redirectsSingleton = redirects;
  return redirectsSingleton;
}

export default async function redirectsMiddleware(
  req: Request,
  next: RequestHandler,
  _info: Deno.ServeHandlerInfo,
): Promise<Response> {
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

function loadFromJson() {
  let redirects: Record<string, string> = {};

  if (existsSync("./_site/_redirects.json")) {
    log.debug(
      `🔗 <cyan>redirectsMiddleware</cyan>: Reading redirects from '_site/_redirects.json'...`,
    );
    const redirectsAsBytes = Deno.readFileSync("./_site/_redirects.json");
    const redirectsAsString = new TextDecoder().decode(redirectsAsBytes);
    redirects = JSON.parse(redirectsAsString) as Record<string, string>;
  } else {
    log.warn(
      `🔗 <cyan>redirectsMiddleware</cyan>: No './_site/_redirects.json' found.`,
    );
  }

  log.info(
    `🔗 <cyan>redirectsMiddleware</cyan>: Total number of redirects loaded: ${
      Object.keys(redirects).length
    }.`,
  );

  return redirects;
}

function addGoLinksAndRedirectLinks(redirects: Record<string, string>) {
  log.debug(
    `🔗 addGoLinksAndRedirectLinks: Adding additional redirects...`,
  );

  redirects["/api/"] = "/api/deno/";

  log.debug(
    `🔗 <cyan>redirectsMiddleware</cyan>: Reading redirects from 'go.json'...`,
  );
  for (const [name, url] of Object.entries(GO_LINKS)) {
    redirects[`/go/${name}/`] = url;
  }

  log.debug(
    `🔗 <cyan>redirectsMiddleware</cyan>: Reading redirects from 'oldurls.json'...`,
  );
  for (const [name, url] of Object.entries(REDIRECT_LINKS)) {
    redirects[name] = url;
  }

  log.warn(
    `🔗 <cyan>addGoLinksAndRedirectLinks</cyan>: Total number of redirects loaded: <green>${
      Object.keys(redirects).length
    }</green>.`,
  );
}
