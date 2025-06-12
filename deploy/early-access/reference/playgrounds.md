---
title: Playgrounds
description: "Write and deploy code completely from Deno Deploy, without the need for a git repository."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Playground applications enable creating, editing, and deploying an application
entirely from the Deno Deploy<sup>EA</sup> web dashboard, without the need to
create a repository on GitHub.

Playgrounds consist of one or more files (such as JS, TS, TSX, or JSON) that can
each be edited from the playground page.

## Creating a playground

Playgrounds can be created from the "Playgrounds" page in the organization.
Pressing the "New Playground" button will create a new "Hello World" playground.
By pressing the dropdown on the "New Playground" button, playgrounds can be
created from other templates, such as Next.js or Hono.

## Editing a playground

To edit a playground, open the playground from the "Playgrounds" page in the
organization.

The playground editor consists of five main sections:

- **Code editor**: in the center of the screen is the code editor, which shows
  the currently selected file. Overtop the editor is a navbar that shows the
  file name of the file that is currently open. The file name of this file can
  be edited by clicking on the file name.
- **File browser**: on the left of the code editor is the file browser, which
  shows all files in the playground. Clicking on a file opens the code editor.
  New files can be created from the file browser by clicking the "New" icon at
  the top of the file browser. Files can also be deleted from the file browser
  by clicking the delete button next to files.
- **Top bar**: above the code editor is the top bar, which contains actions one
  can take on the playground. Pressing the "Deploy" button saves the current
  changes and triggers a build to deploy the changes. The "Build Config" and
  "Env Variables" button open the build config, and environment variables drawer
  respectively. On the left hand side of the top bar the playground URL is
  shown, unless the playground has not been deployed yet.
- **Bottom drawer**: under the code editor is the bottom drawer, which contains
  tools used to debug the playground application. It contains the "Build Logs"
  tab that shows the build progress during deployment, and a logs and trace tab
  that can be used to view logs and traces.
- **Right drawer**: to the right of the code editor is the right drawer, which
  contains tools used to inspect the output of the application. The "Preview"
  tab shows an `<iframe>` showing the page at the playground URL. The "HTTP
  Explorer" tab enables sending individual HTTP requests (such as GET, POST,
  PUT) to the playground deployment.

The contents of the playground is automatically saved when the "Deploy" button
is pressed or the editor gets unfocussed.

## Deleting a playground

> ⚠️ Playgrounds can not currently be deleted.

## Renaming a playground

> ⚠️ Playgrounds can not currently be renamed.

## Transferring a playground

> ⚠️ Playgrounds can not currently be transferred to another organization.
