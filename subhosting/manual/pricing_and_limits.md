# Pricing and Limits

## Deployment size

Deployments should be less than 1GB across all source code and assets in
aggregate, per deployment.

## Deployment frequency

The maximum number of deployments per hour that a subhosting user can make is
either 60 (on the free tier) or 300 (on the builder tier). Higher limits are
available for organizations on the enterprise plan.

## CPU time per request

- 50ms or 200ms, depending on tier.
- CPU time limit per request is limited on the average across many requests. It
  is not strictly enforced on a per-request basis.
- Does not include time that a deployment is waiting for I/O (e.g. while waiting
  for the remote server while making a fetch() request)

## Blocking the event loop

Programs should not block the event loop for more than 1s.

## Available memory

512MB max memory is available.
