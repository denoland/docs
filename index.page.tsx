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
            <p class="text-md max-w-[600px] md:text-lg">
              Deno, the open-source runtime for TypeScript and JavaScript.
              Features built-in dev tools, powerful platform APIs, and native
              support for TypeScript and JSX.
            </p>
            {/* CTA Group */}

            <div class="flex flex-row gap-4 mt-8">
              <DocsCTA
                text="Get Started"
                href="/runtime/manual"
                product="runtime"
              />
              <DocsCTA
                text="Try Deno Deploy"
                href="/deploy/manual"
                product="deploy"
              />
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
              <p class="max-w-[75ch]">
                Deno (/ˈdiːnoʊ/, pronounced dee-no) is an open source
                JavaScript, TypeScript, and WebAssembly runtime with secure
                defaults and a great developer experience. It's built on V8,
                Rust, and Tokio.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
              <ContentItem
                title="Deno basics"
                description="New to Deno? This is the place to start."
                linktext="Get started"
                link="/runtime/manual/getting_started/first_steps"
                product="runtime"
              />

              <ContentItem
                title="Configuration"
                description="Customizations for Deno’s built-in TypeScript compiler, formatter, and linter."
                linktext="Deno config"
                link="/runtime/manual/getting_started/configuration_file"
                product="runtime"
              />

              <ContentItem
                title="Testing in Deno"
                description="All about Deno’s built-in test runner for JavaScript or TypeScript code."
                linktext="More about Testing"
                link="/runtime/manual/basics/testing/"
                product="runtime"
              />
            </div>
            {/* Examples Section */}
            <div class="flex flex-col">
              <div class="mb-8">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-4">
                  Examples
                </h3>
                <p class="max-w-[75ch]">
                  A collection of annotated Deno examples, to be used as a
                  reference for how to build with Deno, or as a guide to learn
                  about many of Deno's features. Find more examples in the{" "}
                  <a
                    href="/examples/"
                    class="runtime-link underline underline-offset-4"
                  >
                    Examples
                  </a>{" "}
                  section.
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                <LinkList
                  title="Basics"
                  product="runtime"
                  links={[
                    {
                      text: "Importing modules from npm",
                      href: "/examples/npm",
                    },
                    {
                      text: "Hello World",
                      href: "/examples/hello-world",
                    },
                    {
                      text: "Using Node.js built-in modules",
                      href: "/examples/node",
                    },
                    {
                      text: "Manipulating & Parsing URLs",
                      href: "/examples/url-parsing",
                    },
                  ]}
                />
                <LinkList
                  title="Network"
                  product="runtime"
                  links={[
                    {
                      text: "HTTP Server: Hello World",
                      href: "/examples/http-server",
                    },
                    {
                      text: "HTTP Server: WebSockets",
                      href: "/examples/http-server-websocket",
                    },
                    {
                      text: "HTTP Server: Streaming",
                      href: "/examples/http-server-streaming",
                    },
                    {
                      text: "TCP Connector: Ping",
                      href: "/examples/tcp-connector",
                    },
                  ]}
                />
                <LinkList
                  title="System and CLI"
                  product="runtime"
                  links={[
                    {
                      text: "Command Line Arguments",
                      href: "/examples/command-line-arguments",
                    },
                    {
                      text: "Environment Variables",
                      href: "/examples/environment-variables",
                    },
                    {
                      text: "Reading Files",
                      href: "/examples/reading-files",
                    },
                    {
                      text: "Walking directories",
                      href: "/examples/walking-directories",
                    },
                  ]}
                />
                <LinkList
                  title="Deno Cloud Primitives"
                  product="runtime"
                  links={[
                    {
                      text: "KV",
                      href: "/examples/kv",
                    },
                    {
                      text: "Queues",
                      href: "/examples/queues",
                    },
                    {
                      text: "Cron",
                      href: "/examples/cron",
                    },
                    {
                      text: "KV Watch",
                      href: "/examples/kv-watch",
                    },
                  ]}
                />
              </div>
            </div>

            {/* Reference Section */}
            <div class="flex flex-col">
              <div class="mb-8">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-4">
                  API Reference
                </h3>
                <p class="max-w-[75ch]">
                  Deno, Web, and Node API reference documentation, built for the
                  Deno experience. Explore the APIs available in Deno in the{" "}
                  <a
                    href="/api/deno"
                    class="runtime-link underline underline-offset-4"
                  >
                    Reference
                  </a>{" "}
                  section.
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                <LinkList
                  title="Deno APIs"
                  product="runtime"
                  links={[
                    {
                      text: "Cloud",
                      href: "/api/deno/cloud",
                    },
                    {
                      text: "FFI",
                      href: "/api/deno/ffi",
                    },
                    {
                      text: "Network",
                      href: "/api/deno/network",
                    },
                    {
                      text: "Permissions",
                      href: "/api/deno/permissions",
                    },
                    {
                      text: "Websocket",
                      href: "/api/deno/websocket",
                    },
                    {
                      text: "View all Deno APIs",
                      href: "/api/deno",
                    },
                  ]}
                />
                <LinkList
                  title="Web APIs"
                  product="runtime"
                  links={[
                    {
                      text: "Cache",
                      href: "/api/web/cache",
                    },
                    {
                      text: "Cookies",
                      href: "/api/web/cookies",
                    },
                    {
                      text: "Fetch",
                      href: "/api/web/fetch",
                    },
                    {
                      text: "Streams",
                      href: "/api/web/streams",
                    },
                    {
                      text: "URL",
                      href: "/api/web/url",
                    },
                    {
                      text: "View all Web APIs",
                      href: "/api/web",
                    },
                  ]}
                />
                <LinkList
                  title="Node APIs"
                  product="runtime"
                  links={[
                    {
                      text: "assert",
                      href: "/api/node/assert",
                    },
                    {
                      text: "buffer",
                      href: "/api/node/buffer",
                    },
                    {
                      text: "fs",
                      href: "/api/node/fs",
                    },
                    {
                      text: "path",
                      href: "/api/node/path",
                    },
                    {
                      text: "process",
                      href: "/api/node/process",
                    },
                    {
                      text: "View all Node APIs",
                      href: "/api/node",
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Deploy content */}
          <div class="flex flex-col gap-8">
            {/* Scection Header */}
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-8">
                Deno Deploy
              </h2>
              <p class="max-w-[75ch]">
                Serverless platform for deploying JavaScript code to a fast,
                global edge network. Supports Deno APIs and Node.js / npm
                modules
              </p>
            </div>
            {/* Deploy features */}
            <div class="grid grid-cols-1 mb-4 md:grid-cols-3 gap-8 md:gap-24">
              <ContentItem
                title="KV"
                description="Key/value database built in to the Deno runtime. Simple API, works with zero configuration on Deno Deploy."
                linktext="KV docs"
                link="/deploy/kv/manual/"
                product="deploy"
              />

              <ContentItem
                title="Cron"
                description="Execute code on a configurable schedule at the edge in any time zone."
                linktext="Cron docs"
                link="/deploy/kv/manual/cron"
                product="deploy"
              />

              <ContentItem
                title="Queues"
                description="Deno’s queueing API for offloading larger workloads or scheduling tasks with guaranteed delivery."
                linktext="Queues docs"
                link="/deploy/kv/manual/queue_overview/"
                product="deploy"
              />
            </div>

            {/* Subhosting content */}
            <div class="flex flex-col">
              <div class="mb-8">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-4">
                  Subhosting
                </h3>
                <p class="max-w-[66ch]">
                  Deno Subhosting is a robust platform designed to allow
                  Software as a Service (SaaS) providers to securely run code
                  written by their customers.
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
                <ContentItem
                  title="Quick Start"
                  description="Configure your subhosting account and you'll be hosting customer code in minutes."
                  linktext="Quick start"
                  link="/runtime/manual/getting_started/first_steps"
                  product="deploy"
                />

                <ContentItem
                  title="Subhosting architecture"
                  description="Learn how subhosting works with our platform architecture guides."
                  linktext="Learn about subhosting"
                  link="/runtime/manual/getting_started/configuration_file"
                  product="deploy"
                />

                <ContentItem
                  title="REST API"
                  description="Quickly provision new projects and make deployments through our REST API."
                  linktext="REST API"
                  link="/runtime/manual/basics/testing/"
                  product="deploy"
                />
              </div>
            </div>
          </div>

          {/* Help content */}

          <div class="flex flex-col gap-8">
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-purple-600 mb-8">
                Help
              </h2>
              <p class="max-w-[75ch]">
                Get help from the Deno team or connect with our community.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
              <ContentItem
                title="Connect with our community"
                description="Get help from the Deno community"
                linktext="Learn more"
                link="/runtime/manual/help/"
                product="help"
              />
              <ContentItem
                title="Enterprise support"
                description="Explore Deno's enterprise support options"
                linktext="Learn more"
                link="https://deno.com/enterprise"
                product="help"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocsCTA(props: {
  text: string;
  href: string;
  product: "deploy" | "runtime";
}) {
  const productClass =
    props.product === "deploy" ? "deploy-cta" : "runtime-cta";
  return (
    <a href={props.href} className={`docs-cta ${productClass}`}>
      {props.text}{" "}
      <span aria-hidden="true" class="whitespace-pre">
        -&gt;
      </span>
    </a>
  );
}

function ContentItem(props: {
  title: string;
  description: string;
  linktext: string;
  link: string;
  product: string;
}) {
  const productClass =
    props.product === "deploy"
      ? "deploy-link"
      : props.product === "runtime"
      ? "runtime-link"
      : "help-link"; // Default to "help-link" if product is "help"

  return (
    <div>
      <h4 className="text-lg font-semibold mb-1">{props.title}</h4>
      <p className="mb-3">{props.description} </p>
      <a className={`homepage-link ${productClass}`} href={props.link}>
        {props.linktext}{" "}
        <span aria-hidden="true" class="whitespace-pre">
          -&gt;
        </span>
      </a>
    </div>
  );
}

function LinkList(props: {
  title: string;
  product: string;
  links: { text: string; href: string }[];
}) {
  const productClass =
    props.product === "deploy"
      ? "deploy-link"
      : props.product === "runtime"
      ? "runtime-link"
      : "help-link";
  return (
    <div>
      <h4 className="text-lg font-semibold mb-1">{props.title}</h4>
      {props.links.map((link, index) => (
        <a
          key={index}
          className={`homepage-link mb-1 ${productClass}`}
          href={link.href}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}
