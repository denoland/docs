import type { ToCEntry } from "@deno/doc";

export default function (
  { documentNavigation, documentNavigationStr }: {
    documentNavigation: ToCEntry[];
    documentNavigationStr: string | null;
  },
) {
  if (documentNavigation.length === 0) {
    return null;
  }

  // TODO: dont use the string version, but rather use the implementation below.
  //  needs reworking since it doesnt properly work
  if (documentNavigationStr) {
    return (
      <aside className="toc hidden xl:block fixed top-16 right-0 w-74 h-full overflow-y-auto px-4 sm:px-5 md:px-6">
          <nav
            className="documentNavigation border-l border-foreground-tertiary dark:border-background-tertiary py-2 pl-2"
            dangerouslySetInnerHTML={{ __html: documentNavigationStr }}
          />
      </aside>
    );
  }

  /*
  let currentLevel = Math.min(
    ...documentNavigation.map((entry) => entry.level),
  );

  const elementsStack: (ToCEntryWithChildren[])[] = [[]];
  let itemsAtThisLevel: ToCEntryWithChildren[] = elementsStack[0];

  for (const entry of documentNavigation) {
    while (entry.level > currentLevel) {
      const newSubItems: ToCEntryWithChildren[] = [];

      itemsAtThisLevel[elementsStack.length - 1] ??= {
        anchor: entry.anchor,
        content: entry.content,
        children: null,
      };

      itemsAtThisLevel[elementsStack.length - 1].children = newSubItems;
      elementsStack.push(newSubItems);
      itemsAtThisLevel = newSubItems;
      currentLevel++;
    }

    while (entry.level < currentLevel) {
      elementsStack.pop();
      itemsAtThisLevel = elementsStack[elementsStack.length - 1];
      currentLevel--;
    }

    itemsAtThisLevel.push({
      anchor: entry.anchor,
      content: entry.content,
      children: null,
    });
  }

  return (
    <div className="toc">
      <div>
        <nav className="documentNavigation">
          {renderItems(elementsStack[0])}
        </nav>
      </div>
    </div>
  );*/
}
/*

interface ToCEntryWithChildren {
  children: ToCEntryWithChildren[] | null;
  content: string;
  anchor: string;
}

function renderItems(items: ToCEntryWithChildren[]) {
  return (
    <ul>
      {items.map((item) => (
        <li>
          <a href={`#${item.anchor}`} title={item.content}>
            {item.content}
          </a>
          {item.children ? renderItems(item.children) : null}
        </li>
      ))}
    </ul>
  );
}
*/
