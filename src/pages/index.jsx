import React from "react";
import Layout from "@theme/Layout";

function Card({ title, href, children }) {
  return (
    <div className="border-1 border-solid rounded-xl p-4 w-full md:w-auto flex flex-col">
      <h3 className="border-b border-t-0 border-l-0 border-r-0 border-solid pb-2">
        {title}
      </h3>
      <p className="grow">{children}</p>
      <a
        className="font-bold inline-block hover:opacity-80"
        href={href}
      >
        {title} Docs &gt;
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
      <div className="flex flex-col px-8 pt-6 md:mt-12 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-[1200px] mx-auto">
        <div className="pb-16 align-middle md:pb-0">
          <div className="mb-8 text-center">
            <img
              className="w-64 h-64 mb-[-40px] md:mt-[-40px]"
              alt="Deno logo"
              src="/deno-looking-up.svg"
            />
            <h1 className="text-4xl md:text-5xl">Deno Docs</h1>
          </div>
          <div className="flex flex-col items-start gap-8 md:grid md:grid-cols-3 md:grid-flow-col md:items-stretch">
            <Card title="Deno Runtime" href="/runtime/manual">
              Language runtime for TypeScript and JavaScript with a browser-like
              programming environment. Features built-in dev tools, powerful
              platform APIs, and native support for TypeScript and JSX.
            </Card>
            <Card title="Deno Deploy" href="/deploy/manual">
              Serverless JavaScript platform. Supports Deno platform APIs and
              Node.js / npm modules. Runs on a fast global edge network.
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
