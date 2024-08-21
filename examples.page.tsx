import { walkSync } from "@std/fs/walk";

export const layout = "raw.tsx";

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

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  const files = [
    ...walkSync("./examples/", {
      exts: [".ts"],
    }),
  ];
  const examples = files.map((file) => {
    const content = Deno.readTextFileSync(file.path);

    return {
      name: file.name,
      content,
      label: file.name.replace(".ts", ""),
      parsed: parseExample(file.name, content),
    } as ReturnedContent;
  });

  for (const example of examples) {
    const contentNoCommentary = example.parsed.files.map((file) =>
      file.snippets.map((snippet) => snippet.code).join("\n")
    ).join("\n");
    const url =
      `https://github.com/denoland/deno-docs/blob/main/examples/${example.name}${
        example.parsed.files.length > 1 ? "/main" : ""
      }`;
    const rawUrl = `https://docs.deno.com/examples/${example.name}${
      example.parsed.files.length > 1 ? "/main" : ""
    }`;

    yield {
      url: `/examples/${example.label}/index.html`,
      title: `${example.parsed.title} - Deno by Example`,
      content: (
        <div>
          <main id="content" class="max-w-screen-lg mx-auto py-4">
            <div class="flex gap-2 items-center">
              <p
                class="italic m-0 mr-2"
                title={DIFFICULTIES[example.parsed.difficulty].description}
              >
                {DIFFICULTIES[example.parsed.difficulty].title}
              </p>
              <div class="flex gap-2 items-center">
                {example.parsed.tags.map((tag) => (
                  <span
                    class="text-xs italic py-0.5 px-2 rounded-md"
                    title={TAGS[tag].description}
                    key={TAGS[tag].title}
                  >
                    {TAGS[tag].title}
                  </span>
                ))}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <h1 class="mt-10 mb-0 text-3xl font-bold">
                {example.parsed.title}
              </h1>
              <a
                href={url}
                class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-300 text-slate-900"
              >
                Edit
              </a>
            </div>
            {example.parsed.description && (
              <p class="mt-10 mb-6">{example.parsed.description}</p>
            )}
            <div class="relative block">
              <CopyButton text={contentNoCommentary} />
            </div>
            {example.parsed.files.map((file) => (
              <div class="mt-10" key={file.name}>
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
            <div>
              {example.parsed.run && (
                <>
                  <p class="mt-16 mb-6">
                    Run{" "}
                    <a
                      href={url}
                      class="text-primary hover:underline focus:underline"
                    >
                      this example
                    </a>{" "}
                    locally using the Deno CLI:
                  </p>
                  <div class="markdown-body">
                    <pre className="highlight">
                      <code>
                        {example.parsed.run.startsWith("deno")
                          ? example.parsed.run.replace("<url>", url)
                          : "deno run " +
                            example.parsed.run.replace("<url>", rawUrl)}
                      </code>
                    </pre>
                  </div>
                </>
              )}
              {example.parsed.playground && (
                <div class="col-span-3 mt-8">
                  <p class="text-gray-700">
                    Try this example in a Deno Deploy playground:
                  </p>
                  <p class="mt-3">
                    <a
                      class="py-2 px-4 bg-black inline-block text-white text-base rounded-md opacity-90 hover:opacity-100"
                      href={example.parsed.playground}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Deploy
                    </a>
                  </p>
                </div>
              )}
              {example.parsed.additionalResources.length > 0 && (
                <div class="col-span-3 mt-12 pt-6 border-t-1 border-gray-200">
                  <p>Additional resources:</p>
                  <ul class="list-disc list-inside mt-1">
                    {example.parsed.additionalResources.map(([link, title]) => (
                      <li
                        class="text-gray-700 hover:text-gray-900"
                        key={link + title}
                      >
                        <a
                          class="text-primary hover:underline focus:underline"
                          href={link}
                        >
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </main>
        </div>
      ),
    };
  }

  const groupMap: [string, string][] = [
    ["Basics", "IconFlag3"],
    ["Encoding", "IconTransform"],
    ["CLI", "IconTerminal2"],
    ["Network", "IconNetwork"],
    ["System", "IconDeviceDesktop"],
    ["File System", "IconFiles"],
    ["Databases", "IconDatabase"],
    ["Scheduled Tasks", "IconClock"],
    ["Cryptography", "IconFileShredder"],
    ["Advanced", "IconStars"],
  ];

  const groups = examples.reduce((acc, example) => {
    const group = example.parsed.group || "Basics";
    const lowerGroup = group.toLowerCase();

    if (!acc[lowerGroup]) {
      acc[lowerGroup] = [];
    }

    if (!groupMap.find(([category]) => category.toLowerCase() === lowerGroup)) {
      groupMap.push([group.toLowerCase(), "IconFlag3"]);
    }

    acc[lowerGroup].push(example);
    return acc;
  }, {});

  const elements = groupMap.map(([category, icon]) => {
    const group = groups[category.toLowerCase()];

    if (!group) {
      return null;
    }

    group.sort((a, b) => a.parsed.sortOrder - b.parsed.sortOrder);

    return (
      <section
        key={category}
        className="mb-12 [-webkit-column-break-inside:avoid;]"
      >
        <h2 className="text-xl mb-2 block border-solid border-t-0 border-x-0 border-b border-b-gray-300 dark:border-b-gray-600 pb-1">
          {category}
        </h2>
        <ul className="list-none pl-0">
          {group.map((example) => {
            return (
              <li key={example.parsed.id} className="leading-loose">
                <a
                  href={"/examples/" + example.parsed.id.replace(".ts", "")}
                  className="text-inherit underline decoration-gray-300 dark:decoration-gray-600"
                >
                  {example.parsed.title}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    );
  });

  yield {
    url: `/examples/`,
    title: `Deno by Example`,
    content: (
      <main
        id="content"
        className="w-full flex flex-col px-8 pt-6 mt-16 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-screen-xl mx-auto mb-20"
      >
        <div className="pb-16 align-middle md:pb-0 w-full">
          <div className="mb-16 md:mb-24 text-center">
            <img
              className="w-full max-w-32 mx-auto h-auto mb-4"
              alt="Deno Examples"
              src="/examples.png"
            />
            <h1 className="text-4xl md:text-6xl font-semibold mb-4">
              Deno by Example
            </h1>
            <p className="max-w-prose mx-auto">
              A collection of annotated Deno examples, to be used as a reference
              for how to build with Deno, or as a guide to learn about many of
              Deno's features.
            </p>
          </div>
          <div
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
            style={{ columnGap: "3rem" }}
          >
            {elements}
          </div>
          <div className="w-full flex flex-col px-8 pt-6 mt-20 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-screen-xl mx-auto mb-24">
            <p className="max-w-prose mx-auto text-center">
              Need an example that isn't here? Or want to add one of your own?
              <br /> We welcome contributions! <br />
              You can request more examples, or add your own at our{" "}
              <a
                href="https://github.com/denoland/deno-docs?tab=readme-ov-file#examples"
                class="text-primary hover:underline focus:underline"
              >
                GitHub repository
              </a>
            </p>
          </div>
        </div>
      </main>
    ),
  };
}

function SnippetComponent(props: {
  filename: string;
  firstOfFile: boolean;
  lastOfFile: boolean;
  snippet: ExampleSnippet;
}) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-10 gap-x-8">
      <div
        class={`italic select-none text-sm ${
          props.snippet.text ? "pt-[2.2rem] md:pt-9 pb-4 md:pb-0 " : " "
        } ${props.snippet.code ? "col-span-3" : "col-span-full"}`}
      >
        {props.snippet.text}
      </div>
      <div
        class={`col-span-7 relative ${
          props.snippet.code.length === 0 ? "hidden sm:block" : ""
        }`}
      >
        {props.filename && (
          <span
            class={`font-mono text-xs absolute -top-3 left-4 bg-[var(--color-canvas-subtle)] z-10 p-1 rounded-sm ${
              props.firstOfFile ? "block" : "block sm:hidden"
            }`}
          >
            {props.filename}
          </span>
        )}
        <div class="-mx-4 h-full sm:mx-0 overflow-scroll sm:overflow-hidden relative gfm-highlight rounded-md">
          {props.snippet.code && (
            <div class="nocopy h-full markdown-body !bg-[var(--color-canvas-subtle)]">
              <pre class="highlight language-ts">
                <code
                  dangerouslySetInnerHTML={{ __html: props.snippet.code }}
                ></code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CopyButton(props: { text: string }) {
  return (
    <button
      onClick={() => navigator?.clipboard?.writeText(props.text)}
      type="button"
      aria-label="Copy code to clipboard"
      title="Copy"
      class="clean-btn copy-all absolute right-2 top-6 hover:bg-gray-200 text-gray-900 p-2 rounded-md z-10"
    >
      <svg viewBox="0 0 24 24" width="15" height="15">
        <path
          fill="currentColor"
          d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
        >
        </path>
      </svg>
    </button>
  );
}

export const TAGS = {
  cli: {
    title: "cli",
    description: "Works in Deno CLI",
  },
  deploy: {
    title: "deploy",
    description: "Works on Deno Deploy",
  },
  web: {
    title: "web",
    description: "Works in on the Web",
  },
};

export const DIFFICULTIES = {
  beginner: {
    title: "Beginner",
    description: "No significant prior knowledge is required for this example.",
  },
  intermediate: {
    title: "Intermediate",
    description: "Some prior knowledge is needed for this example.",
  },
};

type ReturnedContent = {
  name: string;
  content: string;
  label: string;
  parsed: Example;
};

export interface Example {
  id: string;
  title: string;
  description: string;
  difficulty: keyof typeof DIFFICULTIES;
  tags: (keyof typeof TAGS)[];
  additionalResources: [string, string][];
  run?: string;
  playground?: string;
  files: ExampleFile[];
  group: string;
  sortOrder: any;
}

export interface ExampleFile {
  name: string;
  snippets: ExampleSnippet[];
}

export interface ExampleSnippet {
  text: string;
  code: string;
}

export function parseExample(id: string, file: string): Example {
  // Extract the multi line JS doc comment at the top of the file
  const [, jsdoc, rest] = file.match(/^\s*\/\*\*(.*?)\*\/\s*(.*)/s) || [];

  // Extract the @key value pairs from the JS doc comment
  let description = "";
  const kvs: Record<string, string> = {};
  const resources = [];
  for (let line of jsdoc.split("\n")) {
    line = line.trim().replace(/^\*/, "").trim();
    const [, key, value] = line.match(/^\s*@(\w+)\s+(.*)/) || [];
    if (key) {
      if (key === "resource") {
        resources.push(value);
      } else {
        kvs[key] = value.trim();
      }
    } else {
      description += " " + line;
    }
  }
  description = description.trim();

  // Separate the code into snippets.
  const files: ExampleFile[] = [
    {
      name: "",
      snippets: [],
    },
  ];
  let parseMode = "code";
  let currentFile = files[0];
  let text = "";
  let code = "";

  for (const line of rest.split("\n")) {
    const trimmedLine = line.trim();
    if (parseMode == "code") {
      if (line.startsWith("// File:")) {
        if (text || code.trimEnd()) {
          code = code.trimEnd();
          currentFile.snippets.push({ text, code });
          text = "";
          code = "";
        }
        const name = line.slice(8).trim();
        if (currentFile.snippets.length == 0) {
          currentFile.name = name;
        } else {
          currentFile = {
            name,
            snippets: [],
          };
          files.push(currentFile);
        }
      } else if (line.startsWith("/* File:")) {
        if (text || code.trimEnd()) {
          code = code.trimEnd();
          currentFile.snippets.push({ text, code });
          text = "";
          code = "";
        }
        const name = line.slice(8).trim();
        if (currentFile.snippets.length == 0) {
          currentFile.name = name;
        } else {
          currentFile = {
            name,
            snippets: [],
          };
          files.push(currentFile);
        }
        parseMode = "file";
      } else if (
        trimmedLine.startsWith("// deno-lint-ignore") ||
        trimmedLine.startsWith("//deno-lint-ignore") ||
        trimmedLine.startsWith("// deno-fmt-ignore") ||
        trimmedLine.startsWith("//deno-fmt-ignore")
      ) {
        // skip deno directives
      } else if (trimmedLine.startsWith("//-")) {
        code += line.replace("//-", "//") + "\n";
      } else if (trimmedLine.startsWith("//")) {
        if (text || code.trimEnd()) {
          code = code.trimEnd();
          currentFile.snippets.push({ text, code });
        }
        text = trimmedLine.slice(2).trim();
        code = "";
        parseMode = "comment";
      } else {
        code += line + "\n";
      }
    } else if (parseMode == "comment") {
      if (
        trimmedLine.startsWith("// deno-lint-ignore") ||
        trimmedLine.startsWith("//deno-lint-ignore") ||
        trimmedLine.startsWith("// deno-fmt-ignore") ||
        trimmedLine.startsWith("//deno-fmt-ignore")
      ) {
        // skip deno directives
      } else if (trimmedLine.startsWith("//")) {
        text += " " + trimmedLine.slice(2).trim();
      } else {
        code += line + "\n";
        parseMode = "code";
      }
    } else if (parseMode == "file") {
      if (line == "*/") {
        parseMode = "code";
      } else {
        code += line + "\n";
      }
    }
  }
  if (text || code.trimEnd()) {
    code = code.trimEnd();
    currentFile.snippets.push({ text, code });
  }

  if (!kvs.title) {
    throw new Error("Missing title in JS doc comment.");
  }

  const tags = kvs.tags.split(",").map((s) => s.trim() as keyof typeof TAGS);
  for (const tag of tags) {
    if (!TAGS[tag]) {
      throw new Error(`Unknown tag '${tag}'`);
    }
  }

  const difficulty = kvs.difficulty as keyof typeof DIFFICULTIES;
  if (!DIFFICULTIES[difficulty]) {
    throw new Error(`Unknown difficulty '${difficulty}'`);
  }

  const additionalResources: [string, string][] = [];
  for (const resource of resources) {
    // @resource {https://jsr.io/@std/http/server/~/} std/http/server
    const [_, url, title] = resource.match(/^\{(.*?)\}\s(.*)/) || [];
    if (!url || !title) {
      throw new Error(`Invalid resource: ${resource}`);
    }
    additionalResources.push([url, title]);
  }

  return {
    id,
    title: kvs.title,
    description,
    difficulty,
    tags,
    additionalResources,
    run: kvs.run,
    playground: kvs.playground,
    files,
    group: kvs.group || "Misc",
    sortOrder: kvs.sortOrder || 999999,
  };
}
