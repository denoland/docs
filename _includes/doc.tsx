import ansiRegex from "npm:ansi-regex";
import Logo from "../_components/Logo.tsx";
import CLI_REFERENCE from "../runtime/reference/cli/_commands_reference.json" with {
  type: "json",
};
import {
  Sidebar as Sidebar_,
  SidebarItem,
  TableOfContentsItem as TableOfContentsItem_,
} from "../types.ts";
import { Breadcrumbs } from "../_components/Breadcrumbs.tsx";
import { HeaderAnchor } from "../_components/HeaderAnchor.tsx";
import { NavigationButton } from "../_components/NavigationButton.tsx";
import { TableOfContentsItem } from "../_components/TableOfContentsItem.tsx";
import { TableOfContentsItemMobile } from "../_components/TableOfContentsItemMobile.tsx";

export const layout = "layout.tsx";

export default function Page(props: Lume.Data, helpers: Lume.Helpers) {
  const sidebar = props.sidebar as Sidebar_;
  const file = props.page.sourcePath;
  if (sidebar === undefined) {
    throw new Error("Missing sidebar for " + props.url);
  }

  function walk(
    sidebarItems: SidebarItem[],
  ): [SidebarItem[], number] | undefined {
    for (let i = 0; i < sidebarItems.length; i++) {
      const sidebarItem = sidebarItems[i];
      if (typeof sidebarItem === "string") {
        const data = props.search.data(sidebarItem)!;
        if (!data) {
          throw new Error(`No data found for ${sidebarItem}`);
        }

        if (data.url == props.url) {
          return [sidebarItems, i];
        }
      } else if ("id" in sidebarItem && sidebarItem.id === props.url) {
        return [sidebarItems, i];
      } else if ("items" in sidebarItem) {
        const results = walk(sidebarItem.items);
        if (results) {
          return results;
        }
      }
    }
  }

  let parentNavigation: SidebarItem[] | undefined = undefined;
  let index: number | undefined = undefined;
  for (const sidebarElement of sidebar) {
    const items = walk(sidebarElement.items);

    if (items) {
      [parentNavigation, index] = items;
      break;
    }
  }

  let renderedCommand = null;

  if (props.command) {
    const { rendered, toc } = renderCommand(props.command, helpers);
    renderedCommand = rendered;
    props.toc = toc.concat(...props.toc);
  }

  return (
    <>
      <aside
        class="flex flex-col absolute top-0 xl:top-16 bottom-0 -translate-x-74 xl:left-0 sidebar-open:translate-x-0 w-74 border-r border-foreground-tertiary bg-background-primary z-50 xl:z-0 xl:translate-x-0 transition-transform"
        id="sidebar"
        data-open="false"
      >
        <div class="xl:hidden p-4 shadow-sm flex justify-between h-16">
          <a class="flex items-center gap-3 mr-6" href="/">
            <Logo />
          </a>
          <button
            type="button"
            aria-label="Close navigation bar"
            id="sidebar-close"
          >
            <svg
              viewBox="0 0 15 15"
              width="16"
              height="16"
              class="text-foreground-secondary"
            >
              <g stroke="currentColor" stroke-width="1.2">
                <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
              </g>
            </svg>
          </button>
        </div>
        <props.comp.Sidebar
          sidebar={sidebar}
          search={props.search}
          url={props.url}
          headerPath={props.headerPath!}
        />
      </aside>
      <div
        class="absolute inset-0 backdrop-brightness-50 z-40 hidden sidebar-open:block sidebar-open:xl:hidden"
        id="sidebar-cover"
        data-open="false"
      >
      </div>
      <div
        class="absolute top-16 bottom-0 left-0 right-0 xl:left-74 overflow-y-auto xl:grid xl:grid-cols-7 xl:gap-8 max-w-screen-2xl mx-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <main
          id="content"
          class="mx-auto max-w-screen-xl w-full pt-2 pb-8 flex flex-grow xl:col-span-5"
        >
          <div class="flex-grow px-4 sm:px-5 md:px-6 max-w-full">
            <article class="max-w-[66ch] mx-auto">
              <Breadcrumbs
                title={props.title!}
                sidebar={sidebar}
                url={props.url}
                sectionTitle={props.sectionTitle!}
                sectionHref={props.sectionHref!}
              />
              {props.toc && props.toc.length > 0 && (
                <details class="block xl:hidden my-4 bg-background-secondary rounded-md group">
                  <summary class="px-4 py-2 group-open:border-b border-foreground-tertiary">
                    On this page
                  </summary>
                  <ul class="pl-1 py-1.5">
                    {props.toc.map((item: TableOfContentsItem_) => (
                      <TableOfContentsItemMobile item={item} />
                    ))}
                  </ul>
                </details>
              )}
              <div
                data-color-mode="auto"
                data-light-theme="light"
                data-dark-theme="dark"
                class="markdown-body mt-4 rounded-lg"
              >
                <h1
                  dangerouslySetInnerHTML={{
                    __html: helpers.md(props.title!, true),
                  }}
                >
                </h1>
                {props.available_since && (
                  <div class="bg-gray-200 rounded-md text-sm py-3 px-4 mb-4 font-semibold">
                    Available since {props.available_since}
                  </div>
                )}
                {renderedCommand}
                {props.children}
              </div>
            </article>
            {parentNavigation && (
              <nav class="grid gap-8 grid-cols-2 max-w-[66ch] items-center justify-between mt-12 mx-auto">
                <div>
                  {parentNavigation[index! - 1] && (
                    <NavigationButton
                      item={parentNavigation[index! - 1]}
                      search={props.search}
                      direction="prev"
                    />
                  )}
                </div>
                <div>
                  {parentNavigation[index! + 1] && (
                    <NavigationButton
                      item={parentNavigation[index! + 1]}
                      search={props.search}
                      direction="next"
                    />
                  )}
                </div>
              </nav>
            )}
            {props.comp.Feedback({ file })}
          </div>
        </main>

        <aside class="hidden xl:block pb-8 pr-8 col-span-2">
          <div
            class="py-2 sticky overflow-y-auto top-4 h-[calc(100vh-7rem)]"
            id="toc"
          >
            <ul class="border-l border-foreground-tertiary dark:border-background-tertiary py-2 pl-2 relative">
              {(props.toc as TableOfContentsItem_[]).map((item) => (
                <TableOfContentsItem item={item} />
              ))}
            </ul>
          </div>
        </aside>
        <div class="xl:col-span-full">
          <props.comp.Footer />
        </div>
      </div>
    </>
  );
}

const ANSI_RE = ansiRegex();
const SUBSEQUENT_ANSI_RE = new RegExp(
  `(?:${ANSI_RE.source})(?:${ANSI_RE.source})`,
  "g",
);
const ENCAPSULATED_ANSI_RE = new RegExp(
  `(${ANSI_RE.source})(.+?)(${ANSI_RE.source})`,
  "g",
);
const START_AND_END_ANSI_RE = new RegExp(
  `^(?:${ANSI_RE.source}).+?(?:${ANSI_RE.source})$`,
);
const SUBSEQUENT_ENCAPSULATED_ANSI_RE = new RegExp(
  `${ENCAPSULATED_ANSI_RE.source}( ?)${ENCAPSULATED_ANSI_RE.source}`,
  "g",
);

const FLAGS_RE = /[^`]--\S+/g;
function flagsToInlineCode(text: string): string {
  return text.replaceAll(FLAGS_RE, "`$&`");
}

function renderCommand(
  commandName: string,
  helpers: Lume.Helpers,
): { rendered: any; toc: TableOfContentsItem_[] } {
  const command = CLI_REFERENCE.subcommands.find((command) =>
    command.name === commandName
  )!;

  const toc: TableOfContentsItem_[] = [];

  let about = command.about!.replaceAll(
    SUBSEQUENT_ENCAPSULATED_ANSI_RE,
    function (
      _,
      _opening1,
      text1,
      _closing1,
      space,
      opening2,
      text2,
      closing2,
    ) {
      return `${opening2}${text1}${space}${text2}${closing2}`;
    },
  ).replaceAll(SUBSEQUENT_ANSI_RE, "");
  let aboutLines = about.split("\n");
  const aboutLinesReadMoreIndex = aboutLines.findLastIndex((line) =>
    line.toLowerCase().replaceAll(ANSI_RE, "").trim().startsWith("read more:")
  );
  if (aboutLinesReadMoreIndex !== -1) {
    aboutLines = aboutLines.slice(0, aboutLinesReadMoreIndex);
  }

  about = aboutLines.join("\n").replaceAll(
    ENCAPSULATED_ANSI_RE,
    (_, opening, text, _closing, offset, string) => {
      if (opening === "\u001b[32m") { // green, used as heading
        return `### ${text}`;
      } else if (
        opening === "\u001b[38;5;245m" || opening === "\u001b[36m" ||
        opening === "\u001b[1m" || opening === "\u001b[22m"
      ) { // gray and cyan used for code and snippets, and we treat yellow and bold as well as such
        const lines = string.split("\n");
        let line = "";

        while (offset > 0) {
          line = lines.shift();
          offset -= line.length;
        }

        if (START_AND_END_ANSI_RE.test(line.trim())) {
          return "\n```\n" + text + "\n```\n\n";
        } else {
          return "`" + text + "`";
        }
      } else {
        return text;
      }
    },
  );

  const args = [];
  const options: Record<string, any> = {};

  for (const arg of command.args) {
    if (arg.help_heading === "Unstable options") {
      continue;
    }

    if (arg.long) {
      options[arg.help_heading ?? "Options"] ??= [];
      options[arg.help_heading ?? "Options"].push(arg);
    } else {
      args.push(arg);
    }
  }

  const rendered = (
    <div>
      <div class="p-4 bg-stone-100 dark:bg-transparent rounded border border-gray-300 dark:border-background-tertiary mt-6 mb-6 relative">
        <h3 class="!text-xs !m-0 -top-2.5 bg-background-primary border border-gray-600/25 px-2 py-0.5 rounded absolute !font-normal">
          Command line usage
        </h3>
        <div>
          <pre class="!mb-0 !px-3 !py-2">
            <code>{command.usage.replaceAll(ANSI_RE, "").slice("usage: ".length)}</code>
          </pre>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: helpers.md(about) }} />
      <br />

      {Object.entries(options).map(([heading, flags]) => {
        const id = heading.toLowerCase().replace(/\s/g, "-");

        const renderedFlags = flags.toSorted((a, b) =>
          a.name.localeCompare(b.name)
        ).map((flag) => renderOption(id, flag, helpers));

        toc.push({
          text: heading,
          slug: id,
          children: [],
        });

        return (
          <>
            <h2 id={id}>
              {heading} <HeaderAnchor id={id} />
            </h2>
            {renderedFlags}
          </>
        );
      })}
    </div>
  );

  return {
    rendered,
    toc,
  };
}

function renderOption(group: string, arg, helpers: Lume.Helpers) {
  const id = `${group}-${arg.name}`;

  let docsLink = null;
  let help = arg.help.replaceAll(ANSI_RE, "");
  const helpLines = help.split("\n");
  const helpLinesDocsIndex = helpLines.findLastIndex((line) =>
    line.toLowerCase()
      .trim()
      .startsWith("docs:")
  );
  if (helpLinesDocsIndex !== -1) {
    help = helpLines.slice(0, helpLinesDocsIndex).join("\n");
    docsLink = helpLines[helpLinesDocsIndex].trim().slice("docs:".length);
  }

  return (
    <>
      <h3 id={id}>
        <code>
          {docsLink
            ? <a href={docsLink}>{"--" + arg.name}</a>
            : ("--" + arg.name)}
        </code>{" "}
        <HeaderAnchor id={id} />
      </h3>
      {arg.short && (
        <p>
          Short flag: <code>-{arg.short}</code>
        </p>
      )}
      {arg.help && (
        <p
          class="block !whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: helpers.md(
              flagsToInlineCode(help) +
                ((help.endsWith(".") || help.endsWith("]")) ? "" : "."),
            ),
          }}
        />
      )}
    </>
  );
}
