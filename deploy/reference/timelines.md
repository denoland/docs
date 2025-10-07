---
title: Timelines
description: "Understanding deployment timelines in Deno Deploy, including production and development contexts, active revisions, rollbacks, and timeline locking."
---

A timeline is a representation of the history of one branch of the application.
Each timeline has a set of revisions, which are the individual items in the
timeline. One of the revisions (usually the most recent one) is the "active"
revision, which is the one that is currently serving traffic. The active
revision receives traffic on all URLs that are assigned to the timeline.

Each timeline is associated with a
[context](/deploy/reference/env_vars_and_contexts/), which determines which
environment variables are available to the code running in that timeline.

By default, there are multiple timelines set up for each application:

- **Production**: The production timeline contains all of the revisions from the
  default git branch. This is the timeline that serves production traffic. This
  timeline is associated with `https://<app-name>.<org-name>.deno.net`, and any
  custom domains that are mapped to the application. It uses the production
  context.

- **Git Branch / `<branch-name>`**: Each git branch has its own timeline. This
  timeline contains all of the revisions from that git branch. This timeline is
  associated with `https://<app-name>--<branch-name>.<org-name>.deno.net`. It
  uses the development context.

> There is also one timeline for each revision, that contains only that
> revision. This is the timeline that backs the preview URL for that revision.
> This timeline is associated with
> `https://<app-name>-<revision-id>.<org-name>.deno.net`. It uses the
> development context.
>
> Preview timelines are not visible in timeline pages in the UI. You can view
> the preview URL for a revision on that revision's build page.

You can view the timelines that each revision is associated with on the
revision's build page. You can also view the revisions that are associated with
a given timeline from the timeline pages.

## Active revision

Each timeline has an active revision. The active revision is the revision that
is currently serving traffic for that timeline. You can view the active revision
for a timeline on the timeline page.

Usually, the active revision is the most recently built revision on the
timeline. However, a different revision can be manually locked to be the active
revision. This enables rollback, and timeline locking:

### Rollback

Rollback is the process of reverting the active revision to a previous revision,
usually because the newer revision has some sort of bug or issue. By rolling
back to a known good revision, you can restore the application to a working
state without having to deploy new code via Git, and waiting for a build to
complete.

Refer to "changing the active revision" below for more information on how to
rollback a timeline.

### Timeline locking

Timeline locking is the process of locking a timeline to a specific revision, to
ensure that new builds do not automatically become the active revision. This is
useful if you are in a feature freeze situation, for example during a big event,
and want to de-risk by not allowing new builds to be deployed. When a timeline
is locked to a specific revision you can still create new builds by pushing to
Git, but they will not automatically become the active revision on the locked
timeline.

Refer to "changing the active revision" below for more information on how to
lock a timeline to a specific revision.

### Changing the active revision

On the timelines page, you can lock any revision on that timeline to be the
active revision. This will lock the timeline to that revision, and new builds
will not automatically become the active revision on this timeline anymore. You
can then either unlock the revision from the timeline, reverting back to the
default behavior of the latest revision being the active revision, or you can
lock a different revision to be the active revision.
