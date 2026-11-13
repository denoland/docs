import { assert, assertFalse } from "@std/assert";
import { isDeployPage } from "./_components/DeploySunset.tsx";

// Pages about Deno Deploy, Subhosting and Deno Sandbox carry the April 2027
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
      "/subhosting/",
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
