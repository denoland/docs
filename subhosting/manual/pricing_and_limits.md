# Pricing and Limits

## Deployment size

Deployments should be less than 1GB across all source code and assets in aggregate, per deployment.

## Deployment frequency

Bert to define, varies based on pricing tier. 

## CPU time per request

* 50ms or 200ms, depending on tier.
* CPU time limit per request is limited on the average across many requests. It is not strictly enforced on a per-request basis.
* Does not include time that a deployment is waiting for I/O (e.g. while waiting for the remote server while making a fetch() request)

## Blocking the event loop

Programs should not block the event loop for more than 1s.

## Available memory

512MB max memory is available.
