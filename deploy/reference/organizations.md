---
title: Organizations
description: "Guide to creating and managing organizations in Deno Deploy, including members, permissions, and organization administration."
---

Organizations are groups of users that collectively own apps and domains. When
signing up for Deno Deploy, each user can either create an organization or join
an existing organization through invitation.

All users must belong to an organization to use Deno Deploy, as all resources
are owned at the organization level.

Organizations have both a name and a slug. The name is visible only to
organization members and appears in the organization dropdown in both Deno
Deploy and Deploy Classic. The slug forms part of the default domain for all
applications in the organization.

Every organization has a default domain used for production, git branch, and
preview URLs for projects in that organization. For example, an organization
with the slug `acme-inc` would have a default domain of `acme-inc.deno.net`.

Organizations can have multiple members. Currently, all members have owner
permissions for the organization, which means they can invite other members,
create and delete apps, and manage domains.

## Create an organization

Organizations in Deno Deploy are created when you sign up for a Deno Deploy
account.

If you do not yet have a Deno Deploy account, you can create one by visiting the
[Deno Deploy dashboard](https://console.deno.com) and signing in with your
GitHub account. You will be prompted to create an organization as part of the
sign-up process.

:::info

Organization slugs must be unique across all Deno Deploy organizations and
cannot match any existing project name in Deno Deploy Classic.

:::

## Update the organization name

The organization name can be updated from the organization settings page in the
Deno Deploy dashboard. The organization name is only cosmetic, and changing it
does not affect any apps or domains. It is the display name of your
organization, on the dashboard and in invitation emails.

## Update the organization slug

The organization slug can be updated from the organization settings page in the
Deno Deploy dashboard. Changing the organization slug will update the default
domain for all apps in the organization. For example, changing the slug from
`acme-inc` to `acme-corp` will change the default domain from
`acme-inc.deno.net` to `acme-corp.deno.net`.

:::warning

Changing the organization slug will immediately affect all apps in the
organization that use the default domain. Any existing URLs using the old domain
will stop working. You will need to update any bookmarks or links that use the
old domain.

After changing the organization slug, it can take multiple minutes for the new
default domain to start working, due to TLS certificate provisioning. In this
time, apps will be unreachable via the new default domain.

Custom domains are not affected by changing the organization slug.

:::

This will also affect the URLs of resources inside of the organization on the
Deno Deploy dashboard. For example, the URL for an app will change from
`https://console.deno.com/acme-inc/my-app` to
`https://console.deno.com/acme-corp/my-app`.

## Deleting an organization

Organizations cannot currently be deleted from the dashboard. Please
[contact Deno support](/deploy/support/) if you need to delete an organization.

## Inviting users to an organization

To invite a user:

1. Go to the organization settings page and click "+ Invite User"
2. Enter the user's GitHub account username (e.g., `ry`)
3. Optionally enter an email address to send the invitation to
4. Click "Invite"

If you don't specify an email address, we'll attempt to send the invitation to
the email in the user's public GitHub profile or another email we may have on
record.

After inviting a user, they will receive an email with an invite link (if we
have their email address). They must click this link and accept the invitation
to join the organization. You can also directly share the personalized invite
link displayed in the members table after inviting a user.

You can cancel an invitation before it's accepted by clicking the delete button
next to the invited user in the members table and confirming by clicking "Save".
This invalidates the previously sent invitation link.

## Removing users from an organization

To remove a member from the organization, find the user in the members table in
the organization settings, click the remove button, and confirm by clicking
"Delete". "Delete".
