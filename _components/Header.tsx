export default function Header({
  url,
}: {
  url: string;
}) {
  const reference = url.startsWith("/api");

  return (
    <div
      class={`bg-white shadow z-50 ${
        reference ? "" : "sticky top-0 left-0 right-0"
      }`}
    >
      <nav class="px-8 py-2 h-12 flex items-center justify-between">
        <div class="flex items-center">
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
          />
          <HeaderItem
            url={url}
            activeOn="/deploy"
            href="/deploy/manual"
            name="Deno Deploy"
          />
          <HeaderItem
            url={url}
            activeOn="/subhosting"
            href="/subhosting/manual"
            name="Subhosting"
          />
          <HeaderItem
            url={url}
            activeOn="/examples"
            href="/examples"
            name="Examples"
          />
          <HeaderItem
            url={url}
            activeOn="/api"
            href="/api/deno"
            name="Reference"
          />
        </div>
        <div class="flex items-center">
          <HeaderItem
            url={url}
            href="https://deno.com"
            name="deno.com"
            external
          />
        </div>
      </nav>

      {reference &&
        (
          <nav className="px-8 py-2 h-12 bg-white flex items-center justify-between border-box border-t border-gray-200 z-[1000]">
            <ul className="flex">
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/deno"
                  href="/api/deno"
                  name="Deno"
                />
              </li>
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/web"
                  href="/api/web"
                  name="Web"
                />
              </li>
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/node"
                  href="/api/node"
                  name="Node"
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
}: {
  url: string;
  activeOn?: string;
  href: string;
  name: string;
  external?: boolean;
}) {
  return (
    <a
      class={`mt-1 mx-2.5 px-0.5 hover:text-primary flex items-center ${
        activeOn && url.startsWith(activeOn)
          ? "text-primary border-b-2 border-primary"
          : "border-b-2 border-transparent"
      }`}
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
