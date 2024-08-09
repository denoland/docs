import Searcher from "lume/core/searcher.ts";
import {
  Sidebar as Sidebar_,
  SidebarDoc as SidebarDoc_,
  SidebarItem,
  SidebarLink as SidebarLink_,
  TableOfContentsItem as TableOfContentsItem_,
} from "../types.ts";

export const layout = "layout.tsx";

export default function Page(props: Lume.Data, helpers: Lume.Helpers) {
  const sidebar = props.sidebar as Sidebar_;
  if (sidebar === undefined) {
    throw new Error("Missing sidebar for " + props.url);
  }

  function walk(
    sidebarItems: SidebarItem[],
  ): [SidebarItem[], number] | undefined {
    for (let i = 0; i < sidebarItems.length; i++) {
      const sidebarItem = sidebarItems[i];
      if (typeof sidebarItem === "string") {
        const data = props.search.data(sidebarItem)!;
        if (!data) {
          throw new Error(`No data found for ${sidebarItem}`);
        }

        if (data.url == props.url) {
          return [sidebarItems, i];
        }
      } else if ("id" in sidebarItem && sidebarItem.id === props.url) {
        return [sidebarItems, i];
      } else if ("items" in sidebarItem) {
        const results = walk(sidebarItem.items);
        if (results) {
          return results;
        }
      }
    }
  }

  let parentNavigation: SidebarItem[] | undefined = undefined;
  let index: number | undefined = undefined;
  for (const sidebarElement of sidebar) {
    const items = walk(sidebarElement.items);

    if (items) {
      [parentNavigation, index] = items;
      break;
    }
  }

  return (
    <>
      <aside
        class="lg:block absolute top-0 lg:top-16 bottom-0 -left-74 lg:left-0 sidebar-open:left-0 w-74 border-r border-gray-200 bg-white z-50 lg:z-0 transition-all"
        id="sidebar"
        data-open="false"
      >
        <div class="lg:hidden p-4 shadow-sm flex justify-between h-16">
          <a class="flex items-center gap-3 mr-6" href="/">
            <div class="block size-6">
              <img src="/img/logo.svg" alt="Deno Docs" />
            </div>
            <b class="text-xl">Docs</b>
          </a>
          <button
            type="button"
            aria-label="Close navigation bar"
            id="sidebar-close"
          >
            <svg
              viewBox="0 0 15 15"
              width="16"
              height="16"
              class="text-gray-600"
            >
              <g stroke="currentColor" stroke-width="1.2">
                <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
              </g>
            </svg>
          </button>
        </div>
        <props.comp.Sidebar
          sidebar={sidebar}
          search={props.search}
          url={props.url}
        />
      </aside>
      <div
        class="absolute inset-0 backdrop-brightness-50 z-40 hidden sidebar-open:block sidebar-open:lg:hidden"
        id="sidebar-cover"
        data-open="false"
      >
      </div>
      <div
        class="absolute top-16 bottom-0 left-0 right-0 lg:left-74 overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <main class="mx-auto max-w-screen-xl w-full pt-4 pb-8 flex flex-grow">
          <div class="flex-grow px-4 sm:px-5 md:px-6 max-w-full lg:max-w-[75%]">
            <article class="max-w-[66ch]">
              <Breadcrumbs
                title={props.title!}
                sidebar={sidebar}
                url={props.url}
                sectionTitle={props.sectionTitle!}
                sectionHref={props.sectionHref!}
              />
              {props.toc && props.toc.length > 0 && (
                <details class="block lg:hidden my-4 bg-gray-100 rounded-md group">
                  <summary class="px-4 py-2 group-open:border-b border-gray-300">
                    On this page
                  </summary>
                  <ul class="pl-1 py-1.5">
                    {props.toc.map((item: TableOfContentsItem_) => (
                      <TableOfContentsItemMobile item={item} />
                    ))}
                  </ul>
                </details>
              )}
              <div class="markdown-body mt-4 lg:mt-8">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: helpers.md(props.title!, true),
                  }}
                >
                </h1>
                {props.available_since && (
                  <div class="bg-gray-200 rounded-md text-sm py-3 px-4 mb-4 font-semibold">
                    Available since {props.available_since}
                  </div>
                )}
                {props.children}
              </div>
            </article>
            {parentNavigation && (
              <nav class="grid gap-8 grid-cols-2 max-w-[66ch] items-center justify-between mt-6">
                <div>
                  {parentNavigation[index! - 1] && (
                    <NavigationButton
                      item={parentNavigation[index! - 1]}
                      search={props.search}
                      direction="prev"
                    />
                  )}
                </div>
                <div>
                  {parentNavigation[index! + 1] && (
                    <NavigationButton
                      item={parentNavigation[index! + 1]}
                      search={props.search}
                      direction="next"
                    />
                  )}
                </div>
              </nav>
            )}
          </div>
          <div class="hidden lg:block flex-shrink-0 basis-[30%] flex-grow-0 px-8 pb-8">
            <div id="toc" class="py-2 top-8 sticky">
              <ul class="mt-8 border-l border-gray-200 py-2 pl-2">
                {(props.toc as TableOfContentsItem_[]).map((item) => (
                  <TableOfContentsItem item={item} />
                ))}
              </ul>
            </div>
          </div>
        </main>
        <props.comp.Footer />
      </div>
    </>
  );
}

function NavigationButton(
  props: { item: SidebarItem; search: Searcher; direction: "prev" | "next" },
) {
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
        direction={props.direction}
      />
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
        <span className="font-semibold flex-shrink truncate">
          {item.label}
        </span>
        {props.direction === "next" && <>&raquo;</>}
      </div>
    </a>
  );
}

function Breadcrumbs(
  props: {
    title: string;
    sidebar: Sidebar_;
    url: string;
    sectionTitle: string;
    sectionHref: string;
  },
) {
  const crumbs = [];
  outer: for (const section of props.sidebar) {
    for (const item of section.items) {
      if (typeof item === "string") {
        if (item === props.url) break outer;
      } else if ("items" in item) {
        crumbs.push(item.label);
        for (const subitem of item.items) {
          if (typeof subitem === "string") {
            if (subitem === props.url) break outer;
          } else if (subitem.id === props.url) {
            break outer;
          }
        }
        crumbs.pop();
      } else if ("id" in item && item.id === props.url) {
        break outer;
      }
    }
  }

  crumbs.push(props.title);

  return (
    <nav class="mb-3">
      <ul class="flex flex-wrap text-gray-700 items-center">
        <li class="pr-3 py-1.5 underline underline-offset-4 hover:no-underline hover:text-blue-600 transition duration-100">
          <a href={props.sectionHref}>{props.sectionTitle}</a>
        </li>
        <svg
          class="size-6 rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="rgba(0,0,0,0.5)"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          />
        </svg>
        {crumbs.map((crumb, i) => (
          <>
            <li class="px-2.5 py-1.5">
              {crumb}
            </li>
            {i < crumbs.length - 1 && (
              <svg
                class="size-6 rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="rgba(0,0,0,0.5)"
                  d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
                >
                </path>
              </svg>
            )}
          </>
        ))}
      </ul>
    </nav>
  );
}

function TableOfContentsItem(props: { item: TableOfContentsItem_ }) {
  return (
    <li class="m-2 leading-4">
      <a
        href={`#${props.item.slug}`}
        class="text-[13px] text-gray-600 hover:text-indigo-600 transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text}
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

function TableOfContentsItemMobile(props: { item: TableOfContentsItem_ }) {
  return (
    <li class="my-1.5 mx-3">
      <a
        href={`#${props.item.slug}`}
        class="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text}
      </a>
      {props.item.children.length > 0 && (
        <ul class="ml-2">
          {props.item.children.map((item) => (
            <TableOfContentsItemMobile item={item} />
          ))}
        </ul>
      )}
    </li>
  );
}
