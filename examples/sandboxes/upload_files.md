---
title: "Upload files and directories"
description: "Learn how to upload files and directories to a sandbox."
url: /examples/sandboxes_upload_files/
layout: sandbox-example.tsx
---

Copy files from your machine into the sandbox using
`sandbox.upload(localPath, sandboxPath)`.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Upload a single file to a specific path in the sandbox
await sandbox.upload("./README.md", "./readme-copy.md");

// Upload a local directory tree into the sandbox current directory
await sandbox.upload("./my-project", ".");
```
