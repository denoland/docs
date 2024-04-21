- [**Deployments**](https://apidocs.deno.com/#get-/projects/-projectId-/deployments):
  a deployment is a set of configuration, runnable code, and supporting static
  files that can run on an isolate in Deno Deploy. Deployments have an entry
  file that can launch a server, can have a [Deno KV](/deploy/kv/manual)
  database associated with them, and can be set up to run on custom domains.

Deployments A deployment is an immutable object that consists of: Source code to
run Static assets Environment variables Database bindings Other settings We
provide endpoints for Querying or streaming build logs Querying or streaming
execution logs
