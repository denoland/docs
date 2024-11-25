import { CopyButton } from "../_components/CopyButton.tsx";
import SnippetComponent from "../_components/SnippetComponent.tsx";
import { ExampleFromFileSystem } from "../types.ts";

type Props =  { example: ExampleFromFileSystem };

export default function ExamplePage({ example }: Props) {

    const contentNoCommentary = example.parsed.files.map((file) =>
        file.snippets.map((snippet) => snippet.code).join("\n")
      ).join("\n");
      const url =
        `https://github.com/denoland/deno-docs/blob/main/examples/${example.name}${
          example.parsed.files.length > 1 ? "/main" : ""
        }`;
      const rawUrl = `https://docs.deno.com/learn/examples/${example.name}${
        example.parsed.files.length > 1 ? "/main" : ""
      }`;  


    return (        
        <div>
            <main
            id="content"
            class="max-w-screen-lg flex flex-col gap-8 px-4 md:mx-auto pt-6 mb-20"
            >
            <div class="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center">
                <div class="flex flex-col gap-2">
                <h1 class="text-3xl font-bold">
                    {example.parsed.title}
                </h1>
                {example.parsed.description && (
                    <p
                    className="max-w-prose"
                    dangerouslySetInnerHTML={{
                        __html: example.parsed.description,
                    }}
                    />
                )}
                </div>

                <a
                href={url}
                class="px-4 py-2 rounded bg-background-secondary text-sm whitespace-nowrap border border-foreground-secondary hover:bg-background-primary text-foreground-primary"
                >
                Edit on Github
                </a>
            </div>
            <div class="relative block">
                <CopyButton text={contentNoCommentary} />
            </div>
            {example.parsed.files.map((file) => (
                <div class="flex flex-col gap-4 md:gap-0" key={file.name}>
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
                    <p class="mt-4 mb-4">
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
                </>
                )}
                {example.parsed.playground && (
                <div class="col-span-3 mt-8">
                    <p class="text-foreground-secondary">
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
                    <h2 class="font-semibold">Additional resources</h2>
                    <ul class="list-none mt-1">
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
    )
}
