import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContents({ data, toc }: {
  data: Lume.Data;
  toc: TableOfContentsItem_[];
}) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <details class="block lg:hidden my-4 bg-foreground-quaternary rounded-md group">
      <summary class="px-4 py-2 group-open:border-b border-background-tertiary">
        On this page
      </summary>

      <ul className="p-4 pt-2">
        {toc.map((item: TableOfContentsItem_) => (
          <data.comp.TableOfContentsItem item={item} />
        ))}
      </ul>
    </details>
  );
}
