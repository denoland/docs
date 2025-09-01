import { Page } from "lume/core/file.ts";
import type Site from "lume/core/site.ts";
import { log } from "lume/core/utils/log.ts";
import { cliNow } from "../timeUtils.ts";

type Status = 301 | 302 | 307 | 308;
type Redirect = [string, string, Status];

// Build-time utility to handle redirects output
export function toFileAndInMemory(redirects: Redirect[], site: Site): void {
  jsonWriter(redirects, site);

  // Note: We don't set the singleton here since this runs at build time
  // The middleware will load from the generated JSON file at runtime

  log.warn(
    `${cliNow()} <cyan>toFileAndInMemory</cyan> Generated <green>${redirects.length}</green> redirects for build.`,
  );
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
