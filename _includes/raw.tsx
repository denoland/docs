export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  return (
    <>
      {props.sidebar && (
        <>
          <aside
            class="fixed top-0 bottom-0 -left-74 sidebar-open:left-0 w-74 border-r border-foreground-tertiary bg-background-primary z-50 xl:hidden transition-all"
            id="sidebar"
            data-open="false"
          >
            <div class="p-4 flex justify-between h-16">
              <a class="flex items-center gap-3 mr-6" href="/">
                <img
                  src="/img/logo.svg"
                  class="block size-6"
                  alt=""
                  aria-hidden="true"
                />
                <b class="text-xl">
                  <span class="sr-only">Deno</span> Docs
                </b>
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
                  class="text-foreground-secondary"
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
            class="fixed inset-0 backdrop-brightness-50 z-40 hidden sidebar-open:block sidebar-open:xl:hidden"
            id="sidebar-cover"
            data-open="false"
          >
          </div>
        </>
      )}
      <div style={{ scrollbarGutter: "stable" }}>
        {props.children}
        {reference && <props.comp.ToTop />}
        {!reference && <props.comp.Footer />}
      </div>
    </>
  );
}
