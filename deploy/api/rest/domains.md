import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# Domains

Custom domains can be used to give your deployments a unique URL.

## List an organization's domains

<OpenApiEndpoint path="/organizations/{organizationId}/domains" method="get">
  Get a list of domains associated with an organization. Links to the first,
  last, next, and previous pages of results are found in the <code>Link</code>
  &nbsp;header of the response.
</OpenApiEndpoint>

## Add a domain to an organization

<OpenApiEndpoint path="/organizations/{organizationId}/domains" method="post">
  Add a new domain to the specified organization. Before use, added domain
  needs to be verified, and TLS certificates for the domain need to be
  provisioned.
</OpenApiEndpoint>

## Get a domain by ID

<OpenApiEndpoint path="/domains/{domainId}" method="get">
  Get metadata about a domain by the given ID.
</OpenApiEndpoint>

## Associate a domain with a deployment

<OpenApiEndpoint path="/domains/{domainId}" method="patch">
  With this API endpoint, you can associate or disassociate a domain with a
  deployment. Domain association is required in order to serve the deployment
  on the domain.
</OpenApiEndpoint>

## Delete a domain

<OpenApiEndpoint path="/domains/{domainId}" method="delete">
  Delete a domain by the given ID.
</OpenApiEndpoint>

## Verify a domain

<OpenApiEndpoint path="/domains/{domainId}/verify" method="post">
  This API endpoint triggers the ownership verification of a domain. It should
  be called after necessary DNS records are properly set up.
</OpenApiEndpoint>

## Upload TLS certificate for a domain

<OpenApiEndpoint path="/domains/{domainId}/certificates" method="post">
  Upload TLS certificates for your domain.
</OpenApiEndpoint>

## Provision TLS certificates for a domain

<OpenApiEndpoint path="/domains/{domainId}/certificates/provision" method="post">
  Provision TLS certificates for your domain.
</OpenApiEndpoint>
