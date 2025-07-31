import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContents({ data, toc, hasSubNav }: {
  data: Lume.Data;
  toc: TableOfContentsItem_[];
  hasSubNav: boolean;
}) {
  if (!toc || toc.length === 0) {
    return null;
  }
  const topClasses = hasSubNav ? "top-header-plus-subnav" : "top-header";

  return (
    <ul
      className={`toc-list hidden sticky p-4 pr-0 min-w-40 h-screen-minus-header overflow-y-auto border-l border-l-foreground-tertiary lg:block ${topClasses}`}
      id="toc"
    >
      {toc.map((item: TableOfContentsItem_) => (
        <data.comp.TableOfContentsItem item={item} />
      ))}
    </ul>
  );
}
