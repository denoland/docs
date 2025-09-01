---
title: Organizations
description: "Guide to creating and managing organizations in Deno Deploy Early Access, including members, permissions, and organization administration."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Organizations are groups of users that collectively own apps and domains. When
signing up for Deno Deploy<sup>EA</sup>, each user can either create an
organization or join an existing organization through invitation.

All users must belong to an organization to use Deno Deploy<sup>EA</sup>, as all
resources are owned at the organization level.

Organizations have both a name and a slug. The name is visible only to
organization members and appears in the organization dropdown in both Deno
Deploy
<sup>EA</sup> and Deploy Classic. The slug forms part of the default domain for
all applications in the organization.

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

Organizations in Deno Deploy<sup>EA</sup> are created from the Deno Deploy
Classic dashboard:

1. Visit the [Deploy Classic dashboard](https://dash.deno.com) and sign in with
   your GitHub account.
2. Click the "+" button in the organization dropdown in the top left corner of
   the screen.
3. Select "Try the new Deno Deploy" option.
4. Click the "Create Early Access organization" button.
5. Enter an organization name and slug, then click "Create".

:::info

Organization slugs must be unique across all Deno Deploy<sup>EA</sup>
organizations and cannot match any existing project name in Deno Deploy Classic.

:::

## Deleting an organization

Organizations cannot currently be deleted from the dashboard. Please
[contact Deno support](../support) if you need to delete an organization.

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
