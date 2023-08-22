import React from "react";
import Layout from "@theme/Layout";

export default function Home() {
  const ctaLinks =
    `border-2 border-solid rounded-xl px-4 py-2 hover:no-underline font-bold inline-block hover:opacity-80`;
  return (
    <Layout
      title={`Deno: the easiest, most secure JavaScript runtime`}
      description="Reference documentation for the Deno runtime and Deno Deploy"
    >
      <div className="container flex flex-col-reverse md:items-center md:justify-center md:flex-row gap-0 md:gap-4">
        <div className="pb-8 md:pb-0">
          <h1>Deno Documentation</h1>
          <p className="my-4">
            Reference docs for the Deno JavaScript runtime and Deno Deploy.
          </p>
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <a
              className={ctaLinks}
              href="/runtime"
            >
              Build with Deno
            </a>
            <a
              className={ctaLinks}
              href="/deploy"
            >
              Deploy to the edge
            </a>
          </div>
        </div>
        <div className="text-center">
          <img
            className="w-48 h-48 md:h-96 md:w-96 lg:h-[520px] lg:w-[520px]"
            alt="Deno logo"
            src="/deno-looking-up.svg"
          />
        </div>
      </div>
    </Layout>
  );
}
