import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# Databases

Database resources are [Deno KV databases](/deploy/kv/manual) that can be
associated with [deployments](./deployments.md). You can specify which databases
are available to which deployments, so you can isolate data or share data
between deployments.

## List an organization's KV databases

<OpenApiEndpoint path="/organizations/{organizationId}/databases" method="get">
  <p>
    This API returns a list of KV databases belonging to the specified organization in a paginated manner. The URLs for the next, previous, first, and last page are returned in the Link header of the response, if any.
  </p>
</OpenApiEndpoint>

<!-- deno-fmt-ignore-end -->

## Create a KV database

<!-- deno-fmt-ignore-start -->

<OpenApiEndpoint path="/organizations/{organizationId}/databases" method="post">
  <p>
    This API allows you to create a new KV database under the specified organization. 
    You will then be able to associate the created KV database with a new deployment by specifying the KV database ID in the 
    <a href="./deployments">Create a deployment</a> API call.
  </p>
</OpenApiEndpoint>

<!-- deno-fmt-ignore-end -->

## Update a KV database

<!-- deno-fmt-ignore-start -->

<OpenApiEndpoint path="/databases/{databaseId}" method="patch">
  <p>
    Update a KV database's details.
  </p>
</OpenApiEndpoint>

<!-- deno-fmt-ignore-end -->
