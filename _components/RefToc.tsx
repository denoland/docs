import type { ToCEntry } from "@deno/doc";

interface ToCEntryWithChildren {
  children: ToCEntryWithChildren[] | null;
  content: string;
  anchor: string;
}

function renderItems(items: ToCEntryWithChildren[]) {
  return (
    <ul>
      {items.map((item) => (
        <li class="m-2 mr-0 leading-4 text-balance">
          <a
            href={`#${item.anchor}`}
            title={item.content}
            className="text-smaller lg:text-foreground-secondary hover:text-primary transition-colors duration-200 ease-in-out select-none"
          >
            {item.content}
          </a>
          {item.children && item.children.length > 0 && (
            <ul class="ml-2">
              {renderItems(item.children)}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function (
  { documentNavigation, documentNavigationStr }: {
    documentNavigation: ToCEntry[];
    documentNavigationStr: string | null;
  },
) {
  if (documentNavigation.length === 0) {
    return;
  }

  // TODO: dont use the string version, but rather use the implementation below.
  //  needs reworking since it doesnt properly work
  if (documentNavigationStr) {
    return (
      <div
        className="toc-list sticky p-4 pr-0 h-screen-minus-header overflow-y-auto border-l border-l-foreground-tertiary top-header"
        id="toc"
      >
        <nav
          className="documentNavigation toc-desktop"
          dangerouslySetInnerHTML={{ __html: documentNavigationStr }}
        />
      </div>
    );
  }

  // Fallback: build the navigation manually with proper styling
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
    <div
      className="toc-list hidden sticky p-4 pr-0 h-screen-minus-header overflow-y-auto border-l border-l-foreground-tertiary lg:block lg:w-full top-header"
      id="toc"
    >
      {renderItems(elementsStack[0])}
    </div>
  );
}
