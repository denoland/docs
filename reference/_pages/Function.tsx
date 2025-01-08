import { DocNodeFunction, DocNodeImport } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";

type Props = { data: DocNodeFunction };

export default function* getPages(
  item: DocNodeFunction,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const prefix = context.parentName ? `${context.parentName}.` : "";

  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/~/${prefix}${item.name}`,
    content: <Function data={item} />,
  };
}

export function Function({ data }: Props) {
  return (
    <div>
      I am a function, my name is {data.name}

      {data.jsDoc?.doc && <p>{data.jsDoc?.doc}</p>}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
