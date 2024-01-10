import React from "react";
import Layout from "@theme/Layout";

function Card({ title, href, children, brand }) {
  const getBrandBackground = () => {
    if (brand === "runtime") {
      return "bg-[var(--runtime)]";
    } else if (brand === "deploy") {
      return "bg-[var(--deploy)]";
    }
    return "bg-green-400";
  };

  return (
    <div className="w-full md:w-auto flex flex-col sm:pl-6 py-4 sm:border-l sm:border-solid border-y-0 border-r-0 border-gray-400 dark:border-gray-700">
      <h2>
        {title}
      </h2>
      <p className="grow">{children}</p>
      <a
        className={`font-bold inline-block p-3 px-4 rounded-md w-max text-black ${getBrandBackground()}`}
        href={href}
      >
        {title} Docs <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <Layout
      title={"Deno: the easiest, most secure JavaScript runtime"}
      description="Reference documentation for the Deno runtime and Deno Deploy"
    >
      <div className="flex flex-col px-8 pt-6 mt-20 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-[1200px] mx-auto">
        <div className="pb-16 align-middle md:pb-0">
          <div className="mb-16 md:mb-24 text-center">
            <img
              className="w-64 h-64 mb-[-40px] md:mt-[-40px]"
              alt="Deno logo"
              src="/deno-looking-up.svg"
            />
            <h1 className="text-4xl md:text-6xl mb-0">Deno Docs</h1>
          </div>
          <div className="flex flex-col items-start gap-8 md:gap-4 lg:gap-8 md:grid md:grid-cols-3 md:grid-flow-col md:items-stretch">
            <Card title="Deno Runtime" href="/runtime/manual" brand="runtime">
              Deno, the open-source runtime for TypeScript and JavaScript.
              Features built-in dev tools, powerful platform APIs, and native
              support for TypeScript and JSX.
            </Card>
            <Card title="Deno Deploy" href="/deploy/manual" brand="deploy">
              Serverless platform for deploying JavaScript code to a fast,
              global edge network. Supports Deno APIs and Node.js / npm modules
            </Card>
            <Card title="Deno KV" href="/kv/manual">
              Key/value database built in to the Deno runtime. Simple API, works
              with zero configuration on Deno Deploy.
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
