import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContents({ data, toc }: {
  data: Lume.Data;
  toc: TableOfContentsItem_[];
}) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <details class="toc-mobile block xl:hidden my-4 bg-background-secondary rounded-md group">
      <summary class="px-4 py-2 group-open:border-b border-foreground-tertiary">
        On this page
      </summary>

      <ul className="toc-list">
        {toc.map((item: TableOfContentsItem_) => (
          <data.comp.TableOfContentsItem item={item} />
        ))}
      </ul>
    </details>
  );
}
