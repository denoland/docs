import type { TableOfContentsItem as TableOfContentsItem_ } from "../types.ts";

export function TableOfContentsItemMobile(
  props: { item: TableOfContentsItem_ },
) {
  return (
    <li class="my-1.5 mx-3">
      <a
        href={`#${props.item.slug}`}
        class="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text.replaceAll(/ \([0-9/]+?\)/g, "")}
      </a>
      {props.item.children.length > 0 && (
        <ul class="ml-2">
          {props.item.children.map((item: any) => (
            <TableOfContentsItemMobile item={item} />
          ))}
        </ul>
      )}
    </li>
  );
}
