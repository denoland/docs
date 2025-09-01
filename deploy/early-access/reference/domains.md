---
title: Domains
description: "Complete guide to domain management in Deno Deploy Early Access, including organization domains, custom domains, DNS configuration, TLS certificates, and domain assignments."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Every organization has a default domain used for all applications deployed
within that organization. For example, an organization with the slug `acme-inc`
would have a default domain of `acme-inc.deno.net`. An application named
`my-app` would automatically receive the production domain
`my-app.acme-inc.deno.net`.

In addition to these default domains, you can add custom domains to your
applications. Custom domains are domains that you own and control. To use a
custom domain, you must:

1. Own the domain (purchased from a domain registrar)
2. Have access to edit its DNS records

Custom domains belong to an organization and can be attached to any application
within that organization.

A custom domain can be added as:

- A base domain (e.g., `example.com` or a specific subdomain)
- A wildcard domain (e.g., `*.example.com`)

A base domain works with a single application, while a wildcard domain offers
more flexibility. You can either:

- Assign the entire wildcard to one application (all subdomains point to the
  same app)
- Partially assign it to multiple applications (different subdomains point to
  different apps)

All custom domains require valid TLS certificates. Deno Deploy<sup>EA</sup> can
automatically provision these certificates using Let's Encrypt.

## Adding a custom domain

1. Go to the organization domains page (click your organization name in the top
   left corner, then the "Domains" tab)
2. Click "Add Domain"
3. Enter your domain (e.g., `example.com`)
4. Select whether to add just this domain or also include the wildcard subdomain
5. Click "Add Domain"

This will open the domain configuration drawer.

### DNS configuration

The domain configuration drawer shows the DNS records needed to:

- Verify domain ownership
- Generate TLS certificates
- Route traffic to Deno Deploy<sup>EA</sup>

There are three possible configuration methods, depending on your domain
registrar's capabilities:

#### ANAME/ALIAS method (preferred)

If your registrar supports `ANAME` or `ALIAS` records, this is the best option:

- Add one `ANAME`/`ALIAS` record
- Add one `CNAME` record for verification

#### CNAME method

Works well for subdomains but not for apex domains:

- Add two `CNAME` records
- Note: This method doesn't allow other DNS records (like `MX` records) on the
  same domain

#### A record method

Most compatible but requires more configuration:

- Add one `A` record
- Add one `CNAME` record for verification

> Note: Currently, Deno Deploy<sup>EA</sup> doesn't support IPv6. When using the
> `ANAME/ALIAS` or `CNAME` methods, your domain will automatically use IPv6 when
> supported. With the `A` method, you'll receive an email when it's time to add
> an `AAAA` record.

:::caution

When using Cloudflare as your DNS provider, you **MUST** disable the proxying
feature (orange cloud) for the `_acme-challenge` CNAME record, or verification
and certificate provisioning will fail.

:::

### Verification

After adding the DNS records, Deno Deploy<sup>EA</sup> will verify your domain
ownership. This process may take a few minutes depending on your DNS provider.
You can leave the domain configuration drawer open during verification - it will
refresh automatically when complete.

You can manually trigger verification by clicking the "Provision Certificate"
button. Successful verification also initiates TLS certificate provisioning.

### TLS certificate provisioning

After domain verification, click "Provision Certificate" to generate a TLS
certificate through Let's Encrypt. This process takes up to 90 seconds.

Once provisioned, you'll see certificate details including expiration date and
issue time.

Certificates are automatically renewed near expiry. You can check the current
certificate status in the domain configuration drawer.

## Assigning a custom domain to an application

After adding a custom domain to your organization:

1. Go to the organization domains page
2. Click "Assign" next to the custom domain
3. Select the target application
4. If using a wildcard domain, choose whether to attach the base domain, the
   wildcard, or a specific subdomain
5. Click "Assign Domain"

## Unassigning a custom domain from an application

1. Go to the application settings page
2. Find the "Custom Domains" section
3. Click "Remove" next to the domain you want to unassign

This removes the domain from the application but keeps it available in your
organization for use with other applications.

## Removing a custom domain

1. Go to the organization domains page
2. Open the domain configuration drawer
3. Click "Delete" and confirm

This removes the custom domain from your organization and deletes all domain
assignments across all applications. Select whether you want to attach the base
domain, the wildcard subdomain, or any specific subdomain to the application.

Once you have selected the application and the domain, click on the "Assign
Domain" button to confirm.

## Un-assigning a custom domain from an application

To unassign a custom domain from an application, go to the application settings
page and remove the custom domain from the "Custom Domains" section using the
"Remove" button.

This will unassign the custom domain from the application, but will not remove
the custom domain from the organization. The custom domain will still be
available for use with other applications in the organization.

## Removing a custom domain

To remove a custom domain from an organization, go to the organization domains
page and open the domain configuration drawer. In the drawer, click on the
"Delete" button and confirm. This will remove the custom domain from the
organization and delete all custom domain assignments for that domain from all
applications in the organization.
