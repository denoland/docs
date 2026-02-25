---
title: "Migrating a custom domain from Deploy Classic to Deno Deploy"
description: "Learn how to migrate your custom domain from Deploy Classic to Deno Deploy"
url: /examples/migrate_custom_domain_tutorial/
---

If you have previously set up a custom domain on Deploy Classic and want to
migrate it to Deno Deploy, follow these steps:

## Add your domain to Deno Deploy

1. Visit the [Deno Deploy dashboard](https://dash.deno.com) and navigate to the
   project you want to associate with your custom domain.

2. Click the **"Settings"** tab.

3. Under "Production Domains", click **"+ Add Domain"**.

4. Enter your custom domain (e.g., `test.mywebsite.com`), select whether you
   want just the base url or base and wildcard, then click **"Save"**.

This will kick off DNS record configuration, which may take a few minutes.

You will be presented with DNS records that you need to add to your DNS
provider.

## Provision a TLS certificate

In your DNS provider's settings, update your domain's DNS records to include the
provided `_acme-challenge` CNAME record. This is necessary for Deno Deploy to
verify your domain and provision a TLS certificate.

![DNS Records modal](/deploy/images/dns_config.png)

Once the DNS records are picked up, provision a new TLS certificate by clicking
the **"Verify DNS and provision certificate"** button.

## Update DNS records

In your DNS provider's settings, remove any existing CNAME/A/AAAA records for
your domain and replace them with the CNAME or ANAME records provided by Deno
Deploy.

This may take some time due to DNS propagation delays. Allow up to 48 hours for
the changes to take effect before removing the domain from Deploy Classic.
