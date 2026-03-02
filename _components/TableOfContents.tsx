import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContents({ data, toc, hasSubNav, file }: {
  data: Lume.Data;
  toc: TableOfContentsItem_[];
  hasSubNav: boolean;
  file?: string;
}) {
  if (!toc || toc.length === 0) {
    return null;
  }
  const topClasses = hasSubNav ? "top-header-plus-subnav" : "top-header";

  return (
    <div
      className={`hidden sticky ${topClasses} h-screen-minus-header border-l border-l-foreground-tertiary lg:flex lg:flex-col lg:w-full`}
    >
      {file && !file.includes("[") && (
        <div class="px-4 pt-4 shrink-0">
          <data.comp.CopyPage file={file} />
        </div>
      )}
      <ul
        className="toc-list overflow-y-auto flex-1 p-4 pr-0"
        id="toc"
      >
        {toc.map((item: TableOfContentsItem_) => (
          <data.comp.TableOfContentsItem item={item} />
        ))}
      </ul>
    </div>
  );
}
