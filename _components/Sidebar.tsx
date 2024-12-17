import Searcher from "lume/core/searcher.ts";
import {
  Sidebar as Sidebar_,
  SidebarCategory as SidebarCategory_,
  SidebarDoc as SidebarDoc_,
  SidebarLink as SidebarLink_,
  SidebarSection as SidebarSection_,
} from "../types.ts";

export default function Sidebar(
  props: {
    sidebar: Sidebar_;
    search: Searcher;
    url: string;
    headerPath: string;
  },
) {
  return (
    <nav
      class="overflow-y-auto overflow-x-hidden"
      style={{ scrollbarGutter: "stable", scrollbarWidth: "thin" }}
    >
      <ul className="xl:hidden border-bg-tertiary relative bg-background-secondary m-2 mt-0 mb-4 py-2 rounded-md border border-background-tertiary">
        <SidebarTopNav
          name="Runtime"
          url="/runtime/"
          currentPath={props.url}
        />
        <SidebarTopNav
          name="API reference"
          url="/api/deno/"
          currentPath={props.url}
        />
        <SidebarTopNav
          name="Examples"
          url="/examples/"
          currentPath={props.url}
        />
        <SidebarTopNav
          name="Deploy"
          url="/deploy/"
          currentPath={props.url}
        />
        <SidebarTopNav
          name="Subhosting"
          url="/subhosting/"
          currentPath={props.url}
        />
      </ul>
      <ul>
        {props.sidebar.map((section) => (
          <SidebarSection
            section={section}
            search={props.search}
            url={props.url}
            headerPath={props.headerPath}
          />
        ))}
      </ul>
    </nav>
  );
}

function SidebarSection(
  props: {
    section: SidebarSection_;
    search: Searcher;
    url: string;
    headerPath: string;
  },
) {
  const slugify = (str: string) =>
    str.replaceAll(/[\s_]/g, "-")
      .replaceAll(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
  const slug = "-" + slugify(props.section.title ?? "");
  const categoryTitle = `sidebar-category${slug}`;
  const headingLink = props.section.href;

  return (
    <li class="mb-4">
      {props.section.title && (
        headingLink
          ? (
            <a href={headingLink}>
              <h2
                id={categoryTitle}
                class="border-b border-foreground-tertiary pt-2 pb-1.5 -mx-5 px-8 mb-2 text-sm font-semibold hover:bg-background-secondary current:bg-background-secondary current:text-blue-500 text-foreground-primary capitalize"
                aria-current={props.url === headingLink ? "page" : undefined}
              >
                {props.section.title}
              </h2>
            </a>
          )
          : (
            <h2
              id={categoryTitle}
              class="border-b border-foreground-tertiary pt-2 pb-0.5 -mx-5 px-8 mb-3 text-sm font-semibold text-foreground-primary capitalize"
            >
              {props.section.title}
            </h2>
          )
      )}{" "}
      <ul aria-labelledby={categoryTitle} class="mb-4">
        {props.section.items.map((item) => (
          <li class="mx-2">
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
  "block px-3 py-1.5 text-[.8125rem] leading-4 font-normal text-foreground-secondary rounded-md ring-1 ring-transparent hover:ring-background-tertiary hover:bg-background-secondary current:bg-background-secondary current:text-blue-500 current:font-semibold transition-colors duration-200 ease-in-out select-none";

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
    <li class="mx-2">
      <a
        class={LINK_CLASS}
        href={"id" in item ? item.id : "href" in item ? item.href : undefined}
        aria-current={("id" in item &&
            (item.id === props.url || item.id + "/" === props.url))
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
    return typeof item === "object" && "id" in item && item.id === props.url;
  });

  return (
    <>
      <button
        class={LINK_CLASS + " flex justify-between items-center w-full" +
          (containsCurrent ? " !text-blue-500" : "")}
        data-accordion-trigger
      >
        {props.item.label}
        <svg
          class="transition duration-300 text-foreground-secondary size-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{
            transform: containsCurrent ? "rotate(180deg)" : "rotate(90deg)",
          }}
        >
          <path
            fill="currentColor"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          >
          </path>
        </svg>
      </button>
      <ul
        class={`ml-2 ${containsCurrent ? "" : "hidden"}`}
        data-accordion-content
      >
        {props.item.items.map((item) => (
          typeof item === "object" && "items" in item
            ? (
              <SidebarCategory
                item={item}
                search={props.search}
                url={props.url}
              />
            )
            : (
              <SidebarItem
                item={item}
                search={props.search}
                url={props.url}
              />
            )
        ))}
      </ul>
    </>
  );
}

function SidebarTopNav(
  props: { name: string; url: string; currentPath: string },
) {
  const isCurrentlyActivePath = props.currentPath.startsWith(props.url);
  return (
    <li class="mx-2">
      <a
        class={`relative block py-1.5 px-1.5 text-base text-foreground-primary leading-snug rounded ring-1 ring-transparent hover:ring-background-tertiary hover:bg-background-secondary transition-colors duration-200 ease-in-out select-none current:bg-background-tertiary ${
          isCurrentlyActivePath ? "font-semibold" : "font-normal"
        }`}
        href={props.url}
        aria-current={isCurrentlyActivePath ? "page" : undefined}
      >
        {props.name}
      </a>
    </li>
  );
}
