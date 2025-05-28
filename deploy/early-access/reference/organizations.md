---
title: Organizations
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Organizations are groups of users that collectively own apps and domains. Upon
signing up to Deno Deploy<sup>EA</sup>, each user can either create an
organization or be invited to an existing organization by another Deno Deploy
<sup>EA</sup> user.

All users must be part of an organization to be able to use Deno Deploy
<sup>EA</sup> because all resources are owned by organizations.

Organizations have a name and a slug. The name is visible only to organization
members and appears in the organization dropdown in both Deno Deploy
<sup>EA</sup> and Deploy Classic. The organization slug is used for the default
domain of the organization.

:::caution

Organizations cannot currently be renamed, nor can their slug be altered after
creation.

:::

Every organization has a default domain that is used for production, git branch,
and preview URLs for projects in that organization. For example, an organization
with the slug `acme-inc` would have a default organization domain of
`acme-inc.deno.net`.

Organizations can have multiple members. Each member is currently an owner of
the organization. This means that they can invite other members, create and
delete apps, and manage domains.

## Create an organization

Organizations in Deno Deploy<sup>EA</sup> are created from the Deno Deploy
Classic dashboard. To create an organization:

1. Visit the [Deploy Classic dashboard](https://dash.deno.com) and sign in with
   a GitHub account.
2. Click on the "+" button in the organization dropdown in the top left corner
   of the screen.
3. Select "Try the new Deno Deploy" option.
4. Click on the "Create Early Access organization" button.
5. Enter an organization name and slug and click "Create".

:::info

Organization slugs must be unique across all organizations in Deno Deploy
<sup>EA</sup>. They can also not be the same as any project name in Deno Deploy
Classic.

:::

## Deleting an organization

At this time organizations can not be deleted from the dashboard. Please
[contact Deno support](../support) if you need to delete an organization.

## Inviting users to an organization

To invite a user, go to the organization settings page and click on "+ Invite
User". Then enter the users' GitHub account username (for example `ry`). You may
additionally enter an email address which we will send the invite to. If you do
not specify an email, we will try to email the user at the email in their public
GitHub profile if available, or a different email we may already have on record
for that user. Press "Invite" to invite the user.

After inviting a user, they will receive an email with an invite link if we have
their email address on record. They must click this invite link and accept the
invite to join the organization. You can also send the personalized invite link
directly to the invited user - it is displayed in the members table on the
dashboard after you invite a user.

A user can be uninvited before they actually accept the invitation. This will
not send another email, but it will render the invitation link sent invalid.
This can be done by pressing the delete button next to the invited user in the
members table, and then confirming by pressing "Save".

## Removing users from an organization

To remove a member from the org, find the user in the members table in the
organization settings, press the remove button, and confirm by pressing
"Delete".
