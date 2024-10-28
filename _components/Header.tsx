import Logo from "./Logo.tsx";

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
      class={`bg-background-primary text-foreground-primary border-b border-foreground-tertiary z-30 ${
        reference ? "" : "sticky top-0 left-0 right-0"
      }`}
    >
      <nav class="p-4 py-3 md:px-6 min-h-16 flex items-center justify-between">
        <div class="flex items-center">
          {hasSidebar && (
            <button class="mr-2 xl:hidden" id="sidebar-open">
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
            <div class="w-auto h-9">
              <Logo />
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
          <span class="hidden xl:inline-block text-foreground-secondary mx-2">
            //
          </span>
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
          <div class="dark-mode-toggle">
            <button class="dark-mode-toggle button p-1 rounded bg-background-primary border border-foreground-secondary/20">
              <span class="dark:hidden">
                <svg
                  class="fill-foreground-primary w-5 h-5"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z">
                  </path>
                </svg>
              </span>
              <span class="hidden dark:block">
                <svg
                  class="fill-foreground-primary w-5 h-5"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1
                  0 100-2H3a1 1 0 000 2h1z"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                  </path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {reference &&
        (
          <nav className="px-4 md:px-6 py-3 text-sm bg-background-primary flex items-center justify-between border-box border-t border-foreground-tertiary z-[1000]">
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
      } mx-1 px-2 text-md hover:bg-background-secondary ring-1 ring-transparent hover:ring-background-tertiary hover:rounded transition-colors duration-200 ease-in-out text-nowrap flex items-center ${
        activeOn && url.startsWith(activeOn)
          ? "text-primary mx-2.5 px-0.5 underline font-semibold underline-offset-[6px] decoration-primary/20"
          : ""
      } ${hideOnMobile ? "max-xl:!hidden" : ""}`}
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
