import { DocNodeClass } from "@deno/doc/types";
import { CodeIcon } from "./CodeIcon.tsx";
import { MarkdownContent } from "../primitives/MarkdownContent.tsx";
import { HasNamespace, SymbolDoc } from "../../types.ts";

export function SymbolSummaryItem(
  { item }: { item: SymbolDoc },
) {
  const displayName = item.fullName || item.name;
  const firstLine = item.data.jsDoc?.doc?.split("\n\n")[0];

  return (
    <div className={"namespaceItem"}>
      <CodeIcon glyph={item.data.kind} />
      <div className={"namespaceItemContent"}>
        <a href={`~/${displayName}`}>
          {displayName}
        </a>
        <MarkdownContent text={firstLine} />
        <MethodLinks item={item} />
      </div>
    </div>
  );
}

function MethodLinks({ item }: { item: SymbolDoc }) {
  if (item.data.kind !== "class") {
    return <></>;
  }

  const asClass = item.data as DocNodeClass & HasNamespace;
  const methods = asClass.classDef.methods.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filteredMethodsList = [
    "[Symbol.dispose]",
    "[Symbol.asyncDispose]",
    "[Symbol.asyncIterator]",
  ];

  const filteredMethods = methods.filter((method) =>
    !filteredMethodsList.includes(method.name)
  );

  const methodLinks = filteredMethods.map((method) => {
    return (
      <li>
        <a href={`~/${asClass.fullName}#${method.name}`}>
          {method.name}
        </a>
      </li>
    );
  });

  return (
    <ul className={"namespaceItemContentSubItems"}>
      {methodLinks}
    </ul>
  );
}
