import { existsSync } from "@std/fs";
import type { RequestHandler } from "lume/core/server.ts";
import GO_LINKS from "../go.json" with { type: "json" };
import REDIRECT_LINKS from "../oldurls.json" with { type: "json" };
import { log } from "lume/core/utils/log.ts";

let redirectsSingleton: Record<string, string> | null = null;

interface WildcardRule {
  fromPrefix: string; // e.g. '/deploy/manual/'
  toPattern: string; // e.g. '/deploy/classic/*' or '/deploy/classic/'
  rawFrom: string; // original key including '*'
  rawTo: string; // original value
}
let wildcardRulesSingleton: WildcardRule[] | null = null;

function getRedirects() {
  if (redirectsSingleton && wildcardRulesSingleton) {
    return {
      redirects: redirectsSingleton,
      wildcardRules: wildcardRulesSingleton,
    };
  }

  const redirects = loadFromJson();
  addGoLinksAndRedirectLinks(redirects);

  const wildcardRules: WildcardRule[] = [];
  for (const [from, to] of Object.entries(redirects)) {
    if (from.endsWith("*") && from.indexOf("*") === from.length - 1) {
      const fromPrefix = from.slice(0, -1); // remove '*'
      wildcardRules.push({
        fromPrefix,
        toPattern: to,
        rawFrom: from,
        rawTo: to,
      });
    }
  }

  for (const rule of wildcardRules) {
    delete redirects[rule.rawFrom];
  }

  wildcardRules.sort((a, b) => b.fromPrefix.length - a.fromPrefix.length);

  redirectsSingleton = redirects;
  wildcardRulesSingleton = wildcardRules;
  log.info(
    `🔗 <cyan>redirectsMiddleware</cyan>: Wildcard rules loaded: ${wildcardRules.length}.`,
  );
  return {
    redirects: redirectsSingleton,
    wildcardRules: wildcardRulesSingleton,
  };
}

export default async function redirectsMiddleware(
  req: Request,
  next: RequestHandler,
  _info: Deno.ServeHandlerInfo,
): Promise<Response> {
  const { redirects, wildcardRules } = getRedirects();

  let res: Response;
  try {
    const url = new URL(req.url);
    let redirect: string | undefined = redirects[url.pathname] ||
      (url.pathname.endsWith("/")
        ? redirects[url.pathname.slice(0, -1)]
        : redirects[url.pathname + "/"]);

    // Wildcard matching (only if no exact match found)
    if (!redirect) {
      for (const rule of wildcardRules) {
        if (url.pathname.startsWith(rule.fromPrefix)) {
          const remainder = url.pathname.slice(rule.fromPrefix.length);
          const candidate = buildWildcardTarget(rule, remainder);
          if (candidate) {
            redirect = candidate;
            log.debug(
              `🔗 <cyan>redirectsMiddleware</cyan>: Wildcard match '${rule.rawFrom}' -> '${rule.rawTo}' for '${url.pathname}' => '${redirect}'.`,
            );
            break;
          }
        }
      }
    }
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

function buildWildcardTarget(
  rule: WildcardRule,
  remainder: string,
): string | null {
  const starIndex = rule.toPattern.indexOf("*");
  if (starIndex !== -1) {
    return rule.toPattern.slice(0, starIndex) + remainder +
      rule.toPattern.slice(starIndex + 1);
  }

  if (!remainder) return rule.toPattern; // Exact directory match
  if (rule.toPattern.endsWith("/") || rule.toPattern === "") {
    return rule.toPattern + remainder;
  }
  return rule.toPattern +
    (remainder.startsWith("/") ? remainder : "/" + remainder);
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
