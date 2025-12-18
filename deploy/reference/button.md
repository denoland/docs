---
title: Deploy Button
description: "Help users quickly and easily clone code and deploy it to Deno Deploy with the click of a button"
---

The Deploy Button offers a shortcut for users to create and deploy a new
application on Deno Deploy based on existing code hosted in a Git repository.

It provides a link directly into the Deno Deploy application creation flow, and
populates settings in the creation flow based on provided query parameters or
framework detection.

The specified repository will be cloned to the user's GitHub account and set as
the source for a new project. By default, the new repository will be public, but
can be set to be private if required.

## Example

The deploy button below demonstrates the creation of a new application based on
a simple starter project

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/examples&path=hello-world)

## Create and deploy a new application

Use the code below to give a button which creates and deploys a new application:

**Markdown**

```bash
[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=REPOSITORY_URL)
```

**HTML**

```bash
<a href="https://console.deno.com/new?clone=REPOSITORY_URL"><img src="https://deno.com/button" alt="Deploy on Deno"/></a>
```

**URL**

```bash
https://console.deno.com/new?clone=REPOSITORY_URL
```

### Parameters

The following query parameters can be used to configure a Deploy Button:

- `clone` — (required) The URL of the source repo to clone as a new repo which
  will then be deployed
- `path` — (optional) The path within the source repo to clone from. Providing
  this will create a new repo whose root is this directory from within the
  source repository.
- `app_directory` — (optional) The directory within the new repository to use as
  the application root. This is useful when the repository is structured as a
  monorepo.
- `install` — (optional) the command to execute prior to a build in order to
  install dependencies
- `build` — (optional) the command to execute to build the application
- `predeploy` — (optional) the command to execute after a build but before
  deployment
