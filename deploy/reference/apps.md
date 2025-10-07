---
title: Applications
description: "Guide to managing applications in Deno Deploy, including app creation, configuration, GitHub integration, and deployment options."
---

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
[Builds documentation](/deploy/reference/builds/).

You can add environment variables during app creation by clicking "Edit
Environment Variables". For more details on environment variables, see the
[Environment Variables and Contexts](/deploy/reference/env_vars_and_contexts/)
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
[timelines](/deploy/reference/timelines/).

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

### GitHub events integration

Whenever Deno Deploy builds an app from a GitHub repository, it will send a
[`repository_dispatch`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#repository_dispatch)
event to the repository at the start and end of the build. This allows you to
trigger GitHub Actions workflows based on the build status.

Deno Deploy will send the following events:

| Event Name                    | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| `deno_deploy.build.enqueued`  | Sent when a build is enqueued, i.e. when a push is made to the repository. |
| `deno_deploy.build.cancelled` | Sent when a build is cancelled, either manually or due to a timeout.       |
| `deno_deploy.build.failed`    | Sent when a build fails.                                                   |
| `deno_deploy.build.routed`    | Sent when a build completes successfully, and traffic is routed to it.     |

The payload of the event follows the following TypeScript type definition:

```ts
interface DenoDeployBuildEventPayload {
  app: {
    /** The UUID of the Deno Deploy app. */
    id: string;
    /** The slug (name) of the Deno Deploy app. */
    slug: string;
  };
  organization: {
    /** The UUID of the Deno Deploy organization containing the app. */
    id: string;
    /** The slug (name) of the Deno Deploy organization containing the app. */
    slug: string;
  };
  revision: {
    /** The ID of the revision being built. */
    id: string;
    /** A URL to view the revision and build status in the Deno Deploy dashboard. */
    html_url: string;
    /** The Git commit SHA being built. */
    git: { sha: string };
    /** The preview URL the revision is available at, if the build succeeded. */
    preview_url: string | null;
  };
}
```

You can receive these events in a GitHub Actions workflow by adding a
`repository_dispatch` trigger. For example:

```yaml
on:
  repository_dispatch:
    types: [deno_deploy.build.routed] # Listen for successful builds

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Test the preview_url
        run: |
          echo "The Deno Deploy app is available at ${{ github.event.client_payload.revision.preview_url }}"
          curl -I ${{ github.event.client_payload.revision.preview_url }}
```
