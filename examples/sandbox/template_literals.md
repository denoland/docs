---
title: "Template literal commands with variable interpolation"
description: "Learn how to use template literal commands with variable interpolation in a sandbox."
url: /examples/sandbox_template_literals/
layout: sandbox-example.tsx
---

These conveniences help you script sandbox tasks quickly while keeping command
construction correct and secure.

Using `sandbox.sh` template literals lets you run shell commands inside the
sandbox more safely and ergonomically:

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

Variables interpolated into the template literal are auto-escaped, so even
awkward values like file names with spaces can be passed without worrying about
quoting or injection.

Arrays expand into multiple arguments automatically, making batch operations
(e.g., deleting several files) concise without manual join logic. You can also
chain helpers such as `.json()` to parse command output directly into typed data
structures, eliminating brittle string parsing and keeping results strongly
typed.
