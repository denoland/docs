import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# Organizations

Organizations are a container for projects, domains, and KV databases. New
organizations can be created in the
[Deno Deploy dashboard](https://dash.deno.com). The access tokens created for
your account may make changes to any of the organizations to which you have
access.

## Get organization details

<OpenApiEndpoint path="/organizations/{organizationId}" method="get">
  Get meta information about your organization, passing in your
  unique ID as a path parameter.
</OpenApiEndpoint>

## Get analytics for organization

<OpenApiEndpoint path="/organizations/{organizationId}/analytics" method="get">
  Get analytics information for an organization.
</OpenApiEndpoint>

## List projects for an organization

<OpenApiEndpoint path="/organizations/{organizationId}/projects" method="get">
  Get a paginated list of Projects for an organization. Links to the first,
  last, next, and previous pages of results are found in the <code>Link</code>
  &nbsp;header of the response.
</OpenApiEndpoint>

## Create a new project for an organization

<OpenApiEndpoint path="/organizations/{organizationId}/projects" method="post">
  Create a new project within the given organization. A project is a container
  for deployments, and can be associated with domains and KV databases.
</OpenApiEndpoint>

## List an organization's KV databases

<OpenApiEndpoint path="/organizations/{organizationId}/databases" method="get">
  Get a list of KV databases associated with an organization. Links to the first,
  last, next, and previous pages of results are found in the <code>Link</code>
  &nbsp;header of the response.
</OpenApiEndpoint>

## Create a KV database for an organization

<OpenApiEndpoint path="/organizations/{organizationId}/databases" method="post">
  Create a new KV database associated with an organization.
</OpenApiEndpoint>

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
