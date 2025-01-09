import { DocNodeNamespace } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import generatePageFor from "../pageFactory.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNodeNamespace; context: ReferenceContext };

export default function* getPages(
  item: DocNodeNamespace,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/${item.name.toLocaleLowerCase()}`,
    content: <Namespace data={item} context={context} />,
  };

  for (const element of item.namespaceDef.elements) {
    yield* generatePageFor(element, {
      ...context,
      symbols: item.namespaceDef.elements,
    });
  }
}

export function Namespace({ data, context }: Props) {
  const interfaces = data.namespaceDef.elements.filter((elements) =>
    elements.kind === "interface"
  );

  const classes = data.namespaceDef.elements.filter((elements) =>
    elements.kind === "class"
  );

  return (
    <ReferencePage
      context={context}
      navigation={{ category: context.packageName, currentItemName: data.name }}
    >
      <h1>Namespace: {context.packageName} - {data.name}</h1>

      <h2>Classes</h2>
      <ul>
        {classes.map((classDef) => (
          <li>
            <a href={`~/${data.name}.${classDef.name}`}>
              {data.name}.{classDef.name}
            </a>
          </li>
        ))}
      </ul>

      <h2>Interfaces</h2>
      <ul>
        {interfaces.map((interfaceDef) => (
          <li>
            <a href={`~/${data.name}.${interfaceDef.name}`}>
              {data.name}.{interfaceDef.name}
            </a>
          </li>
        ))}
      </ul>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
