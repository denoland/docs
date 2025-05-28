---
title: "Creating an Organization"
description: "Step-by-step guide for creating and configuring a Deno Deploy Early Access organization, including naming conventions and member management."
---

:::info

You are viewing the documentation for Deploy Early Access. Looking for Deploy
Classic documentation? [View it here](/deploy/).

:::

# Creating an Organization

In Deno Deploy<sup>EA</sup>, all resources (applications, domains, etc.) are
owned by organizations. This guide walks you through creating your first
organization.

## Creating a New Organization

1. Visit [app.deno.com](https://app.deno.com) and sign in
2. If you don't have any organizations yet, you'll see the organization creation
   screen
3. If you already have organizations, click on the "+" button in the
   organization dropdown in the top left corner

![The Deno Deploy<sup>EA</sup> organization creation screen.](../images/create_org.png)

## Organization Details

When creating an organization, you'll need to provide:

1. **Organization Name**: A display name for your organization, visible only to
   organization members
2. **Organization Slug**: A unique identifier used in URLs and domains

Your organization will automatically get a default domain: `<org-slug>.deno.net`

> **Important**: Organization slugs must be unique across all Deno Deploy
> <sup>**EA**</sup> organizations and cannot be the same as any project name in
> Deploy Classic.

## Organization Limitations

Be aware of these important limitations:

- Organization names and slugs **cannot be changed** after creation
- Organizations **cannot be deleted** through the dashboard (contact support if
  needed)
- All members added to the organization currently have owner permissions

## Managing Organization Members

After creating your organization, you can invite team members:

1. Navigate to your organization settings
2. Click on "+ Invite User"
3. Enter the GitHub username of the person you want to invite
4. Optionally enter their email address
5. Click "Invite"

The invited user will receive an email with an invite link. They must click this
link and accept the invitation to join the organization.

### Removing Members

To remove a member from your organization:

1. Go to the organization settings
2. Find the user in the members table
3. Click the "Remove" button next to their name
4. Confirm by clicking "Delete"

## Organization Resources

Your organization will include:

- **Applications**: Web services that can serve traffic
- **Custom Domains**: Domains owned by the organization that can be assigned to
  applications
- **Environment Variables**: Configuration values that can be shared across
  applications

## Next Steps

Now that you've created your organization, you can
[deploy your first application](./first-deployment).

For any issues with organization management, please
[contact Deno support](../support).
