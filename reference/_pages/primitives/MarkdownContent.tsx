import { markdownRenderer } from "../../../_config.markdown.ts";
import { insertLinkCodes } from "./LinkCode.tsx";

export function MarkdownContent(
  { text }: { text: string | undefined | null },
) {
  if (!text) {
    return null;
  }

  const renderedDescription = markdownRenderer.render(text);
  const withLinkCode = insertLinkCodes(renderedDescription);

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
