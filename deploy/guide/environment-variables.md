# Environment variables

Environment variables are useful to store values like access tokens of web
services. You can create them in the project dashboard and access them in your
code via the `Deno.env` API. They are made available to both production and
preview deployments.

## Add an environment variable

To add an environment variable to your project, click on the **Settings** button
on the project page and then on **Environment Variables** from the sidebar. Fill
in the key/value fields and click on "Add" to add an environment variable to
your project. A new production deployment will be created automatically with the
new environment variables.

![environment_variable](../docs-images/fauna2.png)

Note that currently, this is the only way to add an environment variable. Even
if you deployed with `deployctl` or the Github integration, to add environment
variables, you must do so from the project page UI.

### Preset Variables

Every deployment has the following environment variables preset, which you can
access from your code.

1. `DENO_REGION`

   It holds the region code of the region in which the deployment is running.
   You can use this variable to serve region-specific content.

   You can refer to the region code from the [regions page](regions).

1. `DENO_DEPLOYMENT_ID`

   It holds the ID of the deployment.
