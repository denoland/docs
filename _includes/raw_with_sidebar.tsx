import Logo from "../_components/Logo.tsx";
import { Sidebar as Sidebar_, SidebarItem } from "../types.ts";
import { NavigationButton } from "../_components/NavigationButton.tsx";
import renderCommand from "./renderCommand.tsx";

export const layout = "layout.tsx";

export default function Page(props: Lume.Data, helpers: Lume.Helpers) {
  const sidebar = props.sidebar as Sidebar_;
  const file = props.page.sourcePath;
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

  let renderedCommand = null;

  if (props.command) {
    const { rendered, toc } = renderCommand(props.command, helpers);
    renderedCommand = rendered;
    props.toc = toc.concat(...props.toc);
  }

  const checkIsHub = /^\/learn\/$/;
  const isLearnHub = checkIsHub.test(props.url);

  return (
    <>
      <aside
        className={`flex flex-col absolute top-0 xl:top-16 bottom-0 -translate-x-74 xl:left-0 sidebar-open:translate-x-0 w-74 border-r border-foreground-tertiary bg-background-primary z-50 xl:z-0 xl:translate-x-0 transition-transform ${
          isLearnHub && "xl:hidden"
        }`}
        id="sidebar"
        data-open="false"
      >
        <div class="xl:hidden p-4 shadow-sm flex justify-between h-16">
          <a class="flex items-center gap-3 mr-6" href="/">
            <Logo />
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
              class="text-foreground-secondary"
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
          headerPath={props.headerPath!}
        />
      </aside>
      <div
        class="absolute inset-0 backdrop-brightness-50 z-40 hidden sidebar-open:block sidebar-open:xl:hidden"
        id="sidebar-cover"
        data-open="false"
      >
      </div>
      <div
        class="absolute top-0 bottom-0 left-0 right-0 xl:left-74 overflow-y-auto xl:grid xl:grid-cols-7 xl:gap-8 max-w-screen-2xl mx-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <div
          class="absolute top-16 bottom-0 left-0 right-0 overflow-y-auto"
          style={{ scrollbarGutter: "stable" }}
        >
          {props.children}
          {props.comp.Feedback({ file })}
          <div class="xl:col-span-full mt-4">
            <props.comp.Footer />
          </div>
        </div>
      </div>
    </>
  );
}
