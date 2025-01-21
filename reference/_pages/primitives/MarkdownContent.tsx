import { markdownRenderer } from "../../../_config.markdown.ts";
import { insertLinkCodes } from "./LinkCode.tsx";

export function MarkdownContent(
  { text }: { text: string | undefined | null },
) {
  if (!text) {
    return null;
  }

  const renderedDescription = markdownRenderer.render(text);
  const withCustomSubstitutions = replaceCustomTokens(renderedDescription);
  const withLinkCode = insertLinkCodes(withCustomSubstitutions);

  const paragraphs = withLinkCode
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const elements = paragraphs.map((paragraph, index) => (
    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}>
    </p>
  ));

  return <>{elements}</>;
}

function replaceCustomTokens(contents: string) {
  // Deno compatibility note
  contents = contents.replace(
    /<p>:::(\w+)\s+([^\n<]+)<\/p>([^]*?)<p>:::<\/p>/g,
    (match, type, title, content) => {
      return `<div class="admonition ${type}">
                <div class="title">${title}</div>
                ${content}
              </div>`;
    },
  );

  return contents;
}
