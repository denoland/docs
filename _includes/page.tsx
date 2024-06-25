import Searcher from "lume/core/searcher.ts";
import {
  Sidebar as Sidebar_,
  SidebarCategory as SidebarCategory_,
  SidebarDoc as SidebarDoc_,
  SidebarItem as SidebarItem_,
  SidebarLink as SidebarLink_,
  SidebarSection as SidebarSection_,
} from "../types.ts";

export const layout = "layout.tsx";

export default function Page(props: Lume.Data, helpers: Lume.Helpers) {
  const sidebar = props.sidebar as Sidebar_;
  return (
    <>
      <aside class="fixed top-12 bottom-0 left-0 h-(calc(100vh-3rem)) w-74 border-r border-gray-200">
        {sidebar && (
          <Sidebar sidebar={sidebar} search={props.search} url={props.url} />
        )}
      </aside>
      <div class="ml-74 relative">
        <main class="mx-auto max-w-screen-xl">
          {props.children}
        </main>
        <props.comp.Footer />
      </div>
    </>
  );
}

function Sidebar(props: { sidebar: Sidebar_; search: Searcher; url: string }) {
  return (
    <nav
      class="pt-2 p-2 overflow-y-auto h-full"
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
      <h3 class="border-b border-gray-200 uppercase pt-2 pb-0.5 mx-3 my-4 text-xs font-semibold text-gray-3">
        {props.section.title}
      </h3>
      <ul>
        {props.section.items.map((item) => (
          <li class="mx-3 mt-1">
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
  "block px-3 py-1.5 text-[.8125rem] h-8 font-semibold text-gray-500 rounded-md hover:bg-pink-100 current:bg-gray-100 current:text-indigo-600/70 transition-colors duration-200 ease-in-out";

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
      label: data.title!,
      id: data.url!,
    };
  } else {
    item = props.item;
  }

  return (
    <li class="mx-3 mt-1">
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
  return (
    <>
      <div
        class={LINK_CLASS}
      >
        {props.item.label}
      </div>
      <ul class="ml-3">
        {props.item.items.map((item) => (
          <SidebarItem item={item} search={props.search} url={props.url} />
        ))}
      </ul>
    </>
  );
}
