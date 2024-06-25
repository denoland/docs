export default function Header({
  url,
}: {
  url: string;
}) {
  return (
    <nav class="px-8 py-2 sticky h-12 top-0 left-0 right-0 bg-white shadow flex items-center justify-between z-50">
      <div class="flex items-center">
        <a className="flex items-center gap-3 mr-6" href="/">
          <div className="block size-6">
            <img src="/img/logo.svg" alt="Deno Docs" />
          </div>
          <b className="text-xl">Docs</b>
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
        <HeaderItem url={url} activeOn="/api" href="/api" name="Reference" />
      </div>
      <div class="flex items-center">
        <HeaderItem
          url={url}
          href="https://deno.com"
          name="deno.com"
          external
        />

        <orama-searchbox />
      </div>
    </nav>
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
            className="inline  ml-2"
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
