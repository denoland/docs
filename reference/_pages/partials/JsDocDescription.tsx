import { JsDoc } from "@deno/doc/types";
import { DetailedSection } from "./DetailedSection.tsx";
import { MarkdownContent } from "../primitives/MarkdownContent.tsx";

export function JsDocDescription({ jsDoc }: { jsDoc: JsDoc | undefined }) {
  if (!jsDoc?.doc) {
    return null;
  }

  return (
    <DetailedSection>
      <MarkdownContent text={jsDoc?.doc || ""} />
    </DetailedSection>
  );
}
