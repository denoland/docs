import React from "react";
import Layout from "@theme/Layout";
import Footer from "@theme/Footer";

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
}

interface APIReferenceIndexProps {
  apiLinks: Link[];
}

const APIReferenceIndex: React.FC<APIReferenceIndexProps> = ({ apiLinks }) => {
  return (
    <Layout
      title={"Deno: the easiest, most secure JavaScript runtime"}
      description="Reference documentation for the Deno runtime and Deno Deploy"
    >
      <div className="w-full mt-8 h-screen max-w-screen-xl mx-auto">
        <div className="max-w-prose flex flex-col gap-8 mt-32">
          <header>
            <h1 className="text-3xl mb-2">Deno API Reference</h1>
            <div
              role="doc-subtitle"
              className="text-gray-500 dark:text-gray-0 text-lg"
            >
              Description about Deno APIs. These are APIs you can use with Deno.
            </div>
          </header>
          <ul className="pl-0">
            {apiLinks.map((link) => {
              return (
                <li className="list-none flex flex-col gap-1" key={link.id}>
                  <a
                    href={link.url}
                    className="text-inherit text-lg underline underline-offset-4 decoration-gray-300 dark:decoration-gray-600"
                    title={link.description}
                  >
                    {link.title}
                  </a>
                  <p className="text-gray-500 dark:text-gray-0 leading-normal">
                    {link.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default APIReferenceIndex;
