---
title: "Setting Up Custom Domains"
description: "Step-by-step guide for configuring custom domains on Deno Deploy Early Access applications, including DNS setup, verification, and TLS certificate provisioning."
---

:::info

You are viewing the documentation for Deploy Early Access. Looking for Deploy
Classic documentation? [View it here](/deploy/).

:::

# Setting Up Custom Domains

This guide walks you through the process of adding and configuring custom
domains for your Deno Deploy<sup>EA</sup> applications.

## Prerequisites

Before you begin, you'll need:

- A domain registered with a domain registrar
- Access to modify the DNS records for your domain
- An organization and application already set up in Deno Deploy
  <sup>**EA**</sup>

## Adding a Custom Domain to Your Organization

1. Navigate to your organization's page in the Deno Deploy<sup>EA</sup>
   dashboard
2. Click on the "Domains" tab in the top navigation
3. Click the "Add Domain" button
4. Enter your domain name (e.g., `example.com`)
5. Choose whether to also add the wildcard subdomain (`*.example.com`)
6. Click "Add Domain" to confirm

## Configuring DNS Records

After adding your domain, you'll need to configure DNS records to point your
domain to Deno Deploy<sup>EA</sup> and verify ownership.

### Choose a DNS Configuration Method

Depending on your domain registrar's capabilities, choose one of the following
methods:

#### ANAME/ALIAS Method (Preferred for apex domains)

Add these records to your DNS configuration:

1. `ANAME` or `ALIAS` record for your domain pointing to
   `<your-org-slug>.deno-apex.net`
2. `CNAME` record for `_acme-challenge.<your-domain>` pointing to
   `_acme-challenge.<your-domain>.<your-org-slug>.deno-acme.net`

#### CNAME Method (For subdomains only)

Add these records to your DNS configuration:

1. `CNAME` record for your subdomain pointing to `<your-org-slug>.deno.net`
2. `CNAME` record for `_acme-challenge.<your-subdomain>` pointing to
   `_acme-challenge.<your-subdomain>.<your-org-slug>.deno-acme.net`

#### A Record Method (Most widely supported)

Add these records to your DNS configuration:

1. `A` record for your domain pointing to the Deno Deploy<sup>EA</sup> IP
   address
2. `CNAME` record for `_acme-challenge.<your-domain>` pointing to
   `_acme-challenge.<your-domain>.<your-org-slug>.deno-acme.net`

> **Note**: When using Cloudflare, you **MUST** disable the proxying feature
> (orange cloud) for the `_acme-challenge` CNAME record.

## Domain Verification and Certificate Provisioning

1. After adding the DNS records, wait for DNS propagation (this can take a few
   minutes to several hours)
2. In the domain configuration drawer, Deno Deploy<sup>EA</sup> will
   automatically check for proper DNS configuration
3. Once verification is complete (indicated by a green checkmark), click
   "Provision Certificate"
4. Wait for the TLS certificate to be provisioned (typically within 90 seconds)

## Assigning a Domain to an Application

1. Once your domain is verified and has a valid certificate, go to the
   organization domains page
2. Click the "Assign" button next to your domain
3. In the drawer, select the application you want to assign the domain to
4. If using a wildcard domain, specify which exact domain(s) to assign
5. Click "Assign Domain" to confirm

## Testing Your Custom Domain

After assignment is complete:

1. Visit your domain in a web browser to verify it's properly pointing to your
   application
2. Check that HTTPS is working correctly (look for the padlock icon)

## Troubleshooting Common Issues

- **DNS verification fails**: Double-check your DNS records for typos and ensure
  DNS propagation has completed
- **Certificate provisioning fails**: Verify that the `_acme-challenge` CNAME
  record is correctly set up and not being proxied
- **Domain shows "Not Found" after assignment**: Wait a few minutes for the
  changes to propagate through the Deno Deploy<sup>EA</sup> infrastructure

For additional help with custom domain configuration,
[contact Deno support](../support).
