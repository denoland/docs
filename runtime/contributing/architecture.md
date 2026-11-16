---
last_modified: 2026-11-16
title: "Architecture Overview"
description: "Deep dive into Deno's internal architecture, explaining core components like the runtime, compiler, and security sandbox. Learn how Deno processes requests and executes JavaScript/TypeScript code."
oldUrl: /runtime/manual/references/contributing/architecture/
---

## Deno and Linux analogy

|                       **Linux** | **Deno**                           |
| ------------------------------: | :--------------------------------- |
|                       Processes | Web Workers                        |
|                        Syscalls | Ops                                |
|           File descriptors (fd) | [Resource ids (rid)](#resources)   |
|                       Scheduler | Tokio                              |
| Userland: libc++ / glib / boost | https://jsr.io/@std                |
|                       man pages | deno types / https://docs.deno.com |

### Resources

Resources (AKA `rid`) are Deno's version of file descriptors. They are integer
values used internally to refer to open files, sockets, and other concepts.
Since Deno 2, they are no longer exposed through public APIs: close a resource
with the `.close()` method on the object that owns it, such as a
[`Deno.FsFile`](/api/deno/~/Deno.FsFile). To check that tests don't leave
resources open, use the
[resource sanitizer](/runtime/test/sanitizers/#resource-sanitizer) of
`deno test`.

## Conference

- Ryan Dahl. (May 27, 2020).
  [An interesting case with Deno](https://www.youtube.com/watch?v=1b7FoBwxc7E).
  Deno Israel.
- Bartek Iwańczuk. (Oct 6, 2020).
  [Deno internals - how modern JS/TS runtime is
  built](https://www.youtube.com/watch?v=AOvg_GbnsbA&t=35m13s). Paris Deno.
