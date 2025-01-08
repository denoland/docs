import { DocNodeInterface } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNodeInterface; context: ReferenceContext };

export default function* getPages(
  item: DocNodeInterface,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const prefix = context.parentName ? `${context.parentName}.` : "";

  yield {
    title: item.name,
    url: `${context.root}/${context.section.toLocaleLowerCase()}/~/${prefix}${item.name}`,
    content: <Interface data={item} context={context} />,
  };
}

export function Interface({ data, context }: Props) {
  const fullName = context.parentName
    ? `${context.parentName}.${data.name}`
    : data.name;

  const isUnstable = data.jsDoc?.tags?.some((tag) =>
    tag.kind === "experimental" as string
  );

  const jsDocParagraphs = data.jsDoc?.doc?.split("\n\n").map((paragraph) => (
    <p>{paragraph}</p>
  ));

  return (
    <ReferencePage>
      <h1>Interface: {fullName}</h1>
      {isUnstable && <p>UNSTABLE</p>}
      {jsDocParagraphs && jsDocParagraphs}

      <h2>Constructors</h2>

      <h2>Properties</h2>

      <h2>Methods</h2>

      <h2>Static Methods</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
