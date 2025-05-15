---
title: Reference Guide
description: "Comprehensive reference guide for Deno Deploy Early Access covering accounts, organizations, applications, builds, observability, environments, and custom domains."
---

## Account

The Deno Deploy EA account is the same as your Deno Deploy Classic account. At
this time you can only sign in through GitHub. Your primary contact email
address is copied from GitHub. Your name is also synced from GitHub.

Both username and email are synced from GitHub every time you log in. If you
have changed your name in GitHub, and do not see the change reflected on the
Deno Deploy dashboard, please sign-in again.

## Organizations

Organizations are groups of users that collectively own apps and domains. Upon
signing up to Deno Deploy EA, each user can either create an organization or be
invited to an existing organization by another Deno Deploy EA user.

Organizations have a name and a slug. The name is visible only to organization
members and appears in the organization dropdown in both Deno Deploy EA and Deno
Deploy Classic. The organization slug is used for the default domain of the
organization.

:::caution

Organizations cannot currently be renamed, nor can their slug be altered after
creation.

:::

Every organization has a default domain that is used for production, git branch,
and preview URLs for projects in that organization. For example, an org with the
slug `acme-inc` would have a default organization domain of `acme-inc.deno.net`.

At this time, organizations cannot be deleted.

### Members

- inviting members
- removing members

## Applications

Applications are web services inside an organization that can serve traffic.
Applications contain revisions - these are all the previous builds that have
happened in the context of this app. Usually there is one revision per Git
commit when using the GitHub integration.

To create an app, press the “+ Create App” button on the org page

- creating
- github integration
- limitations:
  - deleting
  - renaming
  - transferring

## Builds

- configuration
- default env vars
- native framework support

## Observability

- logs
- traces
- filtering
- time picker
- limitations:
  - metrics

## Contexts and Environment Variables

## Timelines

## Runtime

- deno version
- unsupported apis
- linux runtime environment
- default env vars

## Caching

- passthrough cache behaviour
- cache-tag

## Custom domains

- adding to org
- assigning to app
- dns setup + verification
- certificates
- unassigning from app
- removing from org
