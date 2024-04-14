# Deploy with GitHub integration

The simplest way to deploy more complex projects is via our Github integration.
This allows you to link a Deno Deploy project to a GitHub repository. Every time
you push to the repository, your changes will be automatically deployed.

Via the Github integration, you can add a Github Action that defines a build
step in your deployment process.

See [the Github integration page](ci_github) for more details.

### Deploy from command line with [`deployctl`](./deployctl.md)

`deployctl` is a command line tool for deploying your code to Deno Deploy. You
can control more details of your deployment than the above automatic GitHub
integration by using `deployctl`.

See [the `deployctl` page](./deployctl.md) for more details.

### Deploy with playground

The easiest way to deploy some code is via a Deno Deploy playground.

See the [playground page](playgrounds) for more details.
