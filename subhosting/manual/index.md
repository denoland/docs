# About Subhosting

Deno Subhosting is a robust platform designed to allow Software as a Service
(SaaS) providers to securely run code written by their customers. The Subhosting
API allows you to deploy untrusted code programmatically and at scale.

## Key Features

- **Ease of Use:** Developers can write code in generic JavaScript or TypeScript
  without needing specific knowledge of Deno.
- **Standards Compliance:** Deno supports standard JavaScript and TypeScript and
  integrates widely-used web APIs like `fetch` and `web cache`.
- **Deno-Specific Advanced Features:** Offers advanced features like `KV`
  (Key-Value stores) which extend beyond typical browser capabilities.
- **Rapid Deployment:** Deno’s cloud products are designed to support extremely
  short deployment times that range from less than a second for simple
  applications, to around ten seconds for complex websites with numerous
  dependencies.
- **Improved developer experience**: Subhosting will manage the extensive effort
  of setting up secure infrastructure to run untrusted code in a public cloud
  for you.

## Overview of Deno Cloud Offerings - Deno Deploy and Deno Subhosting

Deno provides two distinct cloud offerings, Deno Deploy and Deno Subhosting,
each designed to support specific use cases while leveraging the same underlying
infrastructure.

### Deno Deploy

Deno Deploy is optimized for individual developers and small teams focused on
developing and iterating on a limited set of first-party projects. This solution
is ideal for hosting websites or applications, with deployment processes
typically managed through GitHub integrations.

- Target Audience: Individual developers and small development teams.
- Deployment Integration: Primarily through GitHub for continuous integration
  and delivery.
- Use Cases: Hosting websites and applications.

### Deno Subhosting

In contrast, Deno Subhosting is engineered to securely manage a larger volume of
projects and deployments. It supports the deployment of untrusted code or
functions through an API, making it suitable for scenarios involving multiple
end-users contributing code.

- Target Audience: SaaS platforms requiring the capability to host
  customer-generated, untrusted code securely.
- Deployment Mechanism: Through a robust API designed for scalability and
  security.
- Use Cases: Large scale project hosting where end-users contribute the code.

The steps to implement subhosting are roughly as follows:

1. [Create an organization](./quick_start.md) and get an access token for the
   REST API
1. [Create a project](./planning_your_implementation.md), and then create your
   first deployment for that project

Using these techniques, you can package up user code as "deployments", and
execute that code on a Deno-provisioned URL or a [custom URL](./subhosting#custom-domains) you can configure
yourself.

## REST API reference and OpenAPI spec

For a complete reference for the REST API used to implement subhosting, you can
[check out the docs here](https://apidocs.deno.com). The Deno Deploy REST API
also provides an [OpenAPI specification](https://api.deno.com/v1/openapi.json)
which can be used with
[a number of OpenAPI-compatible tools](https://openapi.tools/).
