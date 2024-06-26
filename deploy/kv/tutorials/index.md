---
title: "Deno KV Tutorials & Examples"
oldUrl:
  - /kv/tutorials/
---

Check out these examples showing real-world usage of Deno KV.

## Use queues to process incoming webhooks

Follow [this tutorial](./webhook_processor.md) to learn how to use queues to
offload tasks to a background process, so your web app can remain responsive.
This example shows how to enqueue tasks that handle incoming webhook requests
from [GitHub](https://www.github.com).

## Use queues to schedule a future notification

Follow [this tutorial](./schedule_notification.md) to learn how to schedule code
to execute at some time in the future using queues. This example shows how to
schedule a notification with [Courier](https://www.courier.com/).

## CRUD in Deno KV - TODO List

- Zod schema validation
- Built using Fresh
- Real-time collaboration using BroadcastChannel
- [Source code](https://github.com/denoland/showcase_todo)
- [Live preview](https://showcase-todo.deno.dev/)

## Deno SaaSKit

- Modern SaaS template built on Fresh.
- [Product Hunt](https://www.producthunt.com/)-like template entirely built on
  KV.
- Uses Deno KV OAuth for GitHub OAuth 2.0 authentication
- Use to launch your next app project faster
- [Source code](https://github.com/denoland/saaskit)
- [Live preview](https://hunt.deno.land/)

## Multi-player Tic-Tac-Toe

- GitHub authentication
- Saved user state
- Real-time sync using BroadcastChannel
- [Source code](https://github.com/denoland/tic-tac-toe)
- [Live preview](https://tic-tac-toe-game.deno.dev/)

## Multi-user pixel art drawing

- Persistent canvas state
- Multi-user collaboration
- Real-time sync using BroadcastChannel
- [Source code](https://github.com/denoland/pixelpage)
- [Live preview](https://pixelpage.deno.dev/)

## GitHub authentication and KV

- Stores drawings in KV
- GitHub authentication
- [Source code](https://github.com/hashrock/kv-sketchbook)
- [Live preview](https://hashrock-kv-sketchbook.deno.dev/)

## Deno KV oAuth 2

- High-level OAuth 2.0 powered by Deno KV
- [Source code](https://github.com/denoland/deno_kv_oauth)
- [Live preview](https://kv-oauth.deno.dev/)
