---
title: Playgrounds
description: "Write and deploy code completely from Deno Deploy, without the need for a git repository."
---

![Deno Deploy Playground](https://deno.com/video/playground-1-720.mp4)

Playground applications enable you to create, edit, and deploy applications
entirely from the Deno Deploy web dashboard, without needing to create a GitHub
repository.

Playgrounds contain one or more files (JavaScript, TypeScript, TSX, JSON, etc.)
that you can edit directly in the playground editor.

## Creating a playground

You can create playgrounds from the "Applications" page in your organization.
Click the "New Playground" button to create a basic "Hello World" playground.
Using the dropdown on the "New Playground" button lets you create playgrounds
from other templates, such as Next.js or Hono.

## Editing a playground

To edit a playground, open it from the "Applications" page in your organization.

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

## Uploading files

You can upload a zip file containing files and directories to the playground by
dragging it into the file browser area. The contents of the zip file will be
extracted into the playground, preserving the directory structure.

> ⚠️ The playground editor does not support uploading individual files or
> directories.

## Using the HTTP explorer

The HTTP Explorer tab in the playground allows you to make arbitrary HTTP
requests to any URL served by the playground. This is useful for testing APIs or
other services that do not serve a web page.

To use the HTTP Explorer, enter the path and query parameters for the request
you want to make, select the HTTP method (GET, POST, etc.), and click on the
button labeled with the selected method.

Additional request headers can be added by clicking the "Set Headers" button.

After the response has been made, the HTTP Explorer will display the response
status, headers, and body.

To view the trace for the request, click on the "Trace" button in the response
section. This will open the request trace for the request in a drawer on top of
the playground editor. From there you can also view any `console.log` output
that was captured during the request.

## Renaming a playground

You can rename a playground by editing the playground slug on the playground
settings page. This will update the default domain names associated with the
playground since they are based on the playground slug. The new slug must be
unique within the organization (i.e. must not be in use by another app or
playground in the same organization).

:::info

Any previous `deno.net` URLs pointing to the playground will no longer work
after renaming.

Custom domains will continue to work, as they are not tied to the playground
slug.

:::

## Deleting a playground

Playgrounds can be deleted from the playground settings page. This will remove
the playground and all its revisions from the organization. All existing
deployments will immediately stop serving traffic, and all custom domain
associations will be removed.

The playground and its revisions will no longer be accessible after deletion.
Deleted playgrounds cannot be restored through the Deno Deploy UI.

:::info

Deleted a playground by mistake? Contact Deno support within 30 days to restore
it.

:::

## Limitations

> ⚠️ Playgrounds cannot currently be transferred to another organization.
