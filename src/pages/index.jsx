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
      <div className="flex flex-col-reverse px-8 md:mt-12 md:items-center md:justify-center md:flex-row gap-0 md:gap-16">
        <div className="pb-16 align-middle md:pb-0">
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl">Deno Documentation</h1>
            <p className="my-2">
              Reference docs for the Deno JavaScript runtime and Deno Deploy.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <a
              className={ctaLinks}
              href="/runtime/manual"
            >
              Build with Deno
            </a>
            <a
              className={ctaLinks}
              href="/deploy/manual"
            >
              Deploy to the edge
            </a>
          </div>
        </div>
        <div className="text-center align-middle">
          <img
            className="w-64 h-64 md:h-96 md:w-96 lg:h-[520px] lg:w-[520px]"
            alt="Deno logo"
            src="/deno-looking-up.svg"
          />
        </div>
      </div>
    </Layout>
  );
}
