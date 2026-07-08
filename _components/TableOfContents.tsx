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
  // Use MAX-height, not a fixed height: a short TOC then collapses to its own
  // content height so the (fixed-height, viewport-tall) sidebar keeps the grid
  // row taller than the TOC, giving `position: sticky` room to hold. A fixed
  // height made the TOC fill the whole row on short pages (e.g. /deploy/), so it
  // had no slack and scrolled out of view. Long TOCs still cap at the viewport
  // and scroll internally. Offset must be subtracted so the cap fits below the
  // header (+ subnav).
  const maxHeightClass = hasSubNav
    ? "max-h-[calc(100dvh-var(--header-height)-var(--subnav-height))]"
    : "max-h-[calc(100dvh-var(--header-height))]";

  return (
    <div
      className={`hidden sticky ${topClasses} ${maxHeightClass} border-l border-l-foreground-tertiary lg:flex lg:flex-col lg:w-full`}
    >
      <p className="px-4 pt-4 pb-2 md:pt-7 uppercase text-smaller font-bold tracking-wide text-foreground-secondary">
        This page
      </p>
      <ul
        className="toc-list overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden flex flex-col flex-1 min-h-0 px-4 pr-2 pb-4"
        id="toc"
      >
        {toc.map((item: TableOfContentsItem_) => (
          <data.comp.TableOfContentsItem item={item} />
        ))}
      </ul>
    </div>
  );
}
