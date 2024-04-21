# Custom domains

[** Custom domains**](https://apidocs.deno.com/#get-/organizations/-organizationId-/domains)
can be dynamically mapped to deployments, giving them a unique URL (eg
`mycompany.com`).

Before a domain can be used you need to
[verify ownership and provision
or upload TLS certificates](https://github.com/denoland/deploy-api/blob/main/samples.ipynb).

If you are on the [Builder tier](https://deno.com/deploy/pricing?subhosting) you
can use wildcard domains. Once you have a wildcard domain registered, you can
use it in two ways:

- Send all requests for `*.mycompany.com` to a specific deployment
- (Coming soon) Assign different subdomains (e.g. `foo.mycompany.com` and
  `bar.mycompany.com`) to separate deployments.
