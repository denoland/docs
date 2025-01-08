import { DocNode, DocNodeImport } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNode };

export default function* getPages(
  item: DocNodeImport,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/${item.name.toLocaleLowerCase()}.import`,
    content: <Import data={item} />,
  };
}

export function Import({ data }: Props) {
  return (
    <ReferencePage>
      I am a Import, my name is {data.name}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
