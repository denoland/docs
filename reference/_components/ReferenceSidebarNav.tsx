// deno-lint-ignore-file no-explicit-any
export default function ReferenceSidebarNav(data: Lume.Data) {
  const currentUrl = data.currentUrl.replace(/\/$/, "").replace(/\/\.\//g, "/");
  const apiCategories = data.apiCategories;

  const apiSections = [
    {
      title: "Deno APIs",
      key: "deno",
      basePath: "/api/deno",
      categoryLabel: "Deno APIs by category",
      items: [
        { href: "/api/deno", title: "Deno specific APIs" },
        {
          href: "/api/deno/all_symbols",
          title: "All Deno symbols",
          isBottom: true,
        },
      ],
    },
    {
      title: "Web APIs",
      key: "web",
      basePath: "/api/web",
      categoryLabel: "Web APIs by category",
      items: [
        { href: "/api/web", title: "Web Platform Support" },
        {
          href: "/api/web/all_symbols",
          title: "All web symbols",
          isBottom: true,
        },
      ],
    },
    {
      title: "Node APIs",
      key: "node",
      basePath: "/api/node",
      categoryLabel: "Node APIs by namespace",
      items: [
        { href: "/api/node", title: "Node support in deno" },
        {
          href: "/api/node/all_symbols",
          title: "All node symbols",
          isBottom: true,
        },
      ],
    },
  ];

  return (
    <>
      {apiSections.map((section) => (
        <ApiSection
          key={section.key}
          section={section}
          currentUrl={currentUrl}
          apiCategories={apiCategories}
        />
      ))}
    </>
  );
}

function ApiSection({ section, currentUrl, apiCategories }: {
  section: any;
  currentUrl: string;
  apiCategories: any;
}) {
  const topItems = section.items.filter((item: any) => !item.isBottom);
  const bottomItems = section.items.filter((item: any) => item.isBottom);

  // Check if current URL is a category page in this section
  const categories = apiCategories?.[section.key]?.categories || [];
  const getCategoryUrl = (categoryName: string, basePath: string) => {
    if (categoryName === "I/O") {
      return `${basePath}/io`;
    }
    return `${basePath}/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const isCategoryActive = categories.some((categoryName: string) => {
    const href = apiCategories[section.key]?.getCategoryHref?.(categoryName) ||
      getCategoryUrl(categoryName, section.basePath);
    return href.replace(/\/$/, "") === currentUrl;
  });

  return (
    <nav>
      <SidebarCategoryHeading title={section.title} />
      <SidebarList>
        {/* Main section items */}
        {topItems.map((item: any) => (
          <li key={item.href}>
            <SidebarItem
              href={item.href}
              title={item.title}
              isActive={item.href.replace(/\/$/, "") === currentUrl}
            />
          </li>
        ))}

        {/* Category accordion */}
        <li>
          <button
            type="button"
            data-accordion-toggle={`${section.key}APIs`}
            data-active={isCategoryActive}
            className="sub-nav-toggle block relative py-1 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transform after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute w-full text-left"
          >
            {section.categoryLabel}
          </button>
          <SidebarList>
            <CategoryItems
              section={section}
              apiCategories={apiCategories}
              currentUrl={currentUrl}
            />
          </SidebarList>
        </li>

        {/* Bottom items (All symbols) */}
        {bottomItems.map((item: any) => {
          const isActive = item.href.replace(/\/$/, "") === currentUrl;
          return (
            <li key={item.href}>
              <SidebarItem
                href={item.href}
                title={item.title}
                isActive={isActive}
              />
            </li>
          );
        })}
      </SidebarList>
    </nav>
  );
}

function CategoryItems({ section, apiCategories, currentUrl }: {
  section: any;
  apiCategories: any;
  currentUrl: string;
}) {
  const categories = apiCategories?.[section.key]?.categories || [];

  const getCategoryUrl = (categoryName: string, basePath: string) => {
    // Special case for I/O -> io
    if (categoryName === "I/O") {
      return `${basePath}/io`;
    }
    return `${basePath}/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return categories.map((categoryName: string) => {
    const href = apiCategories[section.key]?.getCategoryHref?.(categoryName) ||
      getCategoryUrl(categoryName, section.basePath);

    return (
      <li key={categoryName}>
        <SidebarItem
          href={href}
          title={categoryName}
          isActive={href.replace(/\/$/, "") === currentUrl}
        />
      </li>
    );
  });
}

function SidebarList(
  props: { children: any; className?: string },
) {
  return (
    <ul
      className={`p-0 list-none overflow-y-hidden ${props.className ?? ""}`}
    >
      {props.children}
    </ul>
  );
}

function SidebarItem(props: {
  title: string;
  href: string;
  isActive?: boolean;
}) {
  const defaultClasses =
    "block m-0 py-1 px-3 border-l hover:bg-header-highlight hover:border-foreground-secondary hover:text-gray-800 transition-colors duration-150";
  const activeClasses = props.isActive
    ? "bg-header-highlight border-foreground-secondary text-gray-800"
    : "border-foreground-tertiary";

  const combinedClasses = `${defaultClasses} ${activeClasses}`;

  return (
    <a
      href={props.href}
      className={combinedClasses}
      data-active={props.isActive}
    >
      {props.title}
    </a>
  );
}

function SidebarCategoryHeading(props: {
  title: string;
  href?: string;
  isActive?: boolean;
}) {
  if (props.href) {
    return (
      <h2 class="block uppercase py-2 pr-4 mt-4 !border-0">
        <a
          href={props.href}
          className={`text-foreground-secondary font-bold leading-none tracking-wide hover:text-primary transition-colors ${
            props.isActive ? "text-primary" : ""
          }`}
        >
          {props.title}
        </a>
      </h2>
    );
  }

  return (
    <h2 class="block uppercase py-2 pr-4 mt-4 text-foreground-secondary font-bold leading-[1.2] text-balance tracking-wide !border-0">
      {props.title}
    </h2>
  );
}

export const js = `import "/js/sidebar.client.js";`;
