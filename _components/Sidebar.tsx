import Searcher from "lume/core/searcher.ts";
import {
  Sidebar as Sidebar_,
  SidebarCategory as SidebarCategory_,
  SidebarDoc as SidebarDoc_,
  SidebarLink as SidebarLink_,
  SidebarSection as SidebarSection_,
} from "../types.ts";

export default function Sidebar(
  props: { sidebar: Sidebar_; search: Searcher; url: string },
) {
  return (
    <nav
      class="pt-2 pb-8 p-2 pr-0 overflow-y-auto h-[calc(100%-2rem)]"
      style={{ scrollbarGutter: "stable", scrollbarWidth: "thin" }}
    >
      <ul>
        {props.sidebar.map((section) => (
          <SidebarSection
            section={section}
            search={props.search}
            url={props.url}
          />
        ))}
      </ul>
    </nav>
  );
}

function SidebarSection(
  props: { section: SidebarSection_; search: Searcher; url: string },
) {
  return (
    <li class="mb-4">
      {props.section.title &&
        (
          <h3 class="border-b border-gray-200 uppercase pt-2 pb-0.5 mx-3 mt-4 mb-3 text-xs font-semibold text-gray-3">
            {props.section.title}
          </h3>
        )}
      <ul>
        {props.section.items.map((item) => (
          <li class="mx-2 mt-1">
            {typeof item === "object" && "items" in item
              ? (
                <SidebarCategory
                  item={item}
                  url={props.url}
                  search={props.search}
                />
              )
              : (
                <SidebarItem
                  item={item}
                  search={props.search}
                  url={props.url}
                />
              )}
          </li>
        ))}
      </ul>
    </li>
  );
}

const LINK_CLASS =
  "block px-3 py-1.5 text-[.8125rem] leading-4 font-normal text-gray-500 rounded-md hover:bg-blue-50 current:bg-blue-50 current:text-blue-500 transition-colors duration-200 ease-in-out select-none";

function SidebarItem(props: {
  item: string | SidebarDoc_ | SidebarLink_;
  search: Searcher;
  url: string;
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
  } else {
    item = props.item;
  }

  return (
    <li class="mx-2 mt-1">
      <a
        class={LINK_CLASS}
        href={"id" in item ? item.id : "href" in item ? item.href : undefined}
        aria-current={("id" in item && item.id === props.url)
          ? "page"
          : undefined}
      >
        {item.label}
      </a>
    </li>
  );
}

function SidebarCategory(props: {
  item: SidebarCategory_;
  search: Searcher;
  url: string;
}) {
  const containsCurrent = props.item.items.some((item) => {
    if (typeof item === "string") {
      return item === props.url;
    }
    return item.id === props.url;
  });

  return (
    <>
      <div
        class={LINK_CLASS + " flex justify-between items-center" +
          (containsCurrent ? " !text-blue-500" : "")}
        data-accordion-trigger
      >
        {props.item.label}
        <svg
          class="transition duration-300 size-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{
            transform: containsCurrent ? "rotate(180deg)" : "rotate(90deg)",
          }}
        >
          <path
            fill="rgba(0,0,0,0.5)"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          >
          </path>
        </svg>
      </div>
      <ul
        class={`ml-2 ${containsCurrent ? "" : "hidden"}`}
        data-accordion-content
      >
        {props.item.items.map((item) => (
          <SidebarItem item={item} search={props.search} url={props.url} />
        ))}
      </ul>
    </>
  );
}
