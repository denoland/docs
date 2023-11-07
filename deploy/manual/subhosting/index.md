# About Subhosting

A powerful use case for Deno Deploy is using our isolate cloud to run untrusted
code on behalf of your end users. There are a number of scenarios where you
might be interested in doing this:

- You are a SaaS provider that wants to empower your customers to extend your
  platform with custom code
- You are an infrastructure provider that would like to enable your customers to
  run Deno-powered edge functions
- You are building a browser-based editor for user code (possibly for
  education), and you'd like a place to execute that code in a controlled and
  secure way

In cases like these, you might consider using Deno Deploy's full-featured
[REST API](/deploy/api/rest) to implement
[**subhosting**](https://deno.com/subhosting). "Subhosting" is what we call the
scenario where you use Deno Deploy to run your users' untrusted code in a secure
and scalable environment designed for
[multitenancy](https://www.ibm.com/topics/multi-tenant).

## How subhosting works

To build subhosting with Deno Deploy, it helps to understand some key resources
within the system. These resources are also represented in the
[REST API](/deploy/api/rest).

![overview of subhosting resources](./subhosting-org-structure.svg)

- [**Organizations**](/deploy/api/rest/organizations): Organizations are a
  container for all data related to a subhosting implementation. Other Deploy
  users can be invited to collaborate on an organization, and
  [access tokens](https://dash.deno.com/account#access-tokens) can give
  developers with organization access the ability to modify resources within the
  org via API. New organizations can be created in the
  [Deploy dashboard](https://dash.deno.com/orgs/new).
- [**Projects**](/deploy/api/rest/projects): a project is a container for
  **deployments**, and the analytics and usage information for all deployments
  within a project.
- [**Deployments**](/deploy/api/rest/deployments): a deployment is a set of
  configuration, runnable code, and supporting static files that can run on an
  isolate in Deno Deploy. Deployments have an entry file that can launch a
  server, can have a [Deno KV](/kv/manual) database associated with them, and
  can be set up to run on custom domains.
- [**Domains**](/deploy/api/rest/domains): custom domains that can be associated
  with deployments, giving them a unique URL.

The steps to implement subhosting are roughly as follows:

1. [Create an organization](./getting_started) and get an access token for the
   REST API
1. [Create a project](./projects_and_deployments), and then create your first
   deployment for that project
1. [Provision a domain](./domains) and associate that domain with a deployment

Using these techniques, you can package up user code as "deployments", and
execute that code on a Deno-provisioned URL or a custom URL you can configure
yourself.

## REST API reference and OpenAPI spec

For a complete reference for the REST API used to implement subhosting, you can
[check out the docs here](/deploy/api/rest). The Deno Deploy REST API also
provides an [OpenAPI specification](https://api.deno.com/v1/openapi.json) which
can be used with [a number of OpenAPI-compatible tools](https://openapi.tools/).
