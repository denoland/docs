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
    <div class="flex flex-col px-8 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-24">
      <div class="flex flex-col gap-4 md:gap-8 pb-16 align-middle md:pb-0">
        {/* Hero section */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <h1 class="text-3xl md:text-5xl mb-2 md:mb-6 font-bold">
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

        {/* Runtime content */}
        <div class="flex flex-col py-4">
          {/* Section Header */}
          <div>
            <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-6">
              Deno Runtime
            </h2>
            <p class="max-w-[550px] mb-4">
              Deno (/ˈdiːnoʊ/, pronounced dee-no) is an open source JavaScript,
              TypeScript, and WebAssembly runtime with secure defaults and a
              great developer experience. It's built on V8, Rust, and Tokio.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <div>
              <h3 class="text-lg font-semibold mb-1">Deno basics</h3>
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
              <h3 class="text-lg font-semibold mb-1">Configuration</h3>
              <p class="text-justify">
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
              <h3 class="text-lg font-semibold mb-1">Testing in Deno</h3>
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
        </div>

        {/* Deploy content */}
        <div class="w-full md:w-auto flex flex-col sm:pl-6 py-4 sm:border-l sm:border-solid border-y-0 border-r-0 border-gray-400 dark:border-deploy">
          <h2 class="text-3xl font-semibold mb-4">Deno Deploy</h2>
          <p class="min-h-20 mb-4">
            Serverless platform for deploying JavaScript code to a fast, global
            edge network. Supports Deno APIs and Node.js / npm modules
          </p>
          <a
            class="border-solid border-deploy font-bold inline-block py-5 px-4 rounded-md w-max text-black bg-deploy hover:text-inherit dark:hover:text-deploy dark:hover:bg-deploy-dark hover:no-underline"
            href="/deploy/manual"
          >
            Deploy docs <span aria-hidden="true">-&gt;</span>
          </a>
          <h3 class="text-xl font-semibold mt-16">Deno Deploy APIs:</h3>
          <div class="grid grid-cols-1 gap-8 md:gap- mt-4">
            <div>
              <h4 class="text-lg font-semibold mb-1">KV</h4>
              <p>
                Key/value database built in to the Deno runtime. Simple API,
                works with zero configuration on Deno Deploy.{" "}
                <a
                  class="text-primary font-bold inline-block underline dark:deploy"
                  href="/deploy/kv/manual"
                >
                  KV docs <span aria-hidden="true">-&gt;</span>
                </a>
              </p>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-1">Cron</h4>
              <p>
                Execute code on a configurable schedule at the edge in any time
                zone.{" "}
                <a
                  class="text-primary font-bold inline-block underline dark:text-deploy"
                  href="/deploy/kv/manual/cron"
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
                  class="text-primary font-bold inline-block underline dark:color-deploy"
                  href="/deploy/kv/manual/queue_overview"
                >
                  Queues docs <span aria-hidden="true">-&gt;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
