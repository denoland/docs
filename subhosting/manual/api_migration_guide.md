---
title: "Migrating from subhosting API v1 to v2"
description: "Detailed guide for migrating from the Deno Deploy subhosting API v1 to v2, covering endpoint changes, deployment model differences, and new features like labels and layers."
oldUrl:
  - /deploy/api_migration_guide/
---

This guide covers migrating from the Deno Deploy subhosting API v1
(`api.deno.com/v1`) to v2 (`api.deno.com/v2`). The v1 API will be shut down on
**July 20, 2026**. For general platform migration (apps, domains, environment
variables), see the [Deploy Classic migration guide](/deploy/migration_guide/).

Full v2 API reference: [api.deno.com/v2/docs](https://api.deno.com/v2/docs)

Official SDKs:

- **TypeScript/JavaScript**:
  [@deno/sandbox](https://www.npmjs.com/package/@deno/sandbox)
- **Python**: [sandbox-py](https://github.com/denoland/sandbox-py)

These SDKs are branded as "sandbox" but work for subhosting use cases.

## Why migrate to v2

V2 runs on an entirely new platform with significant improvements:

- No per-request CPU time limits (no more `TIME_LIMIT` errors)
- Configurable memory limits, up to 4 GB (v1 is fixed at 512 MB)
- Custom OpenTelemetry export (logs, metrics, traces) to your own endpoint
- Custom build steps and framework support (Next.js, Astro, SvelteKit, etc.)
- Built-in HTTP cache
- Layers for instant bulk configuration updates across many apps without
  redeploying
- Web Application Firewall (WAF)

## Key concept changes

| v1           | v2           | Notes                                          |
| ------------ | ------------ | ---------------------------------------------- |
| Organization | Organization | Unchanged                                      |
| Project      | App          | One app per function                           |
| Deployment   | Revision     | Immutable snapshot of code + config            |
| Project name | App slug     | Used in URLs; unique within the org            |
| —            | Labels       | Key-value pairs on apps for grouping/filtering |
| —            | Layers       | Shared configuration (env vars) across apps    |
| —            | Config       | Build and runtime configuration                |
| —            | Timeline     | Deployment target within an app                |

## Architecture change: one app per function

In v1, you may have used a single project with multiple active deployments to
represent separate functions. **In v2, create a separate app for each
function.**

V2 introduces **timelines**. Each timeline has only one active revision at a
time — deploying a new revision replaces the previous one. When deploying via
the API, revisions are automatically labeled as production, so each app
effectively has a single active revision.

This means v2 revisions are **not** a 1:1 equivalent of v1 deployments. In v1,
multiple deployments within a project could be active simultaneously. In v2,
only one revision per timeline is active.

Recommended approach:

- Create one app per function with a descriptive slug (e.g. `my-service-auth`,
  `my-service-billing`)
- Use **labels** to group related apps — filter with
  `GET /apps?labels[service]=my-service`
- Use **layers** to share environment variables across apps

## Configuration inheritance

In v1, every deployment was self-contained: environment variables, entrypoint,
and other options had to be specified in each deploy request.

In v2, apps carry configuration that revisions inherit:

- **Build config** (`config`): install command, build command, runtime
  entrypoint. Set once on the app, inherited by all revisions.
- **Environment variables** (`env_vars`): set on the app or on a layer,
  inherited by all revisions.
- **Layers**: set on the app, inherited by all revisions.

You can override any of these per-revision by including them in the deploy
request. If omitted, the app's configuration is used. This means you typically
only need to send `assets` after initial setup:

```json
{
  "assets": {
    "main.ts": {
      "kind": "file",
      "content": "Deno.serve((req) => new Response('Hello'));"
    }
  }
}
```

## Authentication

| Aspect       | v1                              | v2                              |
| ------------ | ------------------------------- | ------------------------------- |
| Token prefix | `dd...`                         | `ddo_...`                       |
| Header       | `Authorization: Bearer <token>` | `Authorization: Bearer <token>` |
| Scope        | Organization                    | Organization                    |
| Base URL     | `https://api.deno.com/v1`       | `https://api.deno.com/v2`       |

Create v2 tokens in the Deno Deploy dashboard under your organization's
settings.

## Endpoint mapping

### List projects / apps

**v1**: `GET /organizations/{orgId}/projects`

**v2**: `GET /apps`

The v2 API scopes to the organization automatically based on your token. No
organization ID needed in the URL.

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/organizations/$ORG_ID/projects?page=1&limit=20"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps?limit=30"
```

| Aspect     | v1                            | v2                                |
| ---------- | ----------------------------- | --------------------------------- |
| Pagination | `page` + `limit` (page-based) | `cursor` + `limit` (cursor-based) |
| Filtering  | `q` (search by name/ID)       | `labels`, `layer`                 |
| Response   | Array of Project objects      | Array of AppListItem objects      |

Response field mapping:

| v1 Project    | v2 AppListItem                   |
| ------------- | -------------------------------- |
| `id` (UUID)   | `id` (UUID)                      |
| `name`        | `slug`                           |
| `description` | _not available_                  |
| `createdAt`   | `created_at`                     |
| `updatedAt`   | `updated_at`                     |
| —             | `labels` (object)                |
| —             | `layers` (array of `{id, slug}`) |

V2 uses `snake_case` for all field names (v1 uses `camelCase`).

### Get project / app details

**v1**: `GET /projects/{projectId}`

**v2**: `GET /apps/{app}`

The v2 endpoint accepts either the app UUID or slug.

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/projects/$PROJECT_ID"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps/my-app-slug"
```

The v2 response includes `env_vars`, `config`, `labels`, and `layers`.

### Create a deployment / revision

**v1**: `POST /projects/{projectId}/deployments`

**v2**: `POST /apps/{app}/deploy`

This is the most significant API change.

#### v1 request

```json
{
  "entryPointUrl": "main.ts",
  "assets": {
    "main.ts": {
      "content": "Deno.serve((req) => new Response('Hello'));",
      "encoding": "utf-8"
    }
  },
  "envVars": {
    "MY_VAR": "my_value"
  }
}
```

#### v2 request

```json
{
  "assets": {
    "main.ts": {
      "kind": "file",
      "content": "Deno.serve((req) => new Response('Hello'));",
      "encoding": "utf-8"
    }
  },
  "config": {
    "install": "deno install",
    "runtime": {
      "type": "dynamic",
      "entrypoint": "main.ts"
    }
  },
  "env_vars": [
    { "key": "MY_VAR", "value": "my_value" }
  ]
}
```

Key differences:

| Aspect           | v1                                | v2                                                                           |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| Entrypoint       | Top-level `entryPointUrl`         | `config.runtime.entrypoint`                                                  |
| Assets           | `content`+`encoding` or `gitSha1` | `kind: "file"` with `content`+`encoding`, or `kind: "symlink"` with `target` |
| Env vars         | Object `{"KEY": "value"}`         | Array `[{"key": "KEY", "value": "value"}]`                                   |
| Import map       | `importMapUrl` field              | Not needed; Deno auto-discovers `deno.json`                                  |
| Lock file        | `lockFileUrl` field               | Not needed; handled by `deno install`                                        |
| Compiler options | `compilerOptions` field           | Not needed; use `deno.json`                                                  |
| Build config     | None (import caching only)        | `config.install` and `config.build`                                          |
| Response status  | `200`                             | `202 Accepted` (build is async)                                              |
| Databases/KV     | `databases` field                 | Not available                                                                |
| Permissions      | `permissions` field               | Not available                                                                |

**Build configuration:** In v1, the "build" step only cached imports. The
equivalent in v2 is `config.install: "deno install"` with `config.build: null`.
No framework preset is needed (leave `config.framework` as `""`).

**Configuration inheritance:** `config`, `env_vars`, and `layers` are all
optional in deploy requests. When omitted, the revision inherits the app's
configuration. Set these once when creating the app and then only send `assets`
in subsequent deploys.

#### Status values

| v1        | v2          | Meaning               |
| --------- | ----------- | --------------------- |
| `pending` | `queued`    | Build not yet started |
| _(none)_  | `building`  | Build in progress     |
| `success` | `succeeded` | Deployed and live     |
| `failed`  | `failed`    | Build failed          |

### Get deployment / revision status

**v1**: `GET /deployments/{deploymentId}`

**v2**: `GET /revisions/{revisionId}`

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/deployments/$DEPLOYMENT_ID"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/revisions/$REVISION_ID"
```

The v2 response includes `failure_reason` when status is `failed`.

### List deployments / revisions

**v1**: `GET /projects/{projectId}/deployments`

**v2**: `GET /apps/{app}/revisions`

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/projects/$PROJECT_ID/deployments?page=1&limit=20"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps/my-app-slug/revisions?limit=30"
```

| Aspect     | v1                 | v2                 |
| ---------- | ------------------ | ------------------ |
| Pagination | `page` + `limit`   | `cursor` + `limit` |
| Filtering  | `q` (search by ID) | `status`           |

### Tail build logs

**v1**: `GET /deployments/{deploymentId}/build_logs` (polling)

**v2** offers two approaches:

#### Stream revision progress (recommended)

`GET /revisions/{revisionId}/progress`

Emits events as the build progresses. Ends when the revision reaches a terminal
state (`succeeded`, `failed`, or `skipped`). Replaces the v1 pattern of polling
deployment status in a loop.

```bash
curl -H "Authorization: Bearer $TOKEN" \
  -H "Accept: text/event-stream" \
  "https://api.deno.com/v2/revisions/$REVISION_ID/progress"
```

#### Stream build logs

`GET /revisions/{revisionId}/build_logs`

```bash
curl -H "Authorization: Bearer $TOKEN" \
  -H "Accept: text/event-stream" \
  "https://api.deno.com/v2/revisions/$REVISION_ID/build_logs"
```

| Aspect         | v1                                         | v2                                                     |
| -------------- | ------------------------------------------ | ------------------------------------------------------ |
| Formats        | `application/x-ndjson`, `application/json` | `text/event-stream` (SSE), `application/x-ndjson`      |
| Log fields     | `level`, `message`                         | `timestamp`, `level`, `message`, `step`, `timeline`    |
| Filter by step | Not supported                              | `step` param (preparing/installing/building/deploying) |

### Query app logs

**v1**: `GET /deployments/{deploymentId}/app_logs`

**v2**: `GET /apps/{app}/logs`

In v1, logs are scoped to a single deployment. In v2, logs are scoped to an app
with optional filtering by `revision_id`.

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/deployments/$DEPLOYMENT_ID/app_logs?since=2024-01-01T00:00:00Z&until=2024-01-01T01:00:00Z"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps/my-app-slug/logs?start=2024-01-01T00:00:00Z&end=2024-01-01T01:00:00Z"
```

Parameter mapping:

| v1      | v2       | Notes                          |
| ------- | -------- | ------------------------------ |
| `since` | `start`  | Required in v2                 |
| `until` | `end`    | Optional                       |
| `limit` | `limit`  | v1: max 10000. v2: max 1000    |
| `order` | _(none)_ | v2 returns chronological order |
| `q`     | `query`  | Text search                    |
| `level` | `level`  | v1: `warning`. v2: `warn`      |

V2 wraps logs in an object with `next_cursor` for pagination:

```json
{
  "logs": [
    {
      "timestamp": "2024-01-01T00:00:01Z",
      "level": "info",
      "message": "Listening on http://0.0.0.0:8000",
      "region": "us-east-1",
      "revision_id": "abcdef12"
    }
  ],
  "next_cursor": "eyJsYXN0X3RzIjoiMjAy..."
}
```

**Streaming:** In v1, omitting `since` and `until` enables real-time streaming.
In v2, set `stream=true` for real-time streaming via SSE or NDJSON.

## Using labels to group apps

Labels replace the v1 pattern of grouping multiple deployments under a single
project:

```bash
# Create an app with labels
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.deno.com/v2/apps" \
  -d '{
    "slug": "my-service-auth",
    "labels": {
      "service": "my-service",
      "function": "auth"
    },
    "config": {
      "install": "deno install",
      "runtime": {
        "type": "dynamic",
        "entrypoint": "main.ts"
      }
    }
  }'

# List all apps in a service
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps?labels[service]=my-service"
```

## Using layers for shared configuration

Layers let you share environment variables across multiple apps. This was not
possible in v1, where env vars had to be duplicated in every deployment request.

```bash
# Create a layer with shared env vars
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.deno.com/v2/layers" \
  -d '{
    "slug": "my-service-shared",
    "env_vars": [
      {"key": "DATABASE_URL", "value": "postgres://...", "secret": true},
      {"key": "API_KEY", "value": "sk-...", "secret": true}
    ]
  }'

# Create an app that uses the layer
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.deno.com/v2/apps" \
  -d '{
    "slug": "my-service-auth",
    "layers": ["my-service-shared"],
    "labels": {"service": "my-service"},
    "config": {
      "install": "deno install",
      "runtime": {
        "type": "dynamic",
        "entrypoint": "main.ts"
      }
    }
  }'
```

When a layer's env vars are updated, all apps using that layer pick up the
changes immediately.

## Migration checklist

1. **Create a v2 organization token** in the Deno Deploy dashboard (`ddo_`
   prefix).
2. **Create one app per function** instead of deploying multiple functions to a
   single project. Use labels to group related apps.
3. **Set up layers** for environment variables shared across functions.
4. **Update deploy requests:**
   - Move `entryPointUrl` to `config.runtime.entrypoint`
   - Set `config.install` to `"deno install"`
   - Convert `envVars` object to `env_vars` array, or set on the app/layer
   - Add `kind: "file"` to assets
5. **Update build log tailing** to use `GET /revisions/{id}/progress` (SSE)
   instead of polling.
6. **Update log queries:**
   - `since`/`until` → `start`/`end`
   - `warning` → `warn`
   - Handle `{logs: [...], next_cursor: ...}` response wrapper
7. **Update pagination** from page-based to cursor-based.
8. **Update status values**: `pending` → `queued`, `success` → `succeeded`.
9. **Update field names** from camelCase to snake_case.
