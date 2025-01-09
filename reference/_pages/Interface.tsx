import { DocNodeInterface } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = {
  data: DocNodeInterface & HasFullName;
  context: ReferenceContext;
};

export default function* getPages(
  item: DocNodeInterface & HasFullName,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <Interface data={item} context={context} />,
  };
}

export function Interface({ data, context }: Props) {
  const isUnstable = data.jsDoc?.tags?.some((tag) =>
    tag.kind === "experimental" as string
  );

  const jsDocParagraphs = data.jsDoc?.doc?.split("\n\n").map((paragraph) => (
    <p>{paragraph}</p>
  ));

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: data.fullName,
      }}
    >
      <h1>Interface: {data.fullName}</h1>
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
