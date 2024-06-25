---
title: "Using deployctl on the command line"
---

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
(recursively, except `node_modules` directories). You can customize this
behavior using the `--include` and `--exclude` arguments (also supported in the
config file). These arguments accept specific files, whole directories and
globs. Here are some examples:

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

### Environment variables

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
✔ Page 1 of the list of deployments of the project 'my-project' is ready
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Deployment  │               Date               │   Status   │  Database  │                       Domain                       │ Entrypoint │  Branch  │  Commit  │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ kcbxc4xwe4mc │ 12/3/2024 13:21:40 CET (2 days)  │ Preview    │ Preview    │ https://my-project-kcbxc4xwe4mc.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ c0ph5xa9exb3 │ 12/3/2024 13:21:25 CET (2 days)  │ Production │ Production │ https://my-project-c0ph5xa9exb3.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ kwkbev9er4h2 │ 12/3/2024 13:21:12 CET (2 days)  │ Preview    │ Preview    │ https://my-project-kwkbev9er4h2.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ dxseq0jc8402 │ 6/3/2024 23:16:51 CET (8 days)   │ Preview    │ Production │ https://my-project-dxseq0jc8402.deno.dev │ main.ts    │ main     │ 099359b  │
│ 7xr5thz8yjbz │ 6/3/2024 22:58:32 CET (8 days)   │ Preview    │ Preview    │ https://my-project-7xr5thz8yjbz.deno.dev │ main.ts    │ another  │ a4d2953  │
│ 4qr4h5ac3rfn │ 6/3/2024 22:57:05 CET (8 days)   │ Failed     │ Preview    │ n/a                                                │ main.ts    │ another  │ 56d2c88  │
│ 25wryhcqmb9q │ 6/3/2024 22:56:41 CET (8 days)   │ Preview    │ Preview    │ https://my-project-25wryhcqmb9q.deno.dev │ main.ts    │ another  │ 4b6c506  │
│ 64tbrn8jre9n │ 6/3/2024 8:21:33 CET (8 days)    │ Preview    │ Production │ https://my-project-64tbrn8jre9n.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ hgqgccnmzg04 │ 6/3/2024 8:17:40 CET (8 days)    │ Failed     │ Production │ n/a                                                │ main.ts    │ main     │ 8071902  │
│ rxkh1w3g74e8 │ 6/3/2024 8:17:28 CET (8 days)    │ Failed     │ Production │ n/a                                                │ main.ts    │ main     │ b142a59  │
│ wx6cw9aya64c │ 6/3/2024 8:02:29 CET (8 days)    │ Preview    │ Production │ https://my-project-wx6cw9aya64c.deno.dev │ main.ts    │ main     │ b803784  │
│ a1qh5fmew2yf │ 5/3/2024 16:25:29 CET (9 days)   │ Preview    │ Production │ https://my-project-a1qh5fmew2yf.deno.dev │ main.ts    │ main     │ 4bb1f0f  │
│ w6pf4r0rrdkb │ 5/3/2024 16:07:35 CET (9 days)   │ Preview    │ Production │ https://my-project-w6pf4r0rrdkb.deno.dev │ main.ts    │ main     │ 6e487fc  │
│ nn700gexgdzq │ 5/3/2024 13:37:11 CET (9 days)   │ Preview    │ Production │ https://my-project-nn700gexgdzq.deno.dev │ main.ts    │ main     │ c5b1d1f  │
│ 98crfqxa6vvf │ 5/3/2024 13:33:52 CET (9 days)   │ Preview    │ Production │ https://my-project-98crfqxa6vvf.deno.dev │ main.ts    │ main     │ 090146e  │
│ xcdcs014yc5p │ 5/3/2024 13:30:58 CET (9 days)   │ Preview    │ Production │ https://my-project-xcdcs014yc5p.deno.dev │ main.ts    │ main     │ 5b78c0f  │
│ btw43kx89ws1 │ 5/3/2024 13:27:31 CET (9 days)   │ Preview    │ Production │ https://my-project-btw43kx89ws1.deno.dev │ main.ts    │ main     │ 663452a  │
│ 62tg1ketkjx7 │ 5/3/2024 13:27:03 CET (9 days)   │ Preview    │ Production │ https://my-project-62tg1ketkjx7.deno.dev │ main.ts    │ main     │ 24d1618  │
│ 07ag6pt6kjex │ 5/3/2024 13:19:11 CET (9 days)   │ Preview    │ Production │ https://my-project-07ag6pt6kjex.deno.dev │ main.ts    │ main     │ 4944545  │
│ 4msyne1rvwj1 │ 5/3/2024 13:17:16 CET (9 days)   │ Preview    │ Production │ https://my-project-4msyne1rvwj1.deno.dev │ main.ts    │ main     │ dda85e1  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
Press enter to fetch the next page [Enter]
```

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

```
✔ The production deployment of the project 'my-project' is 'c0ph5xa9exb3'
✔ The details of the deployment 'c0ph5xa9exb3' are ready:

c0ph5xa9exb3
------------
Status:       Production
Date:         2 days, 12 hours, 29 minutes, 46 seconds ago (12/3/2024 13:21:25 CET)
Project:      my-project (e54f23b5-828d-4b7f-af12-706d4591062b)
Organization:	my-team (d97822ac-ee20-4ce9-b942-5389330b57ee)
Domain(s):    https://my-project.deno.dev
              https://my-project-c0ph5xa9exb3.deno.dev
Database:     Production (0efa985f-3793-48bc-8c05-f740ffab4ca0)
Entrypoint:   main.ts
Env Vars:     HOME
Git
  Ref:        main [4b6c506]
  Message:    change name
  Author:     John Doe @johndoe [mailto:johndoe@deno.com]
  Url:        https://github.com/arnauorriols/my-project/commit/4b6c50629ceeeb86601347732d01dc7ed63bf34f
Crons:        another cron [*/10 * * * *] succeeded at 15/3/2024 1:50:00 CET after 2 seconds (next at 15/3/2024 2:00:00 CET)
              newest cron [*/10 * * * *] n/a
              yet another cron [*/10 * * * *] failed at 15/3/2024 1:40:00 CET after 2 seconds (next at 15/3/2024 1:51:54 CET)
```

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

#### Environment Variables

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
┌────────┬────────────────┬────────────────────────┬─────────┬───────┬─────────┬──────────┬─────────────┬────────────┬─────────┬─────────┬───────────┬───────────┐
│ (idx)  │ deployment     │ region                 │ Req/min │ CPU%  │ CPU/req │ RSS/5min │ Ingress/min │ Egress/min │ KVr/min │ KVw/min │ QSenq/min │ QSdeq/min │
├────────┼────────────────┼────────────────────────┼─────────┼───────┼─────────┼──────────┼─────────────┼────────────┼─────────┼─────────┼───────────┼───────────┤
│ 6b80e8 │ "kcbxc4xwe4mc" │ "asia-northeast1"      │      80 │ 0.61  │ 4.56    │ 165.908  │ 11.657      │ 490.847    │       0 │       0 │         0 │         0 │
│ 08312f │ "kcbxc4xwe4mc" │ "asia-northeast1"      │      76 │ 3.49  │ 27.58   │ 186.278  │ 19.041      │ 3195.288   │       0 │       0 │         0 │         0 │
│ 77c10b │ "kcbxc4xwe4mc" │ "asia-south1"          │      28 │ 0.13  │ 2.86    │ 166.806  │ 7.354       │ 111.478    │       0 │       0 │         0 │         0 │
│ 15e356 │ "kcbxc4xwe4mc" │ "asia-south1"          │      66 │ 0.97  │ 8.93    │ 162.288  │ 17.56       │ 4538.371   │       0 │       0 │         0 │         0 │
│ a06817 │ "kcbxc4xwe4mc" │ "asia-southeast1"      │     126 │ 0.44  │ 2.11    │ 140.087  │ 16.504      │ 968.794    │       0 │       0 │         0 │         0 │
│ d012b6 │ "kcbxc4xwe4mc" │ "asia-southeast1"      │     119 │ 2.32  │ 11.72   │ 193.704  │ 23.44       │ 8359.829   │       0 │       0 │         0 │         0 │
│ 7d9a3d │ "kcbxc4xwe4mc" │ "australia-southeast1" │       8 │ 0.97  │ 75      │ 158.872  │ 10.538      │ 3.027      │       0 │       0 │         0 │         0 │
│ 3c21be │ "kcbxc4xwe4mc" │ "australia-southeast1" │       1 │ 0.04  │ 90      │ 105.292  │ 0.08        │ 1.642      │       0 │       0 │         0 │         0 │
│ b75dc7 │ "kcbxc4xwe4mc" │ "europe-west2"         │     461 │ 5.43  │ 7.08    │ 200.573  │ 63.842      │ 9832.936   │       0 │       0 │         0 │         0 │
│ 33607e │ "kcbxc4xwe4mc" │ "europe-west2"         │      35 │ 0.21  │ 3.69    │ 141.98   │ 9.438       │ 275.788    │       0 │       0 │         0 │         0 │
│ 9be3d2 │ "kcbxc4xwe4mc" │ "europe-west2"         │     132 │ 0.92  │ 4.19    │ 180.654  │ 15.959      │ 820.513    │       0 │       0 │         0 │         0 │
│ 33a859 │ "kcbxc4xwe4mc" │ "europe-west3"         │    1335 │ 7.57  │ 3.4     │ 172.032  │ 178.064     │ 10967.918  │       0 │       0 │         0 │         0 │
│ 3f54ce │ "kcbxc4xwe4mc" │ "europe-west4"         │     683 │ 4.76  │ 4.19    │ 187.802  │ 74.696      │ 7565.017   │       0 │       0 │         0 │         0 │
│ cf881c │ "kcbxc4xwe4mc" │ "europe-west4"         │     743 │ 3.95  │ 3.19    │ 177.213  │ 86.974      │ 6087.454   │       0 │       0 │         0 │         0 │
│ b4565b │ "kcbxc4xwe4mc" │ "me-west1"             │       3 │ 0.21  │ 55      │ 155.46   │ 2.181       │ 0.622      │       0 │       0 │         0 │         0 │
│ b97970 │ "kcbxc4xwe4mc" │ "southamerica-east1"   │       3 │ 0.08  │ 25      │ 186.049  │ 1.938       │ 0.555      │       0 │       0 │         0 │         0 │
│ fd7a08 │ "kcbxc4xwe4mc" │ "us-east4"             │       3 │ 0.32  │ 80      │ 201.101  │ 0.975       │ 58.495     │       0 │       0 │         0 │         0 │
│ 95d68a │ "kcbxc4xwe4mc" │ "us-east4"             │     133 │ 1.05  │ 4.77    │ 166.052  │ 28.107      │ 651.737    │       0 │       0 │         0 │         0 │
│ c473e7 │ "kcbxc4xwe4mc" │ "us-east4"             │       0 │ 0     │ 0       │ 174.154  │ 0.021       │ 0          │       0 │       0 │         0 │         0 │
│ ebabfb │ "kcbxc4xwe4mc" │ "us-east4"             │      19 │ 0.15  │ 4.78    │ 115.732  │ 7.764       │ 67.054     │       0 │       0 │         0 │         0 │
│ eac700 │ "kcbxc4xwe4mc" │ "us-south1"            │     114 │ 2.37  │ 12.54   │ 183.001  │ 18.401      │ 22417.397  │       0 │       0 │         0 │         0 │
│ cd2194 │ "kcbxc4xwe4mc" │ "us-south1"            │      35 │ 0.33  │ 5.68    │ 145.871  │ 8.142       │ 91.236     │       0 │       0 │         0 │         0 │
│ 140fec │ "kcbxc4xwe4mc" │ "us-west2"             │     110 │ 1.43  │ 7.84    │ 115.298  │ 18.093      │ 977.993    │       0 │       0 │         0 │         0 │
│ 51689f │ "kcbxc4xwe4mc" │ "us-west2"             │    1105 │ 7.66  │ 4.16    │ 187.277  │ 154.876     │ 14648.383  │       0 │       0 │         0 │         0 │
│ c5806e │ "kcbxc4xwe4mc" │ "us-west2"             │     620 │ 4.38  │ 4.24    │ 192.291  │ 109.086     │ 9685.688   │       0 │       0 │         0 │         0 │
└────────┴────────────────┴────────────────────────┴─────────┴───────┴─────────┴──────────┴─────────────┴────────────┴─────────┴─────────┴───────────┴───────────┘
⠼ Streaming...
```

The columns are defined as follows:

| Column      | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| idx         | Instance discriminator. Opaque id to discriminate different executions running in the same region. |
| deployment  | The id of the deployment running in the executing instance.                                        |
| Req/min     | Requests per minute received by the project.                                                       |
| CPU%        | Percentage of CPU used by the project.                                                             |
| CPU/req     | CPU time per request, in milliseconds.                                                             |
| RSS/5min    | Max RSS used by the project during the last 5 minutes, in MB.                                      |
| Ingress/min | Data received by the project per minute, in KB.                                                    |
| Egress/min  | Data output by the project per minute, in KB.                                                      |
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

To watch for file changes add the `--watch` flag:

```shell
$ deno run --allow-net=:8000 --watch ./main.ts
Listening on http://localhost:8000
```

For more information about the Deno CLI, and how to configure your development
environment and IDE, visit the Deno Manual's [Getting Started][manual-gs]
section.

[manual-gs]: https://deno.land/manual/getting_started

## JSON output

All the commands that output data have a `--format=json` option that outputs the
data in JSON objects. This output mode is the default when stdout is not a TTY,
notably when piping to another command. Together with `jq`, this mode enables
the programmatic use of all the data provided by `deployctl`:

Get the id of the current production deployment:

```shell
deployctl deployments show | jq .build.deploymentId
```

Get a csv stream of the CPU time per request on each isolate of each region:

```shell
deployctl top | jq -r '[.id,.region,.cpuTimePerRequest] | @csv'
```
````
