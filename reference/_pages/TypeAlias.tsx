import { DocNodeTypeAlias } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNodeTypeAlias };

export default function* getPages(
  item: DocNodeTypeAlias,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const prefix = context.parentName ? `${context.parentName}.` : "";
  yield {
    title: item.name,
    url: `${context.root}/${context.section.toLocaleLowerCase()}/~/${prefix}${item.name}`,
    content: <TypeAlias data={item} />,
  };
}

export function TypeAlias({ data }: Props) {
  return (
    <ReferencePage>
      I am a type alias, my name is {data.name}

      {data.jsDoc?.doc && <p>{data.jsDoc?.doc}</p>}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
