import ansiRegex from "npm:ansi-regex";
import { HeaderAnchor } from "../_components/HeaderAnchor.tsx";
import CLI_REFERENCE from "../runtime/reference/cli/_commands_reference.json" with {
  type: "json",
};
import { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

type ArgType = {
  name: string;
  short: string | null;
  long: string;
  required: boolean;
  help: string | null;
  help_heading: string | null;
  usage: string;
};

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

/**
 * Parse the usage string to extract the value type.
 * Examples:
 *   "--config <FILE>"          → "FILE"
 *   "--fail-fast[=<N>]"        → "N"
 *   "--coverage[=<DIR>]"       → "DIR"
 *   "--no-check[=<NO_CHECK_TYPE>]" → "NO_CHECK_TYPE"
 *   "--no-run"                 → null (boolean flag)
 */
function parseValueType(usage: string): string | null {
  const match = usage.match(/<([^>]+)>/);
  if (!match) return null;

  const raw = match[1];
  // Clean up common patterns
  return raw
    .replace(/\.\.\.$/, "")
    .trim();
}

/**
 * Determine if a flag is boolean (no value) or takes a value.
 * Optional values like `--flag[=<VAL>]` are marked as optional.
 */
function isOptionalValue(usage: string): boolean {
  return usage.includes("[=<") || usage.includes("[<");
}

export default function renderCommand(
  commandName: string,
  helpers: Lume.Helpers,
): { rendered: JSX.Element; toc: TableOfContentsItem_[] } {
  const command = CLI_REFERENCE.subcommands.find((command) =>
    command.name === commandName
  )!;

  const toc: TableOfContentsItem_[] = [];

  // Process the about text (description from CLI help)
  let about = "";
  if (command.about) {
    about = command.about.replaceAll(
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
            offset -= line.length + 1;
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
  }

  // Separate args into positional args and grouped options
  const options: Record<string, ArgType[]> = {};

  for (const arg of command.args) {
    if (arg.help_heading === "Unstable options") {
      continue;
    }

    if (arg.long) {
      const key = arg.help_heading ?? "Options";
      options[key] ??= [];
      options[key].push(arg as ArgType);
    }
  }

  const rendered = (
    <div>
      <div class="bg-transparent mt-4 mb-12 relative pl-2 border-l border-background-tertiary">
        <div class="text-xs font-bold mb-1">
          Command line usage:
        </div>
        <div>
          <pre class="!mb-0 !p-6">
            <code>
              {command.usage.replaceAll(ANSI_RE, "").slice("usage: ".length)}
            </code>
          </pre>
        </div>
      </div>

      {about && (
        <div
          class="flex flex-col gap-4"
          dangerouslySetInnerHTML={{ __html: helpers.md(about) }}
        />
      )}

      {Object.entries(options).map(([heading, flags]) => {
        const id = heading.toLowerCase().replace(/\s/g, "-");

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
            <div class="flex flex-col gap-5 mt-4">
              {flags
                .toSorted((a: ArgType, b: ArgType) =>
                  a.long.localeCompare(b.long)
                )
                .map((flag: ArgType) => renderOption(id, flag, helpers))}
            </div>
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

function renderOption(group: string, arg: ArgType, helpers: Lume.Helpers) {
  const id = `${group}-${arg.long}`;
  const valueType = parseValueType(arg.usage);
  const optional = isOptionalValue(arg.usage);

  // Extract docs link from help text if present
  let docsLink: string | null = null;
  let help = arg.help ? arg.help.replaceAll(ANSI_RE, "") : "";
  if (help) {
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
  }

  // Build the flag display: --long, -short
  const longFlag = "--" + arg.long;
  const flagDisplay = arg.short ? `${longFlag}, -${arg.short}` : longFlag;

  return (
    <div id={id} class="p-4 rounded-md border border-foreground-secondary/20">
      <div class="flex items-baseline justify-between gap-4 flex-wrap">
        <div class="flex items-baseline gap-2">
          <code class="text-sm font-semibold">
            {docsLink
              ? <a href={docsLink}>{flagDisplay}</a>
              : flagDisplay}
          </code>
          {valueType && (
            <span class="text-xs text-foreground-secondary">
              {"<"}{valueType}{">"}
              {optional && (
                <span class="text-foreground-tertiary ml-1">optional</span>
              )}
            </span>
          )}
        </div>
        <HeaderAnchor id={id} />
      </div>
      {help && (
        <div
          class="mt-2 text-sm !whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: helpers.md(
              flagsToInlineCode(help) +
                ((help.endsWith(".") || help.endsWith("]")) ? "" : "."),
            ),
          }}
        />
      )}
    </div>
  );
}
