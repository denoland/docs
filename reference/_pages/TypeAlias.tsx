import { DocNodeTypeAlias } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = {
  data: DocNodeTypeAlias & HasFullName;
  context: ReferenceContext;
};

export default function* getPages(
  item: DocNodeTypeAlias & HasFullName,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <TypeAlias data={item} context={context} />,
  };
}

export function TypeAlias({ data, context }: Props) {
  return (
    <ReferencePage
      context={context}
      navigation={{ category: context.packageName, currentItemName: data.name }}
    >
      I am a type alias, my name is {data.name}

      {data.jsDoc?.doc && <p>{data.jsDoc?.doc}</p>}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
