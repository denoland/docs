import { DocNode, DocNodeModuleDoc } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";

type Props = { data: DocNode };

export default function* getPages(
  item: DocNodeModuleDoc,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/${item.name.toLocaleLowerCase()}`,
    content: <Module data={item} />,
  };

  console.log("Module found", item);
}

export function Module({ data }: Props) {
  return (
    <div>
      I am a module, my name is {data.name}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
