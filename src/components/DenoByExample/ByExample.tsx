import React from "react";
import Layout from "@theme/Layout";
import Footer from "@theme/Footer";
import { parseExample, DIFFICULTIES, TAGS, ExampleSnippet } from '../../plugins/deno-by-example/example';
import CodeBlock from "@theme/CodeBlock";

export default function ByExample({ example, examplesList }) {
  const { name, content } = example;

  const parsed = parseExample(name, content);

  const {
    id,
    title,
    description,
    difficulty,
    tags,
    additionalResources,
    run,
    playground,
    files,
  } = parsed;

  const freshProps = {
    url: {
      origin: "https://github.com/denoland/deno-docs/by-example/", // Make this the real path to the location in the docs repo
      pathname: id,
    },
    data: [
      parsed
    ]
  }

  return (
    <Layout
      title={"Deno: the easiest, most secure JavaScript runtime"}
      description="Reference documentation for the Deno runtime and Deno Deploy"
    >
      <h1>By Example</h1>

      <ExamplePage {...freshProps} />

      <Footer />
    </Layout>
  );
}

function ExamplePage(props: PageProps<Data>) {
  if (props.data === null) {
    return <div>404 Example Not Found</div>;
  }

  const [example, prev, next] = props.data;
  const url = `${props.url.origin}${props.url.pathname}${example.files.length > 1 ? "/main" : ""
    }.ts`;

  const description = (example.description || example.title) +
    " -- Deno by example is a collection of annotated examples for how to use Deno, and the various features it provides.";

  return (
    <div className="Page" title={`${example.title} - Deno by Example`}>
      {/* <Head>
        <link rel="stylesheet" href="/gfm.css" />
        <meta name="description" content={description} />
      </Head> */}
      <main className="max-w-screen-lg mx-auto p-4">
        <div className="flex gap-2 items-center">
          <p
            className="text-gray-500 italic m-0 mr-2"
            title={DIFFICULTIES[example.difficulty].description}
          >
            {DIFFICULTIES[example.difficulty].title}
          </p>
          <div className="flex gap-2 items-center">
            {example.tags.map((tag) => (
              <span
                className="text-xs bg-gray-200 py-0.5 px-2 rounded-md"
                title={TAGS[tag].description}
                key={TAGS[tag].title}
              >
                {TAGS[tag].title}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="mt-2 mb-0 text-3xl font-bold">{example.title}</h1>
          <a
            href={`https://github.com/denoland/deno-docs/blob/by-example/${props.url.pathname}`}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-300 text-slate-900"
          >
            Edit
          </a>
        </div>
        {example.description && (
          <div className="mt-2 mb-16">
            <p className="text-gray-500">{example.description}</p>
          </div>
        )}
        {example.files.map((file) => (
          <div className="mt-10" key={file.name}>
            <div className="relative hidden sm:block">
              {/* <CopyButton
                text={file.snippets.map((snippet) => snippet.code).join("\n\n")}
              /> */}
            </div>
            {file.snippets.map((snippet, i) => (
              <SnippetComponent
                key={i}
                firstOfFile={i === 0}
                lastOfFile={i === file.snippets.length - 1}
                filename={file.name}
                snippet={snippet}
              />
            ))}
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-10 gap-x-8" style={{ borderTop: '1px solid' }}>
          <div className="col-span-3 mt-8" />
          <div className="col-span-7 mt-8">
            {example.run && (
              <>
                <p className="text-gray-700">
                  Run{" "}
                  <a href={url} className="hover:underline focus:underline">
                    this example
                  </a>{" "}
                  locally using the Deno CLI:
                </p>
                <pre className="mt-2 bg-gray-100 p-4 overflow-x-auto text-sm select-all rounded-md">
                  {example.run.startsWith("deno")
                    ? example.run.replace("<url>", url)
                    : "deno run " + example.run.replace("<url>", url)}
                </pre>
              </>
            )}
            {example.playground && (
              <div className="col-span-3 mt-8">
                <p className="text-gray-700">
                  Try this example in a Deno Deploy playground:
                </p>
                <p className="mt-3">
                  <a
                    className="py-2 px-4 bg-black inline-block text-white text-base rounded-md opacity-90 hover:opacity-100"
                    href={example.playground}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Deploy
                  </a>
                </p>
              </div>
            )}
            {example.additionalResources.length > 0 && (
              <div className="col-span-3 mt-12 pt-6 border-t-1 border-gray-200">
                <p className="text-gray-500">Additional resources:</p>
                <ul className="list-disc list-inside mt-1">
                  {example.additionalResources.map(([link, title]) => (
                    <li
                      className="text-gray-700 hover:text-gray-900"
                      key={link + title}
                    >
                      <a className="hover:underline focus:underline" href={link}>
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/*
        <div className="col-span-2 mt-12 flex justify-between h-14">
          {prev
            ? (
              <a
                href={`/${prev.id}`}
                className="w-6/12 text-gray-600 flex items-center gap-3 lg:gap-2 :hover:text-gray-900"
              >
                <CircleArrow />
                {prev.title}
              </a>
            )
            : <div className="w-6/12" />}
          {next && (
            <a
              href={`/${next.id}`}
              className="w-6/12 text-gray-600 text-right flex items-center justify-end gap-3 lg:gap-2 :hover:text-gray-900"
            >
              {next.title}
              <CircleArrow right />
            </a>
          )}
        </div> */}
      </main>
    </div>
  );
}

function SnippetComponent(props: {
  filename: string;
  firstOfFile: boolean;
  lastOfFile: boolean;
  snippet: ExampleSnippet;
}) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-10 gap-x-8 transition duration-150 ease-in mb-16">
      <div className={`mb-4 sm:m-0 text-gray-700 select-none text-sm ${props.snippet.code ? 'col-span-3' : 'col-span-full'}`}>
        {props.snippet.text}
      </div>
      <div
        className={`col-span-7 relative ${props.firstOfFile ? "rounded-t-xl" : ""
          } ${props.lastOfFile ? "rounded-b-xl" : ""} ${props.snippet.code.length === 0 ? "hidden sm:block" : ""
          }`}
      >
        {props.filename && (
          <span
            className={`font-mono text-xs absolute -top-3 left-4 bg-[var(--ifm-code-background)] z-10 p-1 rounded-sm ${props.firstOfFile ? "block" : "block sm:hidden"
              }`}
          >
            {props.filename}
          </span>
        )}
        <div className="relative block sm:hidden">
          {/* <CopyButton text={props.snippet.code} /> */}
        </div>
        <div className="-mx-4 sm:mx-0 overflow-scroll sm:overflow-hidden relative gfm-highlight">
          {props.snippet.code && (
            <CodeBlock language="ts">{props.snippet.code}</CodeBlock>
          )}
        </div>
      </div>
    </div>
  );
}
