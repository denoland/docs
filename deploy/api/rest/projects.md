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

## Create a project deployment

<!-- deno-fmt-ignore-start -->

<OpenApiEndpoint path="/projects/{projectId}/deployments" method="post"
  customDocs={{ 
    compilerOptions: "See **Compiler options** below.", 
    assets: "See **Deployment assets** below.", 
  }}
>
  <p>
    Initiate a build process for a new deployment. Note that this process is
    asynchronous - a successful request to this endpoint API doesn't mean the
    deployment is ready.
  </p>
  <p>
    For now, you can track the progress of a build by polling either the&nbsp;
    <a href="deployments#get-deployment-build-logs">build logs for a deployment</a> or the&nbsp;
    <a href="deployments#get-deployment-details">deployment details</a> API endpoints.
  </p>
</OpenApiEndpoint>

<!-- deno-fmt-ignore-end -->

### Compiler options

The `compilerOptions` key of the `POST` body sent with a deployment creation
request can override the options usually configured
[here in deno.json](/runtime/manual/getting_started/configuration_file#compileroptions).
Compiler options will determine how your application's TypeScript code will be
processed.

If `null` is provided, Deploy will attempt to discover a `deno.json` or
`deno.jsonc` within the assets of your deployment (see **Deployment assets**
below). If an empty object `{}` is provided, Deploy will use default TypeScript
configuration.

### Deployment assets

The assets associated with a deployment are the code and static files that drive
the behavior of the deployment and handle incoming requests. In JSON body sent
with a `POST` request to this endpoint, you will include an `assets` attribute
that contains keys that represent the file path to a particular asset.

So for example - a file that would live in a deployment directory under
`server/main.ts` would use that path as the key for the asset.

An asset has a `kind` attribute associated with it, which can be one of:

- `file` - an actual file associated with the deployment
- `symlink` - a [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link) to
  another file in the deployment

File assets also have a `content` property, which as you might imagine, is the
actual contents of the file. These assets also have an `encoding` property,
which indicates whether the content is encoded as `utf-8` (plain text) or
`base64` for
[base64 encoded content](https://developer.mozilla.org/en-US/docs/Glossary/Base64).

To prevent the need to re-upload files that very seldom change, you can also
specify a `gitSha1` attribute, which is a `SHA-1` hash of the content that was
previously uploaded for the specified asset.

Below is an example of `assets` that could be used to set up a deployment.

```json
{
  "assets": {
    "main.ts": {
      "kind": "file",
      "content": "Deno.serve((req: Request) => new Response(\"Hello World\"));",
      "encoding": "utf-8"
    },
    "images/cat1.png": {
      "kind": "file",
      "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk",
      "encoding": "base64"
    },
    "images/cat2.png": {
      "kind": "file",
      "gitSha1": "5c4f8729e5c30a91a890e24d7285e89f418c637b"
    },
    "symlink.png": {
      "kind": "symlink",
      "target": "images/cat1.png"
    }
  }
}
```
