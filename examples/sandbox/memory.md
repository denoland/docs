---
title: "Configure sandbox memory"
description: "Learn how to configure the memory allocated to a sandbox"
url: /examples/sandbox_memory/
layout: sandbox-example.tsx
---

You can customize the amount of memory allocated to your sandbox using the
memoryMb option. This allows you to allocate more resources for memory-intensive
workloads or reduce memory for lighter tasks.

```ts
import { Sandbox } from "@deno/sandbox";

// Create a sandbox with 1GB of memory
await using sandbox = await Sandbox.create({ memoryMb: 1024 });
```

```ts
import { Sandbox } from "@deno/sandbox";

// Create a sandbox with 4GB of memory for memory-intensive workloads
await using sandbox = await Sandbox.create({ memoryMb: 4096 });

// Check available memory
const memInfo = await sandbox.deno.eval<{ total: number }>(
  "Deno.systemMemoryInfo()",
);
console.log("Total memory:", memInfo.total);
```

Configuring memoryMb when creating the sandbox lets you tune resource usage per
workload. Lightweight tasks can run in smaller sandboxes to conserve resources,
while data-heavy scripts or compilations can request up to 4 GB to avoid
out-of-memory failures.

Since you can programmatically inspect the sandbox’s memory via
`Deno.systemMemoryInfo()`, you can verify allocations or adapt behavior based on
the measured limits. This control helps match sandbox capacity to your needs,
keeping performance predictable while managing costs.

Memory limits (may change in the future):

- Minimum: 768MB
- Maximum: 4096MB

The actual available memory inside the sandbox may be slightly less than the
configured value due to system overhead.

> Want to allocate more memory? Contact
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>.
