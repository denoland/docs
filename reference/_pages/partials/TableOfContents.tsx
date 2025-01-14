import React from "npm:@preact/compat";

export function TableOfContents({ children }: { children: React.ReactNode }) {
  return (
    <div class="toc">
      <div>
        <nav class="documentNavigation">
          <h3>Document Navigation</h3>
          {children}
        </nav>
      </div>
    </div>
  );
}

export function TocListItem(
  { item, type }: { item: { name: string }; type: string },
) {
  return (
    <li>
      <a href={`#${type}_${item.name}`} title={item.name}>
        {item.name}
      </a>
    </li>
  );
}

export function TocSection(
  { title, children }: { title: string; children: React.ReactNode },
) {
  if (children === undefined) {
    return null;
  }

  if (Array.isArray(children) && children.length === 0) {
    return null;
  }

  return (
    <ul>
      <li>
        <a href={"#" + title.toLocaleLowerCase()} title={title}>{title}</a>
      </li>
      <li>
        <ul>
          {children}
        </ul>
      </li>
    </ul>
  );
}
