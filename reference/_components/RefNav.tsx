export default function (data: Lume.Data, url: string) {
  return (
    <nav className="px-4 md:px-6 py-3 text-sm bg-background-primary flex items-center justify-between border-box border border-foreground-tertiary z-[1000]">
      <ul className="flex">
        <li>
          <data.comp.HeaderItem
            url={url}
            activeOn="/api/deno"
            href="/api/deno"
            name="Deno APIs"
            firstItem={true}
          />
        </li>
        <li>
          <data.comp.HeaderItem
            url={url}
            activeOn="/api/web"
            href="/api/web"
            name="Web APIs"
          />
        </li>
        <li>
          <data.comp.HeaderItem
            url={url}
            activeOn="/api/node"
            href="/api/node"
            name="Node APIs"
          />
        </li>
      </ul>
    </nav>
  );
}
