---
title: "Pricing and limitations"
---

Please see [our pricing page](https://deno.com/deploy/pricing) for the overview
of the available features in all plans. If you have a use case that exceeds any
of these limits, [please reach out](mailto:deploy@deno.com).

No uptime guarantees are provided during the initial public beta for Deno
Deploy. Access to the service will be controlled by
[our acceptable use policy](/deploy/manual/acceptable-use-policy). Any user we
deem to be in violation of this policy, runs the risk of having their account
terminated.

## Maximum size for deployments

When uploading assets to a deployment, the total size of all files within the
deployment (source files and static files) **should not exceed 1 gigabyte**.

## Memory allocation

Applications have a maximum memory allocation of 512MB

## TLS proxying

TLS termination is required for outgoing connections to port 443 (the port used
for HTTPS). Using [Deno.connect](https://docs.deno.com/api/deno/~/Deno.connect)
to connect to these ports is prohibited. If you need to establish a TLS
connection to port 443, please use
[Deno.connectTls](https://docs.deno.com/api/deno/~/Deno.connectTls) instead.
`fetch` is not impacted by this restriction.

This restriction is in place because connecting to port 443 without terminating
TLS is frequently used in TLS-over-TLS proxies, which are prohibited on Deno
Deploy as per [our acceptable use policy](/deploy/manual/acceptable-use-policy).
