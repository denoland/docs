import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

// Show at most this many heading levels in the TOC. Deeper headings (3+ levels
// of nesting) add clutter without helping navigation, so we stop rendering them.
const MAX_TOC_DEPTH = 2;

export default function TableOfContentsItem(
  props: { item: TableOfContentsItem_; depth?: number },
) {
  const depth = props.depth ?? 1;
  return (
    <li className="leading-tight text-balance">
      <a
        href={`#${props.item.slug}`}
        className="block py-2 px-4 leading-none text-smaller lg:text-foreground-secondary hover:text-primary transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text.replaceAll(/ \([0-9/]+?\)/g, "")}
      </a>
      {depth < MAX_TOC_DEPTH && props.item.children.length > 0 && (
        <ul class="ml-2">
          {props.item.children.map((item) => (
            <TableOfContentsItem item={item} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
