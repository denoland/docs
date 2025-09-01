---
title: Applications
description: "Guide to managing applications in Deno Deploy Early Access, including app creation, configuration, GitHub integration, and deployment options."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Applications are web services that serve traffic within an organization. Each
application contains a history of revisions (previous versions), typically
corresponding to Git commits when using the GitHub integration.

Applications are identified by a slug, which must be unique within the
organization and is used in default domain names.

## Creating an application

To create an application:

1. Click the "+ Create App" button on the organization page
2. Select the GitHub repository to deploy from
3. Configure the app slug (name)
4. Set up build configuration
5. Add any required environment variables

> ⚠️ Currently, applications must be linked to a GitHub repository during
> creation.

The build configuration determines how the application is built during the
deployment process. Builds are automatically triggered on each push to the
linked repository or when manually clicking "Deploy Default Branch". For
detailed build configuration information, see the
[Builds documentation](/deploy/early-access/reference/builds/).

You can add environment variables during app creation by clicking "Edit
Environment Variables". For more details on environment variables, see the
[Environment Variables and Contexts](/deploy/early-access/reference/env-vars-and-contexts/)
documentation.

## Renaming an application

Applications can be renamed by editing the app slug on the app settings page.
This will update the default domain names associated with the app since they are
based on the app slug. The new slug must be unique within the organization (i.e.
must not be in use by another app or playground in the same organization).

:::warning

Any previous `deno.net` URLs pointing to the app will no longer work after
renaming.

Custom domains will continue to work, as they are not tied to the app slug.

:::

## Deleting an application

Applications can be deleted from the app settings page. This will remove the app
and all its revisions from the organization. All existing deployments will
immediately stop serving traffic, and all custom domain associations will be
removed.

The app and its revisions will no longer be accessible after deletion, and no
traffic will be served from it. Deleted apps cannot be restored through the Deno
Deploy UI.

:::info

Deleted an app by mistake? Contact Deno support within 30 days to restore it.

:::

## Limitations

> ⚠️ Apps cannot currently be transferred to another organization.

## GitHub integration

The GitHub integration enables automatic deployments of the app from a GitHub
repository. Every push to the repository will trigger a new build of the app.
Depending on the branch of the commit, the build will be deployed to different
[timelines](/deploy/early-access/reference/timelines/).

Apps are linked to a GitHub repository during creation. However, it is possible
to unlink the repository after creation, and optionally link it to a new GitHub
repository. This can be done from the app settings page.

Only accounts that have been authorized with the Deno Deploy GitHub app will be
visible in the GitHub repository dropdown. You can authorize new organizations
or repositories by clicking the "+ Add another GitHub account" button in the
user or organization dropdown, or the "Configure GitHub app permissions" button
in the repository dropdown. This will redirect you to GitHub to authorize the
Deno Deploy GitHub app with the selected GitHub account or organization. After
authorization, you will be redirected back to the app settings page, where you
can select the newly authorized GitHub repository.
