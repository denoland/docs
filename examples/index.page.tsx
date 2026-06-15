import { walkSync } from "@std/fs/walk";
import { parseExample } from "./utils/parseExample.ts";

export const layout = "raw.tsx";

export const toc = [];

/** First sentence of a description, for the landing page cards. Strips any
 * HTML markup, and skips a leading "Warning: ..." sentence (used by unstable
 * API examples) when a real description follows it. */
function firstSentence(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const normalized = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length === 0) return undefined;

  let rest = normalized;
  const sentences = [];
  while (rest.length > 0) {
    const sentence = rest.match(/^.*?[.!?](?=\s|$)/)?.[0];
    if (!sentence) {
      sentences.push(rest);
      break;
    }
    sentences.push(sentence);
    rest = rest.slice(sentence.length).trim();
  }

  const informative = sentences.find((s) => !/^warning[:\s]/i.test(s));
  return informative ?? sentences[0];
}

export default function* (
  data: Lume.Data,
) {
  // One-sentence description per item href, sourced from the example
  // scripts' doc comments and the tutorial/video pages' frontmatter.
  const descriptions: Record<string, string> = {};

  for (const file of walkSync("./examples/scripts/", { exts: [".ts"] })) {
    const content = Deno.readTextFileSync(file.path);
    const label = file.name.replace(".ts", "");
    const parsed = parseExample(file.name, content);
    const description = firstSentence(parsed.description);
    if (description) {
      descriptions[`/examples/${label}/`] = description;
    }
  }

  for (const page of data.search.pages("url^=/examples/")) {
    const description = firstSentence(page.description as string | undefined);
    if (description && typeof page.url === "string") {
      descriptions[page.url] = description;
    }
  }

  yield {
    url: `/examples/`,
    title: `Deno examples and tutorials`,
    content: <data.comp.LandingPage descriptions={descriptions} />,
  };
}
