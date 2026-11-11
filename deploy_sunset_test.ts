import { assert, assertFalse } from "@std/assert";
import { isDeployPage } from "./_components/DeploySunset.tsx";

// Pages about Deno Deploy and Deno Sandbox carry the April 2027 sunset
// callout.
Deno.test("deploy sunset callout renders on Deploy and Sandbox pages", () => {
  for (
    const url of [
      "/deploy/",
      "/deploy/getting_started/",
      "/deploy/reference/tunnel/",
      "/deploy/kv/",
      "/deploy/kv/backup/",
      "/sandbox/",
      "/sandbox/volumes/",
      "/examples/sandbox_web_framework/",
      "/examples/sandbox_ssh_access/",
      "/examples/deno_deploy_tutorial/",
      "/examples/simple_api_tutorial/",
      "/examples/tunnel_tutorial/",
      "/examples/volumes_tutorial/",
      "/runtime/reference/cli/deploy/",
      "/runtime/reference/cli/sandbox/",
    ]
  ) {
    assert(isDeployPage(url), `expected callout on ${url}`);
  }
});

// Deploy Classic and Subhosting pages, and the guides for migrating off
// Classic, carry their own, earlier (July 20, 2026) shutdown warning; the
// April 2027 callout must not contradict it.
Deno.test("deploy sunset callout stays off Classic and Subhosting pages", () => {
  for (
    const url of [
      "/deploy/classic/",
      "/deploy/classic/deployctl/",
      "/deploy/classic/api/runtime-fetch/",
      "/deploy/kv/node/",
      "/deploy/migration_guide/",
      "/examples/migrate_custom_domain_tutorial/",
      "/subhosting/",
      "/subhosting/manual/",
      "/subhosting/api/authentication/",
    ]
  ) {
    assertFalse(isDeployPage(url), `expected no callout on ${url}`);
  }
});

// Everything else stays untouched.
Deno.test("deploy sunset callout stays off unrelated pages", () => {
  for (
    const url of [
      "/",
      "/runtime/",
      "/runtime/deploy/",
      "/runtime/reference/cli/run/",
      "/examples/",
      "/examples/hello_world/",
      "/examples/fresh_tutorial/",
      "/api/deno/",
    ]
  ) {
    assertFalse(isDeployPage(url), `expected no callout on ${url}`);
  }
});
