export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  if (reference) {
    return (
      <div>
        {props.children}
      </div>
    );
  }

  return (
    <>
      {props.sidebar && (
        <>
          <aside
            class="absolute top-0 bottom-0 -left-74 sidebar-open:left-0 w-74 border-r border-gray-200 bg-white z-50 lg:hidden transition-all"
            id="sidebar"
            data-open="false"
          >
            <div class="p-4 shadow-sm flex justify-between h-16">
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
                  width="21"
                  height="21"
                  class="text-gray-600"
                >
                  <g stroke="currentColor" stroke-width="1.2">
                    <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
                  </g>
                </svg>
              </button>
            </div>
            <props.comp.Sidebar
              sidebar={props.sidebar}
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
        </>
      )}
      <div
        class="absolute top-16 bottom-0 left-0 right-0 overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        {props.children}
        <props.comp.Footer />
      </div>
    </>
  );
}
