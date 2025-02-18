import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContents({ data, toc }: {
  data: Lume.Data;
  toc: TableOfContentsItem_[];
}) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <ul className="toc-list toc-desktop" id="toc">
      {toc.map((item: TableOfContentsItem_) => (
        <data.comp.TableOfContentsItem item={item} />
      ))}
    </ul>
  );
}

export const css = `@import './_components/TableOfContents.css';`;
