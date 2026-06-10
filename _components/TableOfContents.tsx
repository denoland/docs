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
    <div
      className={`hidden sticky ${topClasses} h-screen-minus-header border-l border-l-foreground-tertiary lg:flex lg:flex-col lg:w-full`}
    >
      <p className="px-4 pt-4 pb-2 uppercase text-smaller font-bold tracking-wide text-foreground-secondary">
        This page
      </p>
      <ul
        className="toc-list overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col flex-1 min-h-0 px-4 pr-2 pb-4"
        id="toc"
      >
        {toc.map((item: TableOfContentsItem_) => (
          <data.comp.TableOfContentsItem item={item} />
        ))}
      </ul>
    </div>
  );
}
