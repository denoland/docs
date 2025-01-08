import { DocNodeNamespace } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import factoryFor from "../pageFactory.ts";

type Props = { data: DocNodeNamespace; context: ReferenceContext };

export default function* getPages(
  item: DocNodeNamespace,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/${item.name.toLocaleLowerCase()}`,
    content: <Namespace data={item} context={context} />,
  };

  for (const element of item.namespaceDef.elements) {
    const factory = factoryFor(element);

    yield* factory(element, {
      ...context,
      dataCollection: item.namespaceDef.elements,
      parentName: item.name,
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
    <div>
      <h1>Namespace: {context.section} - {data.name}</h1>

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
    </div>
  );
}
