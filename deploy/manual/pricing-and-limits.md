# Pricing and limitations

See [the pricing page](https://www.deno.com/deploy/pricing) for the overview of
the available features in Free and Pro plans.

No uptime guarantees are provided during the initial public beta for Deno
Deploy. Access to the service will be controlled by
[our fair use policy](https://www.deno.com/deploy/fair-use-policy). Any user we
deem to be in violation of this policy, runs the risk of having their account
terminated.

During the initial public beta, the following hard limits apply. If any runtime
limits are exceeded, all related requests will be immediately terminated, and a
warning will be logged to the deployment's logs.

| Feature                   | Free                                                    | Pro                                                                          |
| ------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Request count             | Up to 1M req/month                                      | Includes 5M requests, then $2 / M requests                                   |
| Data transfer             | Up to 100 GiB outbound data per month (inbound is free) | Includes 1 TiB of outbound data transfer, then $0.50 / GiB (inbound is free) |
| Memory                    | 512 MB                                                  | 512 MB                                                                       |
| CPU Time per request      | 10 ms                                                   | 50 ms                                                                        |
| Environment variable size | 8 KB                                                    | 8 KB                                                                         |
| ES modules per deployment | 1000                                                    | 1000                                                                         |
| Deployment script size    | 20 MB                                                   | 20 MB                                                                        |
| Deployments per hour      | 30                                                      | 30                                                                           |
| Custom domains            | 50                                                      | 50                                                                           |
| BroadcastChannel          | 64KB/sec send rate per isolate, no limit on receive     | The same as Free                                                             |

> Isolate: an instance of your deployment running in any one of the
> [available regions](regions). Isolates are created and destroyed on
> demand based on traffic to your deployment.

If you have a use case that exceeds any of these limits,
[please reach out](mailto:deploy@deno.com).

## Deno KV

While in closed beta, Deno KV will not charge for storage and includes up to 1GB
of storage per user. In the future, you can expect pricing to reflect similar
storage products where you will only be charged for the amount of storage used
above a free base tier.

## TLS proxying

On the Free plan, TLS termination is required for outgoing connections to port
443 (the port used for HTTPS). Using
[Deno.connect](https://deno.land/api?s=Deno.connect) to connect to these ports
is prohibited. If you need to establish a TLS connection to port 443, please use
[Deno.connectTls](https://deno.land/api?s=Deno.connectTls) instead. `fetch` is
not impacted by this restriction.

This restriction is in place because connecting to port 443 without terminating
TLS is frequently used in TLS-over-TLS proxies, which are prohibited on the Deno
Deploy Free plan as per our Fair Use Policy.

This restriction impacts Free tier customers only. Pro tier customers are able
to connect to port 443 with both `Deno.connect` and `Deno.connectTls`.
