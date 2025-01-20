import anchor from "npm:markdown-it-anchor@9";
import { full as emoji } from "npm:markdown-it-emoji@3";
import admonitionPlugin from "./markdown-it/admonition.ts";
import codeblockCopyPlugin from "./markdown-it/codeblock-copy.ts";
import codeblockTitlePlugin from "./markdown-it/codeblock-title.ts";
import relativeLinksPlugin from "./markdown-it/relative-path.ts";
import replacerPlugin from "./markdown-it/replacer.ts";
import { MarkdownItOptions } from "lume/deps/markdown_it.ts";
import markdownit from "markdown-it";
import Prism from "./prism.ts";

export const plugins = [
  replacerPlugin,
  emoji,
  admonitionPlugin,
  codeblockCopyPlugin,
  codeblockTitlePlugin,
  [
    anchor,
    {
      permalink: anchor.permalink.linkInsideHeader({
        symbol:
          `<span class="sr-only">Jump to heading</span><span aria-hidden="true" class="anchor-end">#</span>`,
        placement: "after",
      }),
      getTokensText(tokens: { type: string; content: string }[]) {
        return tokens
          .filter((t) => ["text", "code_inline"].includes(t.type))
          .map((t) => t.content.replaceAll(/ \([0-9/]+?\)/g, ""))
          .join("")
          .trim();
      },
    },
  ],
  relativeLinksPlugin,
];

export const options: MarkdownItOptions = {
  linkify: true,
  langPrefix: "highlight notranslate language-",
  highlight: (code, lang) => {
    if (!lang || !Prism.languages[lang]) {
      return code;
    }
    const result = Prism.highlight(code, Prism.languages[lang], lang);
    return result || code;
  },
};

export const markdownRenderer = markdownit(options).use(...plugins);

export default { plugins, options };
