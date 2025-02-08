import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContents({ data, toc }: {
  data: Lume.Data;
  toc: TableOfContentsItem_[];
}) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <details>
      <summary>
        On this page
      </summary>

      <ul>
        {toc.map((item: TableOfContentsItem_) => (
          <data.comp.TableOfContentsItem item={item} />
        ))}
      </ul>
    </details>
  );
}
