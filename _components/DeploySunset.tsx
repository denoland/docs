// Deno Deploy and Deno Sandbox shut down in April 2027. Every page that
// documents them carries this callout, mounted once from the doc layout so
// no page content needs to change.
//
// Deploy Classic and the Subhosting v1 API shut down earlier, on July 20,
// 2026, and their pages already carry that warning, so this callout stays
// off them: a second, later deadline on the same page would be misleading.

const SECTION_PREFIXES = ["/deploy/", "/sandbox/", "/examples/sandbox_"];

// Pages inside the sections above that document Deploy Classic and carry
// their own July 20, 2026 warning.
const EXCLUDED_PREFIXES = ["/deploy/classic/", "/deploy/kv/node/"];

// Deploy-only pages that live outside the sections above.
const EXTRA_PAGES = new Set([
  "/runtime/reference/cli/deploy/",
  "/runtime/reference/cli/sandbox/",
  "/examples/deno_deploy_tutorial/",
  "/examples/deploy_command_tutorial/",
  "/examples/deploy_otel_tutorial/",
  "/examples/migrate_custom_domain_tutorial/",
  "/examples/tunnel_tutorial/",
  "/examples/tunnel_telemetry_tutorial/",
  "/examples/tunnel_database_tutorial/",
  "/examples/volumes_tutorial/",
  "/examples/snapshots_tutorial/",
  "/examples/snapshot_python_tutorial/",
]);

export function isDeployPage(url: string): boolean {
  if (EXCLUDED_PREFIXES.some((prefix) => url.startsWith(prefix))) {
    return false;
  }
  return SECTION_PREFIXES.some((prefix) => url.startsWith(prefix)) ||
    EXTRA_PAGES.has(url);
}

export default function DeploySunset({ url }: { url: string }) {
  if (!isDeployPage(url)) return null;

  return (
    <aside
      role="note"
      aria-label="Deno Deploy sunset notice"
      class="admonition warning deploy-sunset bg-orange-50 dark:bg-orange-950/40 mt-0 mb-6"
    >
      <p class="font-bold text-base text-orange-700 dark:text-orange-300">
        Deno Deploy will be sunset in April 2027
      </p>
      <p>
        Your existing applications keep running until then.{" "}
        <a href="https://deno.com/blog/cloudflare">Read the announcement</a>
      </p>
    </aside>
  );
}
