---
title: Playgrounds
description: "Write and deploy code completely from Deno Deploy, without the need for a git repository."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Playground applications enable you to create, edit, and deploy applications
entirely from the Deno Deploy<sup>EA</sup> web dashboard, without needing to
create a GitHub repository.

Playgrounds contain one or more files (JavaScript, TypeScript, TSX, JSON, etc.)
that you can edit directly in the playground editor.

## Creating a playground

You can create playgrounds from the "Playgrounds" page in your organization.
Click the "New Playground" button to create a basic "Hello World" playground.
Using the dropdown on the "New Playground" button lets you create playgrounds
from other templates, such as Next.js or Hono.

## Editing a playground

To edit a playground, open it from the "Playgrounds" page in your organization.

The playground editor consists of five main sections:

- **Code editor**: The central area where you edit code for the currently
  selected file. Above the editor is a navbar showing the current file name,
  which you can click to edit.
- **File browser**: Located on the left of the code editor, this panel shows all
  files in the playground. Click any file to open it in the editor. Create new
  files by clicking the "New" icon at the top of the file browser. Delete files
  using the delete button next to each file name.
- **Top bar**: Located above the code editor, this contains action buttons for
  the playground. The "Deploy" button saves current changes and triggers a
  build. "Build Config" and "Env Variables" buttons open their respective
  configuration drawers. The left side of the top bar displays the playground
  URL (unless the playground hasn't been deployed yet).
- **Bottom drawer**: Located beneath the code editor, this contains debugging
  tools including "Build Logs" that show build progress during deployment, and
  tabs for viewing logs and traces.
- **Right drawer**: Located to the right of the code editor, this contains tools
  for inspecting application output. The "Preview" tab displays an iframe
  showing the deployed application, while "HTTP Explorer" lets you send
  individual HTTP requests to your deployment.

The playground content automatically saves when you click the "Deploy" button or
when the editor loses focus.

## Deleting a playground

> ⚠️ Playgrounds cannot currently be deleted.

## Renaming a playground

> ⚠️ Playgrounds cannot currently be renamed.

## Transferring a playground

> ⚠️ Playgrounds cannot currently be transferred to another organization.

## Deleting a playground

> ⚠️ Playgrounds can not currently be deleted.

## Renaming a playground

> ⚠️ Playgrounds can not currently be renamed.

## Transferring a playground

> ⚠️ Playgrounds can not currently be transferred to another organization.
