import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# Projects

Projects are a container for deployments, and can be associated with domains and
KV databases in an organization.

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

## Get project details

<OpenApiEndpoint path="/projects/{projectId}" method="get">
  Get meta information about a project by unique ID.
</OpenApiEndpoint>

## Update project details

<OpenApiEndpoint path="/projects/{projectId}" method="patch">
  Update meta information about a project.
</OpenApiEndpoint>

## Delete a project

<OpenApiEndpoint path="/projects/{projectId}" method="delete">
  Delete a project by unique ID.
</OpenApiEndpoint>

## Get project analytics

<OpenApiEndpoint path="/projects/{projectId}/analytics" method="get">
  Get analytics data for the specified project. The analytics are returned as
  time series data in 15 minute intervals, with the <code>time</code> field
  representing the start of the interval.
</OpenApiEndpoint>
