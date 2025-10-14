---
title: Domains
description: "Complete guide to domain management in Deno Deploy, including organization domains, custom domains, DNS configuration, TLS certificates, and domain assignments."
---

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

All custom domains require valid TLS certificates. Deno Deploy can automatically
provision these certificates using [Let's Encrypt](https://letsencrypt.org/).
Alternatively, you can bring your own TLS certificates, which you will then need
to renew manually.

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
- Optionally provision TLS certificates
- Route traffic to Deno Deploy

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

> Note: Deno Deploy does not currently support IPv6. When using the
> `ANAME/ALIAS` or `CNAME` methods, your domain will automatically use IPv6 when
> supported. With the `A` method, you'll receive an email when it's time to add
> an `AAAA` record.

:::caution

When using Cloudflare as your DNS provider, you **MUST** disable the proxying
feature (orange cloud) for the `_acme-challenge` CNAME record, or verification
and certificate provisioning will fail.

:::

### Verification

After adding the DNS records, Deno Deploy will verify your domain ownership.
This process may take a few minutes depending on your DNS provider. You can
leave the domain configuration drawer open during verification — it will refresh
automatically when complete.

You can manually trigger verification by clicking the "Provision Certificate"
button. Successful verification also initiates TLS certificate provisioning.

### TLS certificates

After domain verification, you need a valid TLS certificate to use the domain
with Deno Deploy. You can either have Deno Deploy provision a certificate for
you using Let's Encrypt, or you can bring your own certificate.

#### Automatic provisioning (Let's Encrypt)

After domain verification, click "Provision Certificate" to generate a TLS
certificate through Let's Encrypt. This process can take up to 90 seconds.

Once provisioned, you'll see certificate details including expiration date and
issue time.

Certificates are automatically renewed near expiration. You can check the
current certificate status in the domain configuration drawer.

If automatic renewal fails (for example, because DNS records changed), you will
receive an email notification 14 days before the certificate expires. You then
have a chance to fix the issue and contact support to retry the renewal. If the
certificate is not renewed before expiration, the domain will stop working.

#### Bring your own certificate

If you prefer to use your own TLS certificate, you can upload it in the domain
configuration drawer. You'll need to provide the following:

- The certificate file (PEM format)
- The private key file (PEM format)

Once uploaded, the certificate will be used for the domain. You are responsible
for renewing and updating the certificate before it expires.

You will receive email notifications 14 days before the certificate expires
reminding you to update it. If the certificate expires, the domain will stop
working.

The TLS certificate must be valid at the time of upload. It must cover the base
domain (and, if you have a wildcard domain, the wildcard subdomain as well)
through either the common name or the subject alternative names in the
certificate. The private key and certificate must match, and must be either RSA
(2048, 3072, or 4096 bits) or ECDSA (P-256, P-384, or P-521).

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
assignments across all applications.

## Migrating a custom domain from Deploy Classic to Deno Deploy

If you have previously set up a custom domain on Deploy Classic and want to
migrate it to Deno Deploy, we've created a
[step-by-step tutorial](/examples/migrate_custom_domain_tutorial/) to guide you
through the process.
