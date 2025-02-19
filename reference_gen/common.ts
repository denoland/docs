import type { HrefResolver, ShortPath } from "@deno/doc";
import { dirname, join } from "@std/path";
import markdownit from "markdown-it";
import Prism from "../prism.ts";

import admonitionPlugin from "../markdown-it/admonition.ts";
import codeblockCopyPlugin from "../markdown-it/codeblock-copy.ts";

const titleOnlyAllowedTypes = new Set([
  "inline",
  "paragraph_open",
  "paragraph_close",
  "heading_open",
  "heading_close",
  "text",
  "code_inline",
  "html_inline",
  "em_open",
  "em_close",
  "strong_open",
  "strong_close",
  "s_open",
  "s_close",
  "sup_open",
  "sup_close",
  "link_open",
  "link_close",
  "math_inline",
  "softbreak",
  "underline_open",
  "underline_close",
]);

function walkTitleTokens(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (titleOnlyAllowedTypes.has(token.type)) {
      if (token.children) {
        walkTitleTokens(token.children);
      }
    } else {
      tokens.splice(i, 1);
    }
  }
}

function titleOnlyPlugin(md) {
  md.core.ruler.push("titleOnly", function titleOnly(state) {
    walkTitleTokens(state.tokens);

    const paragraphEnd = state.tokens.findIndex((token) =>
      token.type === "paragraph_close"
    );

    if (paragraphEnd !== -1) {
      state.tokens.splice(paragraphEnd);
    }

    if (
      state.tokens.length === 1 && state.tokens[0].type === "paragraph_open"
    ) {
      state.tokens = [];
    }
  });
}

function createAnchorizePlugin(
  anchorizer: (content: string, depthLevel: number) => string,
) {
  return function anchorizePlugin(md) {
    md.core.ruler.push("anchorize", function anchorize(state) {
      const tokens = state.tokens;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === "heading_open") {
          const level = parseInt(token.tag.substring(1));

          const nextToken = tokens[i + 1];

          if (nextToken && nextToken.type === "inline") {
            const content = nextToken.children
              .filter((t) => t.type === "text" || t.type === "code_inline")
              .map((t) => t.content)
              .join("");

            const id = anchorizer(content, level);
            token.attrSet("id", id);
          }
        }
      }
    });
  };
}

function createRenderer(
  anchorizer: (content: string, depthLevel: number) => string,
) {
  return markdownit({
    html: true,
    linkify: true,
    langPrefix: "highlight notranslate language-",
    highlight(content: string, lang: string) {
      if (Prism.languages[lang]) {
        return Prism.highlight(content, Prism.languages[lang], lang);
      } else {
        return "";
      }
    },
  })
    .disable("code")
    .use(admonitionPlugin)
    .use(codeblockCopyPlugin)
    .use(createAnchorizePlugin(anchorizer));
}

export function renderMarkdown(
  md: string,
  titleOnly: boolean,
  _filePath: ShortPath | undefined,
  anchorizer: (content: string, depthLevel: number) => string,
): string | undefined {
  const renderer = createRenderer(anchorizer);
  if (titleOnly) {
    const titleOnlyRenderer = renderer.use(titleOnlyPlugin);
    const parsed = titleOnlyRenderer.parse(md, {});
    if (parsed.length === 0) {
      return undefined;
    }

    return `<div data-color-mode="dark" data-light-theme="light" data-dark-theme="dark" class="markdown-body markdown-summary">${
      titleOnlyRenderer.renderer.render(parsed, titleOnlyRenderer.options, {})
    }</div>`;
  } else {
    return `<div data-color-mode="dark" data-light-theme="light" data-dark-theme="dark" class="markdown-body">${
      renderer.render(md)
    }</div>`;
  }
}

function strip(tokens) {
  let out = "";

  for (const token of tokens) {
    if (token.type === "text" || token.type === "code_inline") {
      out += token.content;
    } else if (token.type === "fence") {
      out += token.content + "\n";
    } else if (token.type === "softbreak") {
      out += "\n";
    } else if (
      token.type === "heading_close" || token.type === "paragraph_close"
    ) {
      out += "\n\n";
    } else if (token.children && token.children.length) {
      out += strip(token.children);
    }
  }

  return out;
}

export function stripMarkdown(md: string): string {
  const renderer = createRenderer(() => "");
  const tokens = renderer.parse(md, {});
  return strip(tokens);
}

export const hrefResolver: HrefResolver = {
  resolvePath(_current, _target, defaultResolve) {
    let path = defaultResolve();

    if (path.endsWith("index.html")) {
      path = path.slice(0, -"index.html".length);
    } else if (path.endsWith(".html")) {
      path = path.slice(0, -".html".length);
    }

    return path;
  },
};

export async function writeFiles(root: string, files: Record<string, string>) {
  await Deno.remove(root, { recursive: true });

  await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const joined = join(root, path);

      await Deno.mkdir(dirname(joined), { recursive: true });
      await Deno.writeTextFile(joined, content);
    }),
  );

  console.log(`Written ${Object.keys(files).length} files`);
}
