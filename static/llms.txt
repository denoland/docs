# Deno

> Deno is a secure JavaScript/TypeScript runtime built on V8 and Rust,
> distributed as a single binary. TypeScript, formatting, linting, testing, and
> a standard library work with zero configuration. Programs are sandboxed by
> default; capabilities (network, filesystem, etc.) are granted explicitly via
> --allow-* flags. Deno natively supports npm packages and Node.js built-in
> modules.

- [llms-full-guide.txt](https://docs.deno.com/llms-full-guide.txt): Complete agent-oriented guide with CLI reference, code examples, and usage patterns (publish alongside this file)
- [llms-summary.txt](https://docs.deno.com/llms-summary.txt): Compact index of all documentation sections
- [llms-full.txt](https://docs.deno.com/llms-full.txt): Full documentation content dump (large)

## Runtime

- [Getting Started](https://docs.deno.com/runtime/getting_started/first_project): Scaffold a project, run code, and execute tests
- [CLI Reference](https://docs.deno.com/runtime/reference/cli/): All deno subcommands and flags (run, test, fmt, lint, task, compile, install)
- [Configuration (deno.json)](https://docs.deno.com/runtime/fundamentals/configuration): Project config, tasks, import maps, TypeScript settings
- [Modules and Imports](https://docs.deno.com/runtime/fundamentals/modules): jsr:, npm:, and node: specifiers; import maps; dependency management
- [Security and Permissions](https://docs.deno.com/runtime/fundamentals/security): Sandbox model and --allow-* permission flags
- [Node.js Compatibility](https://docs.deno.com/runtime/fundamentals/node): Running Node projects, npm packages, and node: built-ins in Deno
- [Testing](https://docs.deno.com/runtime/fundamentals/testing): Built-in test runner, assertions, mocking, coverage
- [TypeScript Support](https://docs.deno.com/runtime/fundamentals/typescript): TypeScript configuration and type checking
- [HTTP Server](https://docs.deno.com/runtime/fundamentals/http_server): Deno.serve API, request handling, WebSockets
- [Standard Library (@std)](https://docs.deno.com/runtime/reference/std/): Deno's standard library modules on JSR
- [Linting and Formatting](https://docs.deno.com/runtime/fundamentals/linting_and_formatting): deno lint and deno fmt configuration and usage
- [Workspaces](https://docs.deno.com/runtime/fundamentals/workspaces): Monorepo and multi-package project configuration
- [Web Development](https://docs.deno.com/runtime/fundamentals/web_dev): Frameworks (Fresh, Next.js, Astro, SvelteKit) with Deno

## Deploy

- [Deno Deploy Overview](https://docs.deno.com/deploy/): Managed edge platform for JavaScript/TypeScript apps
- [Getting Started](https://docs.deno.com/deploy/getting_started): Create and configure your first Deploy application
- [Deno KV](https://docs.deno.com/deploy/kv/): Built-in key-value database available in CLI and on Deploy

## Sandbox

- [Deno Sandbox Overview](https://docs.deno.com/sandbox/): Ephemeral Linux microVMs for running untrusted code safely
- [Getting Started](https://docs.deno.com/sandbox/getting_started/): Enable sandboxes, create a microVM, run commands, manage secrets
- [Create a Sandbox](https://docs.deno.com/sandbox/create/): Sandbox.create() API reference and configuration options
- [Sandbox Timeouts](https://docs.deno.com/sandbox/timeouts/): Ephemeral vs. persistent sandbox lifecycle management
- [Deploy App Management](https://docs.deno.com/sandbox/apps/): Programmatically create and manage Deploy apps via the SDK

## Examples

- [Build a Fresh App](https://docs.deno.com/examples/fresh_tutorial/): Full-stack app with Fresh framework and islands architecture
- [Deploy with deno deploy CLI](https://docs.deno.com/examples/deploy_command_tutorial/): Deploy a local project to Deno Deploy
- [Chat App with WebSockets](https://docs.deno.com/examples/chat_app_tutorial/): Real-time WebSocket server with Oak
- [LLM Chat App](https://docs.deno.com/examples/llm_tutorial/): Integrate OpenAI/Anthropic APIs with Deno
- [Connecting to Databases](https://docs.deno.com/examples/connecting_to_databases_tutorial/): MySQL, PostgreSQL, MongoDB, SQLite, and ORMs
- [Sandbox Volumes](https://docs.deno.com/examples/volumes_tutorial/): Persistent storage for sandbox microVMs
- [Sandbox Snapshots](https://docs.deno.com/examples/snapshots_tutorial/): Reproducible sandbox environments with snapshots

## Optional

- [Contributing](https://docs.deno.com/runtime/contributing/): How to contribute to the Deno project
- [Style Guide](https://docs.deno.com/runtime/contributing/style_guide): Coding conventions for Deno internals
- [Subhosting](https://docs.deno.com/subhosting/): Platform for SaaS providers to run customer code securely
- [AI Skills for Coding Assistants](https://github.com/denoland/skills): Deno-specific skills and playbooks for LLMs
