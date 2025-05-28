---
title: Applications
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Applications are web services inside of an organization that can serve traffic.
Applications contain revisions - these are all the previous versions of the app.
When using the GitHub integration there will usually be one revision per Git
commit.

Apps have a slug, which acts as a name for the app and must be unique within the
organization. The slug is used in default domains for the app, so it must be
URL-safe.

## Creating an app

To create an app, press the "+ Create App" button on the org page. This will
open a page where you can configure the details of the new app.

On this page, you can select the GitHub repository that the app will be deployed
from.

> ⚠️ Right now applications must be linked to a GitHub repository on creation.

Apps require a slug, which also acts as the name of the app. The app slug must
be unique within the context of the organization.

Apps have an associated build configuration. The build configuration determines
how the app is built in the build step. A build is automatically triggered for
every push to the linked GitHub repository, and when manually clicking the
"Deploy Default Branch" button. For more details on how to configure the build
step, see the [Builds](/deploy/early-access/reference/builds/) documentation.

Apps can also have environment variables that are available at runtime. These
can be added during app creation by using the "Edit Environment Variables"
button. This will open a drawer where you can add environment variables to the
app. For more details on environment variables, see the
[Contexts and Timelines](/deploy/early-access/reference/contexts-and-timelines/)
documentation.

## Deleting an app

> ⚠️ Apps can not currently be deleted.

## Renaming an app

> ⚠️ Apps can not currently be renamed.

## Transferring an app

> ⚠️ Apps can not currently be transferred to another organization.

## GitHub integration

The GitHub integration enables automatic deployments of the app from a GitHub
repository. Every push to the repository will trigger a new build of the app.
Depending on the branch of the commit, the build will be deployed to different
[timelines](/deploy/early-access/reference/contexts-and-timelines/).

Apps will generally be linked to a GitHub repository on creation. However, it is
possible to unlink the repository after creation, and optionally link it to a
new GitHub repository. This can be done from the app settings page.

Only accounts that have been authorized with the Deno Deploy GitHub app will be
visible in the GitHub repository dropdown. You can authorize new orgs or repos
by clicking the "+ Add another GitHub account" button in the user or
organization dropdown, or the "Configure GitHub app permissions" button in the
repository dropdown. This will redirect you to GitHub to authorize the Deno
Deploy GitHub app with the selected GitHub account or organization. After
authorizing, you will be redirected back to the app settings page, where you can
select the new GitHub repository.
