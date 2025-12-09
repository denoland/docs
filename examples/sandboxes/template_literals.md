---
title: "Template literal commands with variable interpolation"
description: "Learn how to use template literal commands with variable interpolation in a sandbox."
url: /examples/sandboxes_template_literals/
layout: sandbox-example.tsx
---

You can use template literal commands with variable interpolation in a sandbox.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Variables are automatically escaped
const filename = "file with spaces.txt";
const content = "Hello, world!";
await sandbox.sh`echo ${content} > ${filename}`;

// Arrays are expanded to multiple arguments
const files = ["file1.txt", "file2.txt", "file3.txt"];
await sandbox.sh`rm ${files}`;

// Get JSON output
const data = await sandbox.sh`echo '{"count": 42}'`.json<{ count: number }>();
console.log(data.count); // → 42
```
