import { walkSync } from "@std/fs/walk";

export const layout = "raw.tsx";
export const url = "/";
export const title =
  "Deno: the easiest, most secure JavaScript runtime | Deno Docs";

export default function () {
  return (
    <div class="flex flex-col px-8 pt-6 mt-4 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-[1200px] mx-auto mb-24">
      <div class="pb-16 align-middle md:pb-0">
        <div class="mb-16 md:mb-24 text-center">
          <img
            class="h-64 rounded-[100%] aspect-[7/5] bg-black w-auto mx-auto"
            alt="Deno logo"
            src="/deno-looking-up.svg"
          />
          <h1 class="text-4xl md:text-6xl mb-0 font-semibold">Deno Docs</h1>
        </div>
        <div class="flex flex-col items-stretch gap-8 md:gap-4 lg:gap-8 md:grid md:grid-cols-2">
          <div class="w-full md:w-auto flex flex-col sm:pl-6 py-4 sm:border-l sm:border-solid border-y-0 border-r-0 border-gray-400 dark:border-runtime">
            <h2 class="text-3xl font-semibold mb-4">Deno Runtime</h2>
            <p class="min-h-20 mb-4">
              Deno, the open-source runtime for TypeScript and JavaScript.
              Features built-in dev tools, powerful platform APIs, and native
              support for TypeScript and JSX.
            </p>
            <a
              class="border-solid border-runtime font-bold inline-block py-5 px-4 rounded-md w-max text-black bg-runtime hover:text-inherit dark:hover:text-runtime dark:hover:bg-runtime-dark hover:no-underline"
              href="/runtime/manual"
            >
              Deno docs <span aria-hidden="true">-&gt;</span>
            </a>
            <h3 class="text-xl font-semibold mt-16">More about Deno:</h3>
            <div class="grid grid-cols-1 gap-8 md:gap- mt-4">
              <div>
                <h4 class="text-lg font-semibold mb-1">Deno basics</h4>
                <p>
                  New to Deno? This is the place to start.{" "}
                  <a
                    class="text-primary font-bold inline-block underline"
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
                    class="text-primary font-bold inline-block underline"
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
                    class="text-primary font-bold inline-block underline"
                    href="/runtime/manual/basics/testing/"
                  >
                    More about Testing <span aria-hidden="true">-&gt;</span>
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div class="w-full md:w-auto flex flex-col sm:pl-6 py-4 sm:border-l sm:border-solid border-y-0 border-r-0 border-gray-400 dark:border-deploy">
            <h2 class="text-3xl font-semibold mb-4">Deno Deploy</h2>
            <p class="min-h-20 mb-4">
              Serverless platform for deploying JavaScript code to a fast,
              global edge network. Supports Deno APIs and Node.js / npm modules
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
                  Execute code on a configurable schedule at the edge in any
                  time zone.{" "}
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
    </div>
  );
}
