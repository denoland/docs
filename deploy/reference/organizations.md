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

:::caution

Organizations cannot be renamed, nor can their slug be changed after creation.

:::

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
