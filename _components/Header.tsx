export default function Header({
  url,
  hasSidebar,
}: {
  url: string;
  hasSidebar?: boolean;
}) {
  const reference = url.startsWith("/api");
  return (
    <header
      class={`bg-white shadow z-30 ${
        reference ? "" : "sticky top-0 left-0 right-0"
      }`}
    >
      <nav class="p-4 py-3 md:px-6 min-h-16 flex items-center justify-between">
        <div class="flex items-center">
          {hasSidebar && (
            <button class="mr-2 lg:hidden" id="sidebar-open">
              <svg
                width="24"
                height="24"
                viewBox="0 0 30 30"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  d="M4 7h22M4 15h22M4 23h22"
                >
                </path>
              </svg>
            </button>
          )}
          <a class="flex gap-2.5 mr-5" href="/">
            <div class="block w-24 h-auto">
              <img src="/img/deno-docs.svg" alt="Deno Docs" />
            </div>
            {/* custom font size for logo */}
          </a>
          <HeaderItem
            url={url}
            activeOn="/runtime"
            href="/runtime/"
            name="Runtime Manual"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/examples"
            href="/examples"
            name="Examples"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/api"
            href="/api/deno"
            name="API reference"
            hideOnMobile
          />
          <span class="hidden lg:inline-block text-gray-300 mx-2">//</span>
          <HeaderItem
            url={url}
            activeOn="/deploy"
            href="/deploy/manual"
            name="Deploy"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/subhosting"
            href="/subhosting/manual"
            name="Subhosting"
            hideOnMobile
          />
        </div>

        <div class="flex items-center gap-2">
          <HeaderItem
            url={url}
            href="https://deno.com"
            name="deno.com"
            external
            hideOnMobile
          />
          <div class="min-w-[150px] md:w-32 xl:w-64">
            <orama-search-button />
            <orama-search-box />
          </div>
        </div>
      </nav>

      {reference &&
        (
          <nav className="px-4 md:px-6 pt-2 pb-3 text-sm bg-white flex items-center justify-between border-box border-t border-gray-200 z-[1000]">
            <ul className="flex">
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/deno"
                  href="/api/deno"
                  name="Deno APIs"
                  firstItem={true}
                />
              </li>
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/web"
                  href="/api/web"
                  name="Web APIs"
                />
              </li>
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/node"
                  href="/api/node"
                  name="Node APIs"
                />
              </li>
            </ul>
          </nav>
        )}
    </header>
  );
}

function HeaderItem({
  url,
  activeOn,
  href,
  name,
  external,
  hideOnMobile,
  firstItem,
}: {
  url: string;
  activeOn?: string;
  href: string;
  name: string;
  external?: boolean;
  hideOnMobile?: boolean;
  firstItem?: boolean;
}) {
  return (
    <a
      class={`${
        firstItem ? "ml-0" : ""
      } mx-1 px-2 text-md hover:text-primary hover:bg-blue-50 ring-1 ring-transparent hover:ring-blue-100 hover:rounded transition-colors duration-200 ease-in-out text-nowrap flex items-center ${
        activeOn && url.startsWith(activeOn)
          ? "text-primary mx-2.5 px-0.5 underline font-semibold underline-offset-[6px] decoration-primary/20"
          : ""
      } ${hideOnMobile ? "max-lg:!hidden" : ""}`}
      href={href}
    >
      {name}
      {external &&
        (
          <svg
            width="10"
            height="10"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="inline  ml-2"
          >
            <path
              fill="currentColor"
              d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
            >
            </path>
          </svg>
        )}
    </a>
  );
}
