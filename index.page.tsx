export const layout = "raw.tsx";
export const url = "/";
export const title =
  "Deno: the easiest, most secure JavaScript runtime | Deno Docs";

export const sidebar = [
  {
    items: [
      {
        label: "Runtime Manual",
        id: "/runtime/manual/",
      },
      {
        label: "Examples",
        id: "/examples/",
      },
      {
        label: "Reference",
        id: "/api/deno",
      },
      {
        label: "Deploy",
        id: "/deploy/manual/",
      },
      {
        label: "Subhosting",
        id: "/subhosting/manual/",
      },
      {
        label: "deno.com",
        id: "https://deno.com",
      },
    ],
  },
];

export default function () {
  return (
    <div class="flex flex-col px-8 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-48">
      <div class="flex flex-col gap-4 md:gap-8 pb-16 align-middle md:pb-0">
        {/* Hero section */}
        <div class="grid grid-cols-1 md:grid-cols-3 mb-6 gap-4">
          <div class="md:col-span-2">
            <h1 class="text-4xl md:text-5xl mb-2 md:mb-6 font-bold">
              Deno Docs
            </h1>
            <p class="text-md max-w-[550px] md:text-lg">
              Deno, the open-source runtime for TypeScript and JavaScript.
              Features built-in dev tools, powerful platform APIs, and native
              support for TypeScript and JSX.
            </p>
            {/* CTA Group */}
            <div class="flex flex-row gap-4 mt-8">
              <a
                class="docs-cta runtime-cta"
                href="/runtime/manual"
              >
                Runtime Manual <span aria-hidden="true">-&gt;</span>
              </a>
              <a
                class="docs-cta runtime-cta "
                href="/runtime/manual"
              >
                API Reference <span aria-hidden="true">-&gt;</span>
              </a>
              <a
                class="docs-cta deploy-cta"
                href="/deploy/manual"
              >
                Deploy Manual <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          </div>
          <div class="hidden md:block md:col-span-1">
            <img
              class="w-full h-full"
              src="/deno-looking-up.svg"
              alt="Deno logo"
            />
          </div>
        </div>

        {/* Main content  */}
        <div class="flex flex-col gap-8 md:gap-16">
          {/* Runtime content */}
          <div class="flex flex-col gap-8">
            {/* Section Header */}
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-6">
                Deno Runtime
              </h2>
              <p class="max-w-[550px]">
                Deno (/ˈdiːnoʊ/, pronounced dee-no) is an open source
                JavaScript, TypeScript, and WebAssembly runtime with secure
                defaults and a great developer experience. It's built on V8,
                Rust, and Tokio.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
              <div>
                <h4 class="text-lg font-semibold mb-1">Deno basics</h4>
                <p>
                  New to Deno? This is the place to start.{" "}
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
              <div>
                <h4 class="text-lg font-semibold mb-1">Configuration</h4>
                <p>
                  Customizations for Deno’s built-in TypeScript compiler,
                  formatter, and linter.{" "}
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
              <div>
                <h4 class="text-lg font-semibold mb-1">Testing in Deno</h4>
                <p>
                  All about Deno’s built-in test runner for JavaScript or
                  TypeScript code.{" "}
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
            </div>
            {/* Examples Section */}
            <div class="flex flex-col">
              <div class="mb-6">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-4">
                  Examples
                </h3>
                <p class="max-w-[550px]">
                  A collection of annotated Deno examples, to be used as a
                  reference for how to build with Deno, or as a guide to learn
                  about many of Deno's features.
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                <div>
                  <h4 class="text-lg font-semibold mb-1">Basics</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">CLI</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Network</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">File System</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                </div>
              </div>
            </div>

            {/* Reference Section */}
            <div class="flex flex-col">
              <div class="mb-6">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-4">
                  API Reference
                </h3>
                <p class="max-w-[550px]">
                  Deno, Web, and Node API reference documentation, built for the
                  Deno experience
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                <div>
                  <h4 class="text-lg font-semibold mb-1">Deno APIs</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    Get started
                  </a>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Web APIs</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Deno config
                  </a>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Node APIs</h4>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                  <a
                    class="text-runtime-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Deploy content */}
          <div class="flex flex-col gap-8">
            {/* Scection Header */}
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-6">
                Deno Deploy
              </h2>
              <p class="max-w-[550px]">
                Serverless platform for deploying JavaScript code to a fast,
                global edge network. Supports Deno APIs and Node.js / npm
                modules
              </p>
            </div>
            {/* Deploy features */}
            <div class="grid grid-cols-1 mb-4 md:grid-cols-3 gap-8 md:gap-24">
              <div>
                <h4 class="text-lg font-semibold mb-1">KV</h4>
                <p>
                  Key/value database built in to the Deno runtime. Simple API,
                  works with zero configuration on Deno Deploy.{" "}
                  <a
                    class="text-deploy-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/first_steps"
                  >
                    KV docs <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
              <div>
                <h4 class="text-lg font-semibold mb-1">Cron</h4>
                <p>
                  Execute code on a configurable schedule at the edge in any
                  time zone.{" "}
                  <a
                    class="text-deploy-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/getting_started/configuration_file"
                  >
                    Cron docs <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
              <div>
                <h4 class="text-lg font-semibold mb-1">Queues</h4>
                <p>
                  Deno’s queueing API for offloading larger workloads or
                  scheduling tasks with guaranteed delivery.{" "}
                  <a
                    class="text-deploy-600 font-bold block mt-1 underline underline-offset-2"
                    href="/runtime/manual/basics/testing/"
                  >
                    Queues docs <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
            </div>

            {/* Subhosting content */}
            <div class="flex flex-col">
              <div class="mb-6">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-4">
                  Subhosting
                </h3>
                <p class="max-w-[66ch]">
                  Deno Subhosting is a robust platform designed to allow
                  Software as a Service (SaaS) providers to securely run code
                  written by their customers. The Subhosting API allows you to
                  deploy untrusted code programmatically and at scale.
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
                <div>
                  <h4 class="text-lg font-semibold mb-1">Quick Start</h4>
                  <p>
                    Configure your subhosting account and you'll be hosting
                    customer code in minutes.{" "}
                    <a
                      class="text-deploy-600 font-bold block mt-1 underline underline-offset-2"
                      href="/runtime/manual/getting_started/first_steps"
                    >
                      Quick start <span aria-hidden="true">-&gt;</span>
                    </a>
                  </p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">
                    Subhosting arcitecture
                  </h4>
                  <p>
                    Learn how subhosting works with our platform arcitecture
                    guides.{" "}
                    <a
                      class="text-deploy-600 font-bold block mt-1 underline underline-offset-2"
                      href="/runtime/manual/getting_started/configuration_file"
                    >
                      Learn about subhosting{" "}
                      <span aria-hidden="true">-&gt;</span>
                    </a>
                  </p>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">REST API</h4>
                  <p>
                    Quickly provision new projects and make deployments through
                    our REST API.{" "}
                    <a
                      class="text-deploy-600 font-bold block mt-1 underline underline-offset-2"
                      href="/runtime/manual/basics/testing/"
                    >
                      REST API <span aria-hidden="true">-&gt;</span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help content */}
          <div>
            <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-6">
              Help
            </h2>
            <p class="max-w-[550px]">
              Get help from the Deno team or connect with our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
