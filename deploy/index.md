---
sidebar_position: 1
sidebar_label: Quick Start
displayed_sidebar: deploy
---

# Quick Start

This guide will take you from setting up a Deno Deploy account to deploying your
first project.

## **Step 1:** Sign up for Deno Deploy

If you do not have a Deno Deploy account, [sign up](https://deno.com/deploy)
before continuing.

## **Step 2:** Deploy a project

Upon signing in to your account, you should land on a page that lists your
projects. (You won't have any since it's a new account).

Click on the **+New Project** button

There are three ways to deploy a new project in Deno Deploy:

- [Deploy with Github integration](./guide/ci_github)
- [Deploy with `deployctl`](./guide/deployctl)
- [Deploy with Deno Deploy Playground](./guide/playgrounds)

Select one of these methods, depending on the kind of project you have.

### Our recommendation

We generally recommend deploying with the Github integration because it is the
fastest. If you need to run a CI build process first (for example generating
static assets), we recommend deploying with the Github integration, and
selecting [Github Action](./guide/ci_github#github-action)

## **Step 3:** Adjust project settings if necessary

Once the project has been created, you can adjust a number of project settings
on the **Settings** tab. For more details, follow the links below.

- [Custom domain](./guide/custom-domains)
- [Environment variables](./guide/environment-variables)

## **Step 4:** Find project URL

The production URL is the URL that your production deployment can be reached at.

The project name will determine a project's production URL.

It has the form `$PROJECT_ID.deno.dev` (e.g. https://dead-clam-55.deno.dev).

