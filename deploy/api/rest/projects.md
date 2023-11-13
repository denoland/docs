import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# Projects

Projects are a container for deployments, and can be associated with domains and
KV databases in an organization.

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

## Get project deployments

<OpenApiEndpoint path="/projects/{projectId}/deployments" method="get">
  Get a paginated list of deployments belonging to the specified project. The
  URLs for the next, previous, first, and last page are returned in the
  <code>Link</code> header of the response if needed.
</OpenApiEndpoint>
