import type { Searcher } from "https://cdn.jsdelivr.net/gh/lumeland/lume@864fb83b508b4164afa8cedef100db672b883152/core/searcher";
import type { SidebarItem, SidebarDoc as SidebarDoc_, SidebarLink as SidebarLink_ } from "../types.ts";

export function NavigationButton(props: {
  item: SidebarItem;
  search: Searcher;
  direction: "prev" | "next";
}) {
  let item: SidebarDoc_ | SidebarLink_;
  if (typeof props.item === "string") {
    const data = props.search.data(props.item)!;
    if (!data) {
      throw new Error(`No data found for ${props.item}`);
    }
    item = {
      label: data.sidebar_title ?? data.title!,
      id: data.url!,
    };
  } else if ("items" in props.item) {
    return (
      <NavigationButton 
        item={props.item.items[0]}
        search={props.search}
        direction={props.direction} />
    );
  } else {
    item = props.item;
  }
  const directionText = props.direction === "prev" ? "Prev" : "Next";
  const alignmentClass = props.direction === "prev"
    ? "items-start"
    : "items-end";

  return (
    <a 
      className={`flex flex-col py-3 px-6 ${alignmentClass} border border-gray-000 hover:border-blue-700 hover:bg-blue-50/10 transition-colors duration-300 transition-timing-function cubic-bezier(0.4, 0, 0.2, 1) rounded`}
      href={"id" in item ? item.id : "href" in item ? item.href : undefined}
    >
      <span className="text-sm text-gray-2">{directionText}</span>
      <div className="flex flex-row max-w-full items-center text-blue-500 gap-2">
        {props.direction === "prev" && <>&laquo;</>}
        <span className="font-semibold flex-shrink truncate">{item.label}</span>
        {props.direction === "next" && <>&raquo;</>}
      </div>
    </a>
  );
}
