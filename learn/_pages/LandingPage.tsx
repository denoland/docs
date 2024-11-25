import { ExampleFromFileSystem } from "../types.ts";

type Props = { examples: ExampleFromFileSystem[] };

export default function LandingPageComponent({ examples }: Props) {
    examples = examples || [];
    const elements = generateExampleGroups(examples);

    return (
    <main
        id="content"
        className="w-full flex flex-col px-8 pt-6 mt-16 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-screen-xl mx-auto mb-20"
        >
        <div className="pb-16 align-middle md:pb-0 w-full">
            <div className="mt-8 mb-16 md:mb-24 text-center">
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
                <a
                href="/runtime/contributing/examples/"
                className="homepage-link runtime-link text-center mt-4"
                >
                Commit an example and we'll send you some stickers!
                </a>
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
    );
}

function generateExampleGroups(examples: ExampleFromFileSystem[]) {

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
        ["Unstable APIs", "IconPersonDigging"],
    ];

    
  const groups: Record<string, ExampleFromFileSystem[]> = examples.reduce((acc: Record<string, ExampleFromFileSystem[]>, example) => {
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

  return groupMap.map(([category, icon]) => {
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
          {group.map((example: ExampleFromFileSystem) => {
            return (
              <li key={example.parsed.id} className="leading-loose">
                <a
                  href={"/learn/" + example.parsed.id.replace(".ts", "")}
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

}
