---
title: "Getting started"
description: "Step-by-step guide to creating and configuring your first Deno Deploy Early Access application, including organization setup, build configuration, environment variables, and deployment monitoring."
---

:::caution

Deno Deploy EA is in private access. You must be explicitly granted permission
to use it, otherwise you will be unable to visit the new dashboard.

:::

## Create an organization

To get started with Deno Deploy EA, you must first create a Deno Deploy EA
organization. You can do this by visiting [app.deno.com](http://app.deno.com).

Upon first visiting the dashboard, you’ll be greeted by the Deno Deploy EA
organization creation screen:

![The Deno Deploy EA organization creation screen.](./images/create_org.png)

You can not currently create an organization that has the same slug as any
project name in Deno Deploy Classic.

Currently, the organization name and organization slug can not be changed after
organization creation.

## Create an app

After creating an organization, you will be redirected to the organization apps
page, where you can see the list of all organizations in the app. From here you
can navigate to the organization settings, and the custom domains list which
manages the custom domains attached to your organization.

To create an app, press the `+ New App` button:

![Screenshot of deploy app creation screen](./images/create_app.png)

An application is a single deployed web service with one build configuration,
build history, environment variables, attached custom domains, a linked GitHub
repository, etc.

## Select a repo

![Screenshot of deploy org selection screen](./images/select_org.png)

Next, you will need to select the GitHub repository to deploy your app code
from. At time of writing, you must deploy from a GitHub repository.

If your repository does not show up, use the `Add another GitHub account` or
`Configure GitHub App permissions` buttons in the user/org, or repo dropdowns to
grant the Deno Deploy GitHub app permission to deploy your repositories.

> ⏳ We do not yet support deploying mono-repos (for examples, repos where the
> actual application lives entirely in a subdirectory).

## Configure your app

After selecting a GitHub repository, Deno Deploy EA will automatically attempt
to detect the kind of application you are deploying and determine appropriate
build configuration. You can see the detected configuration in the `App Config`
box on the top right.

![Screenshot of Deploy application configuration screen](./images/app_config.png)

If the build configuration was incorrectly detected, or you want to make changes
to it, click the `Edit build config` button to open the build config drawer.

![Screenshot of Deploy build configuration screen](./images/build_config.png)

## Configure your build

In the build config drawer you can edit the framework preset. If you are not
using a framework, or are using a framework that is not in the list, select
`No Preset`.

You can then edit multiple options depending on what preset you have selected:

### install command

If you need to install dependencies before running the build command, such as
`npm install`, `deno install`, or similar, enter this command here. If you are
deploying a Deno application that does not have a `package.json`, you can
usually leave this empty.

### Build command

The command to execute to take your source code and build/bundle/compile the
application to be able to deploy it. This could be a framework build command
such as `next build`, a build task in your `package.json` or `deno.json`, or a
any other shell script. If your application does not have a build command, such
as a server-side Deno application with a JavaScript or TypeScript entrypoint,
you can leave this field empty.

### Runtime configuration

For most frameworks there are no options to configure here, as Deno Deploy EA
will figure out the ideal runtime configuration for the app based on the
framework preset. When a framework is not configured, you can choose here
whether the app is a `Dynamic` app that needs to execute code server side for
every request, such as an API server, server-side rendered application, etc., or
a `Static` app that consists only of a set of static files that need to be
hosted.

### Dynamic Entrypoint

The JavaScript or TypeScript file that should be executed to start the
application. This is the file path that you would pass to`deno
run`locally to
start the app. The path has to be relative to the working directory.

### Dynamic arguments

Additional command line arguments to pass to the app on startup, after the
entrypoint. These are arguments that are passed to the application not to Deno
itself.

### Static Directory

The directory in the working directory that contains the static files to be
served. For example,`dist`,`_site`, or`.output`.

### Single Page App mode

Whether the application is a single page app that should have the root
`index.html` served for any paths that do not exist as files in the static
directory, instead of a 404 page.

Closing the drawer saves the settings.

### Environment variables

On this page, you can also add environment variables by pressing the
`Add/Edit environment variables` button:

![Screenshot of the Deploy env variables config screen](./images/env_var.png)

In this drawer, press the `+ Add variable` button to create a new environment
variable for this project. You can give it a name, a value, and select whether
this variable should be saved in plain text (you can view the value from the
console later), or as a secret (you can not view the value from the console
later).

You can also select what contexts the environment variable should be available
in. The available contexts are:

- **Production:** requests hitting your application through one of the
  production domains, such as `<app>.<org>.deno.net`, or a custom domain.
- **Development:** requests hitting preview domains, or git branch domains of
  your application.

Environment variables must be added to at least one context, but can be added to
multiple, or even all contexts.

To save the environment variables, press the save button. You can re-open the
drawer to edit / remove environment variables you have added.

You can also edit the app name on this page, and select which region(s) the
application should be served from.

## Build and deploy your app

Finally, you can press the `Create App` button to create the app. This will
create the app and immediately trigger the first build:

![Screenshot of app build logs](./images/build_logs.png)

On the build page you can see live streaming build logs split into multiple
sections:

- **Prepare:** cloning the GitHub repository and restoring build cache
- **Install:** executing the install command, and any framework specific
  pre-install setup
- **Build:** executing the build command, any framework specific pre- and
  post-build setup, and preparing the build artifact for deployment
- **Warm up:** sending a request to the preview URL of the deployment to ensure
  it starts up correctly. The logs shown in the Warm up section are Runtime
  logs, not build logs.
- **Route:** Deno Deploy is rolling out the new version of this build into all
  global regions.

In the top left of this build is a button to cancel the build. For failed
builds, there is also a button to restart the build.

For completed builds, the top right shows the preview URL of the build. Further
down all timelines that this build is deployed to are shown, such as
`Production`, or `Git Branch` timelines.

You can also see how the build was triggered on this page. This can either be
`manual action`, for builds triggered through the UI, or `GitHub repo` for
builds triggered through the GitHub integration.

You can view the application through either the preview URL, or any of the other
URLs shown in the timelines list.

## Monitor your application

After visiting your application, you can view telemetry about your application
in the form of the logs and traces available in our observability panels:

- observability
- settings
