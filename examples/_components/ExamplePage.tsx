import { ExampleFromFileSystem } from "../types.ts";
import { CopyButton } from "./CopyButton.tsx";
import SnippetComponent from "./SnippetComponent.tsx";

type Props = { example: ExampleFromFileSystem };

export default function ExamplePage({ example }: Props) {
  const contentNoCommentary = example.parsed.files.map((file) =>
    file.snippets.map((snippet) => snippet.code).join("\n")
  ).join("\n");
  const url =
    `https://github.com/denoland/deno-docs/blob/main/examples/scripts/${example.name}${
      example.parsed.files.length > 1 ? "/main" : ""
    }`;
  const rawUrl = `https://docs.deno.com/examples/scripts/${example.name}${
    example.parsed.files.length > 1 ? "/main" : ""
  }`;

  return (
    <div data-content="example">
      <div class="relative">
        <div class="absolute top-[-4rem] right-0">
          <a
            href={url}
            className="blocklink "
          >
            Edit on Github
          </a>
        </div>
        <div class="flex flex-col gap-2">
          {example.parsed.description && (
            <p
              className="max-w-full"
              dangerouslySetInnerHTML={{
                __html: example.parsed.description,
              }}
            />
          )}
        </div>
      </div>
      <div class="relative block mt-8">
        <CopyButton text={contentNoCommentary} />

        {example.parsed.files.map((file) => (
          <div
            class="flex flex-col gap-4 md:gap-0 example-content"
            key={file.name}
          >
            {file.snippets.map((snippet, i) => {
              // In the stacked layout, prose separates code into visual
              // blocks: a snippet with text starts a new block, and a block
              // ends right before the next snippet with text.
              const startsBlock = i === 0 || !!snippet.text ||
                !file.snippets[i - 1].code;
              const endsBlock = i === file.snippets.length - 1 ||
                !!file.snippets[i + 1].text || !file.snippets[i + 1].code;
              return (
                <SnippetComponent
                  key={i}
                  onlyOneSnippet={startsBlock && endsBlock}
                  firstOfFile={startsBlock}
                  lastOfFile={endsBlock}
                  filename={i === 0 ? file.name : ""}
                  snippet={snippet}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div>
        {example.parsed.run && (
          <div class="mt-8 -mx-4 sm:mx-0">
            <p class="mx-4 sm:mx-0">
              Run{" "}
              <a
                href={url}
                class="text-primary hover:underline focus:underline"
              >
                this example
              </a>{" "}
              locally using the Deno CLI:
            </p>
            <div
              data-color-mode="light"
              data-dark-theme="dark"
              data-light-theme="light"
              class="markdown-body"
            >
              <pre className="highlight">
                <code>
                {example.parsed.run.startsWith("deno")
                    ? example.parsed.run.replace("<url>", url)
                    : "deno run " +
                    example.parsed.run.replace("<url>", rawUrl)}
                </code>
              </pre>
            </div>
          </div>
        )}
        {example.parsed.playground && (
          <div class="col-span-3 mt-8">
            <p class="text-foreground-secondary">
              Try this example in a{" "}
              <a
                href={example.parsed.playground}
                target="_blank"
                rel="noreferrer"
              >
                Deno Deploy playground
              </a>
            </p>
          </div>
        )}
        {example.parsed.additionalResources.length > 0 && (
          <div class="col-span-3 pt-6 mt-8 border-t-1 border-gray-200">
            <h2 class="mt-0">Additional resources</h2>
            <ul class="list-disc pl-5 mt-1 marker:text-foreground-secondary">
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
    </div>
  );
}
