---
title: "Regions"
---

Deno Deploy deploys your code throughout the world. Each new request is served
from the closest region to your user. Deploy is presently located in the
following regions:

1. Tokyo (`asia-northeast1`)
1. Singapore (`asia-southeast1`)
1. London (`europe-west2`)
1. Netherlands (`europe-west4`)
1. Sao Paolo (`southamerica-east1`)
1. North Virginia (`us-east4`)
1. California (`us-west1`)

We will update the list as we add more regions.

Code is deployed to all regions and is served from the region closest to the end
user to minimize latency. It is not currently possible to restrict the regions
in which your code is deployed.
