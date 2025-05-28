---
title: Domains
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Every organization has a default domain that is used for production, git branch,
and preview URLs for applications deployed in that organization. For example,
the organization `acme-inc` would have a default organization domain of
`acme-inc.deno.net`. An application named `my-app` would have a default
production domain of `my-app.acme-inc.deno.net`.

In addition to the default domains that are provided by Deno Deploy
<sup>EA</sup> automatically, it is also possible to add custom domains to
applications. Custom domains are domains that you own and control. To add a
custom domain, you must have purchased the domain from a domain registrar and
you must have access to edit the DNS records for the domain.

Custom domains are owned by an organization. Once added to an organization, the
can be attached to any application in that organization.

A custom domain can be added either as a base domain (a single domain or
subdomain, such as `example.com`), or as a wildcard domain (such as
`*.example.com`). A base domain can be used for a single application. A wildcard
domain is more flexible, and can either be entirely assigned to a single
application so that all subdomains of the wildcard domain point to that
application, or it can be partially assigned to multiple applications, so that
one subdomain points to one application, and another subdomain points to a
different application.

Each custom domain must have a valid TLS certificate to be used in Deno Deploy
EA. Deno Deploy<sup>EA</sup> can automatically provision a TLS certificate for
you using Let's Encrypt.

## Adding a custom domain

To add a custom domain, go to the organization domains page. You can access this
page by clicking on the organization name in the top left corner of the Deno
Deploy<sup>EA</sup> dashboard, and then clicking on the "Domains" tab in the top
navigation.

Click on the "Add Domain" button to open the custom domain drawer. In the
drawer, enter the domain you want to add, such as `example.com`. Then, select
whether you want to add only this domain itself, or also the wildcard subdomain
(`*.example.com`).

Click on the "Add Domain" button to confirm.

You will now see the domain configuration drawer.

### DNS configuration

The domain configuration drawer contains the DNS configuration for the domain
that is needed to verify ownership of the domain, generate TLS certificates, and
route traffic to Deno Deploy<sup>EA</sup>.

The DNS configuration section has two to three tabs, depending on the type of
domain you are adding. You must add all of the DNS records from any of the tabs
to your domain registrar's DNS configuration. There are multiple ways to do
this, because different domain registrars have different levels of support for
certain DNS records:

- The `ANAME/ALIAS` method is most prefereable if your domain registrar supports
  `ANAME` or `ALIAS` records. When using this method, you add one `ANAME` or
  `ALIAS` record and one `CNAME` record to your DNS configuration.

- The `CNAME` method works well for subdomains, but is not supported for base
  domains. When using this method, you can have no other DNS records for the
  same domain (such as `MX` records for email), so it is only suitable for
  subdomains that do not need any other DNS records. When using this method, you
  add two separate `CNAME` records to your DNS configuration.

- The `A` method is the most flexible and widely supported, but requires more
  DNS records to be added. When using this method, you add one `A` records and
  one `CNAME` record to your DNS configuration.

> Currently Deno Deploy<sup>EA</sup> does not support IPv6 yet. This is planned
> for the future. When using `ANAME/ALIAS` or `CNAME` configuration methods your
> domain will automatically be configured to use IPv6 when it is supported. When
> using the `A` configuration method we will send you an email to let you know
> that you need to add an `AAAA` record to your DNS configuration.

:::warning

When using Cloudflare as the DNS provider, you **MUST** disable the proxying
feature (orange cloud) for the `_acme-challenge` CNAME record. If you do not do
this verification and certificate provisioning will fail.

:::

### Verification

Once the DNS records have been added to the domain registrar's DNS
configuration, Deno Deploy<sup>EA</sup> will check the DNS records to verify
ownership of the domain. This can take a few minutes depending on the DNS
provider. You can leave the domain configuration drawer open while the
verification is in progress, and it will automatically refresh when the
verification is complete. Once the verification is complete, you will see a
green checkmark.

You can also manually trigger the verification progress by clicking on the
"Provision Certificate" button. If verification is successful, this will also
initiate provisioning of the TLS certificate.

### TLS certificate provisioning

Once the domain has been verified, you can trigger a TLS certificate to be
provisioned by pressing the "Provision Certificate" button. This will
automatically generate a TLS certificate for the domain using Let's Encrypt.
This can take up to 90 seconds.

Once the TLS certificate has been provisioned, you will see information about
the certificate, such as the expiration date and issue time.

The TLS certificate will automatically be renewed when it is close to expiry.
You can check on the current status of the TLS certificate in the domain
configuration drawer.

## Assigning a custom domain to an application

Once a custom domain has been added to an organization, it can be assigned to
any application in that organization. To assign a custom domain to an
application, go to the organization domains page and click the "Assign" button
next to any of the custom domains.

This will open the assign domain drawer. In the drawer, select the application
you want to assign the domain to. If you are using a wildcard domain, you can
also select whether you want to attach the base domain, the wildcard subdomain,
or any specific subdomain to the application.

Once you have selected the application and the domain, click on the "Assign
Domain" button to confirm.

## Unassigning a custom domain from an application

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
