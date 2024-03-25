# CI and GitHub Actions

Deno Deploy's Git integration enables deployment of code changes that are pushed
to a GitHub repository. Commits on the production branch will be deployed as a
production deployment. Commits on all other branches will be deployed as a
preview deployment.

There are two modes of operation for the Git integration:

- **Automatic**: Deno Deploy will automatically pull code and assets from your
  repository source every time you push, and deploy it. This mode is very fast,
  but does not allow for a build step. _This is the recommended mode for most
  users._
- **GitHub Actions**: In this mode, you push your code and assets to Deno Deploy
  from a GitHub Actions workflow. This allows you to perform a build step before
  deploying.

Deno Deploy will select an appropriate mode based on your custom deployment
configuration. Below, we go into more detail about the different configurations
for **Automatic** and **GitHub Actions** mode.

## Automatic

If your project doesn't require any additional build steps, then the system
choose **Automatic** mode. The entrypoint file is simply the file that Deno
Deploy will run.

## GitHub Actions

If you enter a command in **Install Step** and/or **Build Step** in the
**Project Configuration**, Deno Deploy will create a necessary GitHub Actions
workflow file and push it into your repository. In this workflow file, we
leverage the `deployctl` [Github action][deploy-action] to deploy your project.
You can do whatever you need to do, such as running a build command, before
deploying it to Deno Deploy.

To configure preprocessing commands you want to run, click **Show advanced
options** button that appears after choosing your git repository. Then enter
values as needed to input boxes.

:::tip

For example, if you want to enable [ahead-of-time builds] for a Fresh project,
you will enter `deno task build` in the **Build Step** box.

See also [the Fresh doc][Deploy to production] for deploying a Fresh project to
Deno Deploy.

:::

The GitHub Actions workflow file that Deno Deploy generates and pushes to your
repository looks like as follows.

```yml title=".github/workflows/deploy.yml"
name: Deploy
on:
  push:
    branches: main
  pull_request:
    branches: main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    permissions:
      id-token: write # Needed for auth with Deno Deploy
      contents: read # Needed to clone the repository

    steps:
      - name: Clone repository
        uses: actions/checkout@v3

      - name: Install Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Build step
        run: "deno task build"

      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: "<your-project-name>"
          entrypoint: "main.ts"
          root: "."
```

See
[deployctl README](https://github.com/denoland/deployctl/blob/main/action/README.md)
for more details.

[fileserver]: https://jsr.io/@std/http/doc/file_server/~
[ghapp]: https://github.com/apps/deno-deploy
[deploy-action]: https://github.com/denoland/deployctl/blob/main/action/README.md
[ahead-of-time builds]: https://fresh.deno.dev/docs/concepts/ahead-of-time-builds
[Deploy to production]: https://fresh.deno.dev/docs/getting-started/deploy-to-production
