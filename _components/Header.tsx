export default function Header({
  url,
  hassidebar,
}: {
  url: string;
  hassidebar?: boolean;
}) {
  const reference = url.startsWith("/api");
  return (
    <div
      class={`bg-white shadow z-30 ${
        reference ? "" : "sticky top-0 left-0 right-0"
      }`}
    >
      <nav class="px-4 md:px-6 py-3 h-16 flex items-center justify-between">
        <div class="flex items-center">
          {hassidebar && (
            <button class="mr-2 lg:hidden" id="sidebar-open">
              <svg
                width="30"
                height="30"
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
          <a class="flex items-center gap-3 mr-6" href="/">
            <div class="block size-6">
              <img src="/img/logo.svg" alt="Deno Docs" />
            </div>
            <b class="text-xl">Docs</b>
          </a>
          <HeaderItem
            url={url}
            activeOn="/runtime"
            href="/runtime/manual"
            name="Deno Runtime"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/deploy"
            href="/deploy/manual"
            name="Deno Deploy"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/subhosting"
            href="/subhosting/manual"
            name="Subhosting"
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
            name="Reference APIs"
            hideOnMobile
          />
        </div>
        <div class="flex items-center">
          <HeaderItem
            url={url}
            href="https://deno.com"
            name="deno.com"
            external
            hideOnMobile
          />
          <div class="w-[100px] lg:w-[150px]">
            <orama-search-button />
            <orama-searchbox />
          </div>
        </div>
      </nav>

      {reference &&
        (
          <nav className="px-4 pt-2 pb-3 bg-white flex items-center justify-between border-box border-t border-gray-200 z-[1000]">
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
    </div>
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
      class={`mt-1 ${
        firstItem ? "ml-0" : ""
      } mx-2.5 px-0.5 text-sm hover:text-primary flex items-center ${
        activeOn && url.startsWith(activeOn)
          ? "text-primary border-b-2 border-primary"
          : "border-b-2 border-transparent"
      } ${hideOnMobile ? "max-lg:!hidden" : ""}`}
      href={href}
    >
      {name}
      {external &&
        (
          <svg
            width="13.5"
            height="13.5"
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

declare module "npm:preact" {
  namespace JSX {
    interface IntrinsicElements {
      "orama-searchbox": unknown;
      "orama-search-button": unknown;
    }
  }
}
