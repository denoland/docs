# Deployments

A deployment is a snapshot of all code and environment variables required to run
an application. Deployments are immutable after they have been created. To
deploy a new version of the code for an application, a new deployment must be
created.

## Custom domains

There can also be other URLs that can point to a deployment, like
[custom domains](custom-domains).

## Branch domains

`<projectname--branchname>.deno.dev` is also supported.

## Production vs. preview deployments

All deployments have a preview URL that can be used to view this specific
deployment. Preview URLs have the format
`{project_name}-{deployment_id}.deno.dev`.

![image](../docs-images/preview_deployment.png)

A deployment can either be a production or a preview deployment. These
deployments do not have any differences in runtime functionality. The only
distinguishing factor is that a project's production deployment will receive
traffic from the project URL (e.g. `myproject.deno.dev`), and from custom
domains in addition to traffic to the deployment's preview URL.

## Promoting preview deployments to production deployments via Deno Deploy UI

Preview deployments can be "promoted" to production via the Deno Deploy UI:

1. Navigate to the project page.
2. Click on the **Deployments** tab.
3. Click on the three dots next to the deployment you want to promote to
   production and select **Promote to Production**
   ![promote_to_production](../docs-images/promote_to_production.png)

## Creating production deployments via `deployctl`

If you are deploying your Deno code with `deployctl`, you can deploy to
production with the `--prod` flag:

```sh
deployctl deploy --prod --project=helloworld main.ts
```
