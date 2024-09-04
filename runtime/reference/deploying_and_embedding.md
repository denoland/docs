---
title: "Deploying and embedding Deno"
old_url: 
- /runtime/manual/advanced/embedding_deno/
- /runtime/manual/advanced/deploying_deno/
---

Developers often choose not to manage and maintain the hardware to run their Deno scripts themselves, preferring instead to use cloud services which will manage scalability, uptime and maintenance for them.

## Deno Deploy

The easiest and fastest way to deploy your Deno projects to the cloud is with
[Deno Deploy](https://deno.com/deploy). Deploy is a globally distributed platform for serverless JavaScript, TypeScript and WASM applications. It is built on top of the Deno runtime and is designed to be fast, secure and scalable, with each deployment running in its own V8 isolate.

Deploy is the first JavaScript edge runtime that lets you run millions of npm modules in production without the hassle of bundling them first. Say goodbye to webpack config nightmares! It integrates with GitHub and GitHub Actions for effortless deployments and CI/CD workflows.

For more information, check out the [Deploy documentation](/deploy/manual).

## Other Cloud Providers

We also have guides on deploying Deno to other cloud providers:

- [Digital Ocean](/runtime/tutorials/digital_ocean/)
- [AWS Lightsail](/runtime/tutorials/aws_lightsail/)
- [Google Cloud Run](/runtime/tutorials/google_cloud_run/)
- [Cloudflare Workers](/runtime/tutorials/cloudflare_workers/)
- [Kinsta](/runtime/tutorials/kinsta/)

## Embedding Deno

Deno consists of multiple parts, one of which is `deno_core`. This is a Rust crate that can be used to embed a JavaScript runtime into your Rust application. Deno is built on top of `deno_core`.

The Deno crate is hosted on [crates.io](https://crates.io/crates/deno_core).

You can view the API on [docs.rs](https://docs.rs/deno_core).
