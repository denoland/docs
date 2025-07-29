import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export default function TableOfContentsItem(
  props: { item: TableOfContentsItem_ },
) {
  return (
    <li class="m-2 leading-4">
      <a
        href={`#${props.item.slug}`}
        className="text-[0.8125rem] text-foreground-secondary hover:text-primary transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text.replaceAll(/ \([0-9/]+?\)/g, "")}
      </a>
      {props.item.children.length > 0 && (
        <ul class="ml-2">
          {props.item.children.map((item) => (
            <TableOfContentsItem item={item} />
          ))}
        </ul>
      )}
    </li>
  );
}
