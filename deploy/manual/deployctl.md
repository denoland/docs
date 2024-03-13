# Using deployctl on the command line

`deployctl` is a command line tool (CLI) that lets you operate the Deno Deploy
platform without leaving your terminal. With it you can deploy your code, create
and manage your projects and their deployments, and monitor their usage and
logs.

## Dependencies

The only dependency for `deployctl` is the Deno runtime. You can install it by
running the following command:

```sh
curl -fsSL https://deno.land/install.sh | sh
```

You don't need to setup a Deno Deploy account beforhand. It will be created
along the way when you deploy your first project.

## Install `deployctl`

With the Deno runtime installed, you can install the `deployctl` utility with
the following command:

```sh
deno install -Arf jsr:@deno/deployctl
```

The `-A` option in the deno install command grants all permissions to the
installed script. You can opt not to use it, in which case you will be prompted
to grant the necessary permissions when needed during the execution of the tool.

## Deploy

To perform a new deployment of your code, navigate to the root directory of your
project and execute:

```shell
deployctl deploy
```

### Project and Entrypoint

If this is the first deployment of the project, `deployctl` will guess the
project name based on the Git repo or directory it is in. Similarly, it will
guess the entrypoint by looking for files with common entrypoint names (main.ts,
src/main.ts, etc). After the first deployment, the settings used will be stored
in a config file (by default deno.json).

You can specify the project name and/or the entrypoint using the `--project` and
`--entrypoint` arguments respectively. If the project does not exist, it will be
created automatically. By default it is created in the personal organization of
the user, but it can also be created in a custom organization by specifying the
`--org` argument. If the organization does not exist yet, it will also be
created automatically.

```shell
deployctl deploy --project=helloworld --entrypoint=src/entrypoint.ts --org=my-team
```

### Include and Exclude Files

By default, deployctl deploys all the files in the current directory
(recursively, except node_modules directories). You can customize this behavior
using the `--include` and `--exclude` arguments (also supported in the config
file). These arguments accept specific files, whole directories and globs. Here
are some examples:

- Include only source and static files:

  ```shell
  deployctl deploy --include=./src --include=./static
  ```

- Include only Typescript files:

  ```shell
  deployctl deploy --include=**/*.ts
  ```

- Exclude local tooling and artifacts

  ```shell
  deployctl deploy --exclude=./tools --exclude=./benches
  ```

A common pitfall is to not include the source code modules that need to be run
(entrypoint and dependencies). The following example will fail because `main.ts`
is not included:

```shell
deployctl deploy --include=./static --entrypoint=./main.ts
```

The entrypoint can also be a remote script. A common use case for this is to
deploy an static site using `std/http/file_server.ts` (more details in
[Static Site Tutorial](https://docs.deno.com/deploy/tutorials/static-site)):

```shell
deployctl deploy --include=dist --entrypoint=jsr:@std/http/file_server
```

You can set env variables using `--env` (to set individual environment
variables) or `--env-file` (to load one or more environment files). These
options can be combined and used multiple times:

```shell
deployctl deploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

The deployment will have access to these variables using `Deno.env.get()`. Be
aware that the env variables set with `--env` and `--env-file` are specific for
the deployment being created and are not added to the list of
[env variables configured for the project](./environment-variables.md).

### Production Deployments

Each deployment you create have a unique URL. In addition, a project has a
"production URL" and custom domains routing trafffic to its "production"
deployment. Deployments can be promoted to production at any time, or created
directly as production using the `--prod` flag:

```shell
deployctl deploy --prod
```

Learn more about production deployments in the [Deployments](./deployments)
docs.

## Deployments

The deployments subcommand groups all the operations around deployments.

### List

You can list the deployments of a project with:

```shell
deployctl deployments list
```

Output:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Deployment │ Date │ Status │ Database │ Domain │ Entrypoint │ Branch │ Commit
│
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ dxseq0jc8402 │ 6/3/2024 23:16:51 CET (5 days) │ Preview │ Production │
https://my-project-dxseq0jc8402.deno.dev │ main.ts │ main │ 099359b │ │
7xr5thz8yjbz │ 6/3/2024 22:58:32 CET (5 days) │ Preview │ Preview │
https://my-project-7xr5thz8yjbz.deno.dev │ main.ts │ another │ a4d2953 │ │
4qr4h5ac3rfn │ 6/3/2024 22:57:05 CET (5 days) │ Failed │ Preview │ n/a │ main.ts
│ another │ 56d2c88 │ │ 25wryhcqmb9q │ 6/3/2024 22:56:41 CET (5 days) │ Preview
│ Preview │ https://my-project-25wryhcqmb9q.deno.dev │ main.ts │ another │
4b6c506 │ │ 64tbrn8jre9n │ 6/3/2024 8:21:33 CET (6 days) │ Production │
Production │ https://my-project-64tbrn8jre9n.deno.dev │ main.ts │ main │ 4b6c506
│ │ hgqgccnmzg04 │ 6/3/2024 8:17:40 CET (6 days) │ Failed │ Production │ n/a │
main.ts │ main │ 8071902 │ │ rxkh1w3g74e8 │ 6/3/2024 8:17:28 CET (6 days) │
Failed │ Production │ n/a │ main.ts │ main │ b142a59 │ │ wx6cw9aya64c │ 6/3/2024
8:02:29 CET (6 days) │ Preview │ Production │
https://my-project-wx6cw9aya64c.deno.dev │ main.ts │ main │ b803784 │ │
a1qh5fmew2yf │ 5/3/2024 16:25:29 CET (6 days) │ Preview │ Production │
https://my-project-a1qh5fmew2yf.deno.dev │ main.ts │ main │ 4bb1f0f │ │
w6pf4r0rrdkb │ 5/3/2024 16:07:35 CET (6 days) │ Preview │ Production │
https://my-project-w6pf4r0rrdkb.deno.dev │ main.ts │ main │ 6e487fc │ │
nn700gexgdzq │ 5/3/2024 13:37:11 CET (6 days) │ Preview │ Production │
https://my-project-nn700gexgdzq.deno.dev │ main.ts │ main │ c5b1d1f │ │
98crfqxa6vvf │ 5/3/2024 13:33:52 CET (6 days) │ Preview │ Production │
https://my-project-98crfqxa6vvf.deno.dev │ main.ts │ main │ 090146e │ │
xcdcs014yc5p │ 5/3/2024 13:30:58 CET (6 days) │ Preview │ Production │
https://my-project-xcdcs014yc5p.deno.dev │ main.ts │ main │ 5b78c0f │ │
btw43kx89ws1 │ 5/3/2024 13:27:31 CET (6 days) │ Preview │ Production │
https://my-project-btw43kx89ws1.deno.dev │ main.ts │ main │ 663452a │ │
62tg1ketkjx7 │ 5/3/2024 13:27:03 CET (6 days) │ Preview │ Production │
https://my-project-62tg1ketkjx7.deno.dev │ main.ts │ main │ 24d1618 │ │
07ag6pt6kjex │ 5/3/2024 13:19:11 CET (6 days) │ Preview │ Production │
https://my-project-07ag6pt6kjex.deno.dev │ main.ts │ main │ 4944545 │ │
4msyne1rvwj1 │ 5/3/2024 13:17:16 CET (6 days) │ Preview │ Production │
https://my-project-4msyne1rvwj1.deno.dev │ main.ts │ main │ dda85e1 │ │
1p8nrfe53bqy │ 5/3/2024 12:53:47 CET (6 days) │ Preview │ Production │
https://my-project-1p8nrfe53bqy.deno.dev │ main.ts │ test │ d93368f │ │
n9jk4xkh9vdv │ 5/3/2024 12:52:31 CET (6 days) │ Preview │ Preview │
https://my-project-n9jk4xkh9vdv.deno.dev │ main.ts │ test │ d93368f │ │
gr3z1ysvd2an │ 5/3/2024 12:51:21 CET (6 days) │ Preview │ Preview │
https://my-project-gr3z1ysvd2an.deno.dev │ main.ts │ test │ bd4bc04 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
Press enter to fetch the next page [Enter]
```

![deployctl deployments list output](images/deployctl-deployments-list.png)

This command outputs pages of 20 deployments by default. You can iterate over
the pages with the enter key, and use the `--page` and `--limit` options to
query a specific page and page size.

Like with the rest of commands, you can use the `--project` option to specify
the project of which to list deployments, if you are not in a project directory
or want to list deployments from a different project.

### Show

Get all the details of a particular deployment using:

```shell
deployctl deployments show
```

Output:

![deployctl deployments show output](images/deployctl-deployments-show.png)

If no deployment is specified, the command shows the details of the current
production deployment of the project. To see the details of the last deployment,
use `--last`, and to see the details of a particular deployment, use `--id` (or
positional argument). You can also use `--next` or `--prev` to navigate the
deployments chronologically.

For example, to see the details of the second to last deployment, you can do:

```shell
deployctl deployments show --last --prev
```

And to see the details of 2 deployments after a specific deployment:

```shell
deployctl deployments show 64tbrn8jre9n --next=2
```

### Redeploy

The redeploy command creates a new deployment reusing the build of an existing
deployment, for the purpose of changing the resources associated with it. This
includes production domains, environment variables and KV databases.

:::info

The semantics of selecting the deployment to redeploy are the same as those of
the [show subcommand](#show), including `--last`, `--id`, `--next` and `--prev`.

:::

#### Production Domains

If you want to change the routing of the production domains of the project to a
particular deployment, you can redeploy it with the `--prod` option:

```shell
deployctl deployments redeploy --prod 64tbrn8jre9n
```

This will create a new deployment with the same code and environment variables
as the specified deployment, but with the production domains of the project
pointing to it. For those projects with preview/prod databases (ie projects
linked to GitHub), this will also set the production database for the new
deployment.

:::note

This feature is similar to the "promote to production" button found in the Deno
Deploy web application with the exception that the "promote to production"
button does not create a new deployment. Instead, the "promote to production"
button changes the domain routing in-place, however it's restricted to
deployments already using the production database.

:::

#### KV Database

If this is a GitHub deployment, it will have 2 databases, one for prod
deployments and one for preview deployments. You can change the database of a
deployment by redeploying it with the `--db` option:

```shell
deployctl deployments redeploy --db=prod --id=64tbrn8jre9n
```

:::note

When redeploying a deployment to prod, by default it will automatically
configure it to use the prod database. You can combine both `--prod` and `--db`
options to opt out of this behavior. For example, the following command will
redeploy the current production deployment (given the lack of positional
argument, `--id` or `--last`). The new deployment will become the new production
deployment, but it will use the preview database instead of the production
database:

```shell
deployctl deployments redeploy --prod --db=preview
```

:::

If your organization has custom databases, you can also set them by UUID:

```shell
deployctl deployments redeploy --last --db=5261e096-f9aa-4b72-8440-1c2b5b553def
```

#### Env Variables

When a deployment is created, it inherits the environment variables of the
project. Given that the deployments are immutable, their environment variables
can never be changed. To set new environment variables in a deployment, you need
to redeploy it using `--env` (to set individual variables) and `--env-file` (to
load one or more environment files).

The following command redeploys the current production deployment with the env
variables defined in the `.env` and `.other-env` files, plus the `DEPLOYMENT_TS`
variable set to the current timestamp. The resulting deployment will be a
preview deployment (ie the production domains won't route traffic to it, given
the lack of `--prod`).

```shell
deployctl deployments redeploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

:::note

Be aware that when changing env variables, only the env variables set in the
redeploy command will be used by the new deployment. The project env variables
and the env variables of the deployment being redeployed are ignored. If this
does not suit your needs, please report your feedback at
https://github.com/denoland/deploy_feedback/issues/

:::

:::note

When you change the project environment variables in the Deno Deploy web
application, the current production deployment is redeployed with the new
environment variables, and the new deployment becomes the new production
deployment.

:::

### Delete

You can delete a deployment using the `delete` subcommand:

```shell
deployctl deployments delete 64tbrn8jre9n
```

Like `show` and `redeploy`, `delete` can also use `--last`, `--next` and
`--prev` to select the deployment to delete. Here's an example command that
deletes all the deployments of a project except the last (use with caution!):

```shell
while deployctl deployments delete --project=my-project --last --prev; do :; done
```

## Projects

The `projects` subcommand groups all the operations against projects as a whole.
this includes `list`, `show`, `rename`, `create` and `delete`.

### List

`deployctl projects list` outputs all the projects your user has access to,
grouped by organization:

```
Personal org:
    blog
    url-shortener

'my-team' org:
    admin-site
    main-site
    analytics
```

You can filter by organization using `--org`:

```shell
deployctl projects list --org=my-team
```

### Show

To see the details of a particular project, use `projects show`. If you are
inside a project, it will pick up the project id from the config file. You can
also specify the project using `--project` or the positional argument:

```shell
deployctl projects show main-site
```

Output:

```
main-site
---------
Organization:	my-team (5261e096-f9aa-4b72-8440-1c2b5b553def)
Domain(s):  	https://my-team.com
		          https://main-site.deno.dev
Dash URL:	    https://dash.deno.com/projects/8422c515-f68f-49b2-89f3-157f4b144611
Repository:	  https://github.com/my-team/main-site
Databases:  	[main] dd28e63e-f495-416b-909a-183380e3a232
		          [*] e061c76e-4445-409a-bc36-a1a9040c83b3
Crons:		    another cron [*/10 * * * *] succeeded at 12/3/2024 14:40:00 CET after 2 seconds (next at 12/3/2024 14:50:00 CET)
		          newest cron [*/10 * * * *] n/a
		          yet another cron [*/10 * * * *] failed at 12/3/2024 14:40:00 CET after 2 seconds (next at 12/3/2024 14:50:00 CET)
Deployments:	kcbxc4xwe4mc	c0ph5xa9exb3*	kwkbev9er4h2	dxseq0jc8402	7xr5thz8yjbz
		          4qr4h5ac3rfn	25wryhcqmb9q	64tbrn8jre9n	hgqgccnmzg04	rxkh1w3g74e8
		          wx6cw9aya64c	a1qh5fmew2yf	w6pf4r0rrdkb	nn700gexgdzq	98crfqxa6vvf
		          xcdcs014yc5p	btw43kx89ws1	62tg1ketkjx7	07ag6pt6kjex	4msyne1rvwj1
```

### Rename

Projects can be renamed easily with the `rename` subcommand. Similarly to the
other commands, if you run the command from within a project's directory, you
don't need to specify the current name of the project:

```shell
deployctl projects rename my-personal-blog
```

Output:

```
ℹ Using config file '/private/tmp/blog/deno.json'
✔ Project 'blog' (8422c515-f68f-49b2-89f3-157f4b144611) found
✔ Project 'blog' renamed to 'my-personal-blog'
```

:::note

Keep in mind that the name of the project is part of the preview domains
(https://my-personal-blog-kcbxc4xwe4mc.deno.dev) and the default production
domain (https://my-personal-blog.deno.dev). Therefore, when changing the project
name, the URLs with the previous name will no longer route to the project's
corresponding deployments.

:::

### Create

You can create an empty project with:

```shell
deployctl projects create my-new-project
```

### Delete

You can delete a project with:

```shell
deployctl projects delete my-new-project
```

## Top

The `top` subcommand is used to monitor the resource usage of a project in
real-time:

```shell
deployctl top
```

Output:

```
┌────────┬──────────────────────┬─────────┬───────┬─────────┬──────────┬─────────────┬────────────┬─────────┬─────────┬───────────┬───────────┐
│ (idx)  │ region               │ Req/min │ CPU%  │ CPU/req │ RSS/5min │ Ingress/min │ Egress/min │ KVr/min │ KVw/min │ QSenq/min │ QSdeq/min │
├────────┼──────────────────────┼─────────┼───────┼─────────┼──────────┼─────────────┼────────────┼─────────┼─────────┼───────────┼───────────┤
│ 192069 │ "me-west1"           │       3 │ 0.24  │ 52.5    │ 171.758  │ 2.173       │ 11.825     │       0 │       0 │         0 │         0 │
│ e8cf9a │ "asia-northeast1"    │      12 │ 0.11  │ 5.86    │ 171.602  │ 4.617       │ 526.807    │       0 │       0 │         0 │         0 │
│ 8e454d │ "asia-south1"        │      29 │ 0.54  │ 11.36   │ 173.924  │ 7.625       │ 3531.609   │       0 │       0 │         0 │         0 │
│ 6f5bfc │ "asia-south1"        │       2 │ 0.02  │ 10      │ 109.277  │ 1.844       │ 20.972     │       0 │       0 │         0 │         0 │
│ b752eb │ "asia-southeast1"    │     199 │ 3.56  │ 10.76   │ 172.351  │ 31.907      │ 18922.383  │       0 │       0 │         0 │         0 │
│ 9d0f5a │ "europe-west2"       │      35 │ 0.28  │ 4.88    │ 165.159  │ 6.514       │ 414.161    │       0 │       0 │         0 │         0 │
│ 2f6d35 │ "europe-west2"       │     266 │ 5.88  │ 13.27   │ 167.58   │ 59.008      │ 12984.032  │       0 │       0 │         0 │         0 │
│ 6d192d │ "europe-west4"       │     108 │ 2.24  │ 12.57   │ 195.256  │ 16.362      │ 9913.759   │       0 │       0 │         0 │         0 │
│ ef8cb5 │ "europe-west4"       │       0 │ 0.01  │ 0       │ 121.496  │ 0.014       │ 0          │       0 │       0 │         0 │         0 │
│ 382f55 │ "europe-west4"       │      11 │ 1.27  │ 74.21   │ 109.072  │ 5.366       │ 80.014     │       0 │       0 │         0 │         0 │
│ 200f5a │ "southamerica-east1" │       5 │ 0.08  │ 10      │ 125.977  │ 1.605       │ 247.71     │       0 │       0 │         0 │         0 │
│ 059d4e │ "southamerica-east1" │      79 │ 5.11  │ 39.12   │ 192.852  │ 22.86       │ 82451.51   │       0 │       0 │         0 │         0 │
│ 78d09b │ "us-east4"           │    1003 │ 7.17  │ 4.29    │ 201.97   │ 154.459     │ 15679.388  │       0 │       0 │         0 │         0 │
│ 57e0da │ "us-east4"           │      12 │ 0.1   │ 5.23    │ 138.924  │ 3.292       │ 33.882     │       0 │       0 │         0 │         0 │
│ e933ae │ "us-east4"           │     155 │ 1.43  │ 5.55    │ 177.975  │ 32.093      │ 1713.675   │       0 │       0 │         0 │         0 │
│ 1b534a │ "us-east4"           │    2304 │ 19.62 │ 5.11    │ 194.482  │ 261.459     │ 57665.728  │       0 │       0 │         0 │         0 │
│ a6f37d │ "us-south1"          │       0 │ 0     │ 0       │ 126.992  │ 0           │ 0          │       0 │       0 │         0 │         0 │
│ cd0a49 │ "us-south1"          │      27 │ 1.39  │ 31.67   │ 181.944  │ 7.461       │ 16322.601  │       0 │       0 │         0 │         0 │
│ 0a5661 │ "us-west2"           │      59 │ 0.55  │ 5.67    │ 192.348  │ 9.934       │ 585.351    │       0 │       0 │         0 │         0 │
│ 2e6dc2 │ "us-west2"           │       4 │ 0.03  │ 4.67    │ 123.879  │ 1.01        │ 6.26       │       0 │       0 │         0 │         0 │
│ 678a44 │ "us-west2"           │    4072 │ 26.91 │ 3.97    │ 220.545  │ 509.169     │ 72558.061  │       0 │       0 │         0 │         0 │
│ a0aac9 │ "us-west2"           │    1553 │ 9.28  │ 3.59    │ 170.598  │ 199.28      │ 12704.27   │       0 │       0 │         0 │         0 │
└────────┴──────────────────────┴─────────┴───────┴─────────┴──────────┴─────────────┴────────────┴─────────┴─────────┴───────────┴───────────┘
```

The columns are defined as follows:

| Column      | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| idx         | Instance discriminator. Opaque id to discriminate different executions running in the same region. |
| Req/min     | Requests per minute received by the project.                                                       |
| CPU%        | Percentage of CPU used by the project.                                                             |
| CPU/req     | CPU time per request, in milliseconds.                                                             |
| RSS/5min    | Max RSS used by the project during the last 5 minutes, in MB.                                      |
| Ingress/min | Data received by the project per minute, in KB.                                                    |
| Egress/min  | Data outputed by the project per minute, in KB.                                                    |
| KVr/min     | KV reads performed by the project per minute.                                                      |
| KVw/min     | KV writes performed by the project per minute.                                                     |
| QSenq/min   | Queues enqueues performed by the project per minute.                                               |
| QSdeq/min   | Queues dequeues performed by the project per minute.                                               |

You can filter by region using `--region`, which accepts substrings and can be
used multiple times:

```shell
deployctl top --region=asia --region=southamerica
```

## Logs

You can fetch the logs of your deployments with `deployctl logs`. It supports
both live logs where the logs are streamed to the console as they are generated,
and query persisted logs where the logs generated in the past are fetched.

To show the live logs of the current production deployment of a project:

```shell
deployctl logs
```

:::note

Unlike in the Deno Deploy web application, at the moment the logs subcommand
does not automatically switch to the new production deployment when it changes.

:::

To show the live logs of a particular deployment:

````shell
deployctl logs --deployment=1234567890ab
```

Logs can be filtered by level, region and text using `--levels` `--regions` and `--grep` options:

```shell
deployctl logs --levels=error,info --regions=region1,region2 --grep='unexpected'
```

To show the persisted logs, use the `--since` and/or `--until` options:


<Tabs groupId="operating-systems">
  <TabItem value="mac" label="macOS" default>

```sh
deployctl logs --since=$(date -Iseconds -v-2H) --until=$(date -Iseconds -v-30M)
```

</TabItem>
  <TabItem value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
deployctl logs --since=$(date -Iseconds --date='2 hours ago') --until=$(date -Iseconds --date='30 minutes ago')
```
</TabItem>
</Tabs>

## API

If you use the [subhosting API](../../subhosting/manual/index.md), `deployctl api` will help
you interact with the API by handling the authentication and headers for you:

```shell
deployctl api /projects/my-personal-blog/deployments
```

Use `--method` and `--body` to specify the HTTP method and the request body:

```shell
deployctl api --method=POST --body='{"name": "main-site"}' organizations/5261e096-f9aa-4b72-8440-1c2b5b553def/projects
```

## Local Development

For local development you can use the `deno` CLI. To install `deno`, follow the
instructions in the
[Deno manual](https://deno.land/manual/getting_started/installation).

After installation, you can run your scripts locally:

```shell
$ deno run --allow-net=:8000 ./main.ts
Listening on http://localhost:8000
````

To watch for file changes add the `--watch` flag:

```shell
$ deno run --allow-net=:8000 --watch ./main.ts
Listening on http://localhost:8000
```

For more information about the Deno CLI, and how to configure your development
environment and IDE, visit the Deno Manual's [Getting Started][manual-gs]
section.

[manual-gs]: https://deno.land/manual/getting_started

# TODO: json piping

# TODO: decide if text snippet or screenshot

# TODO: Update rest of docs with new deployctl

- remove need for token management
- mention deployctl in subhosting getting started

```
```
