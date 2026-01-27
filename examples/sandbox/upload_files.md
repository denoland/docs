---
title: "Upload files and directories"
description: "Learn how to upload files and directories to a sandbox."
url: /examples/sandbox_upload_files/
layout: sandbox-example.tsx
---

Copy files from your machine into the sandbox using
`sandbox.fs.upload(localPath, sandboxPath)`.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Upload a single file to a specific path in the sandbox
await sandbox.fs.upload("./README.md", "./readme-copy.md");

// Upload a local directory tree into the sandbox current directory
await sandbox.fs.upload("./my-project", ".");
```

Uploading files or entire directories with `sandbox.fs.upload()` lets you bring
your local artifacts into the sandbox environment before running commands there.
This is useful when your workflow depends on existing source folders,
configuration files, or test data—once uploaded, the sandbox can compile, test,
or process them without remote Git access or manual copy/pasting.
