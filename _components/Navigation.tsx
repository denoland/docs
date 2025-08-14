export default function (
  { data, currentUrl, currentSection, hasSubNav }: {
    data: Lume.Data;
    currentUrl: string;
    currentSection: string;
    hasSubNav: boolean;
  },
) {
  const sectionData = getSectionData(data, currentUrl);

  if (!sectionData || sectionData.length === 0) {
    return null;
  }

  return (
    <>
      <aside
        className={`fixed transition-all duration-200 md:duration-0 easing-[cubic-bezier(0.165,0.84,0.44,1)] -translate-x-full z-50 w-full bg-background-raw opacity-0 p-4 pb-8 overflow-auto text-smaller md:sticky md:overflow-y-auto md:[scrollbar-width:thin] md:z-10 md:!translate-x-0 md:!opacity-100 md:p-0 md:pb-16 lg:border-r lg:border-r-foreground-tertiary lg:w-full sidebar-open:translate-x-0 sidebar-open:opacity-100
         ${
          hasSubNav
            ? "top-header-plus-subnav h-screen-minus-both"
            : "top-header h-screen-minus-header"
        }`}
        data-component="sidebar-nav"
        data-section={currentSection}
        id="nav"
        style="scrollbar-width: none;"
        tabIndex={-1}
      >
        <data.comp.SidebarNav
          sectionData={sectionData}
          currentUrl={currentUrl}
        />
      </aside>
    </>
  );
}

function getSectionData(data: Lume.Data, currentUrl: string) {
  // Maps section data from reference_gen pages
  if (data.page?.data?.data?.categories_panel) {
    const categoryPanel = data.page.data.data.categories_panel;
    const childItems = categoryPanel.categories;

    childItems.push({
      name: `All ${categoryPanel.total_symbols} symbols`,
      href: categoryPanel.all_symbols_href,
      active: currentUrl.includes("all_symbols"),
    });

    const sectionData = [{
      name: "Categories",
      href: "/reference",
      items: childItems,
    }];

    return sectionData;
  }

  // Extract path segments from the URL
  const urlSegments = currentUrl.split("/").filter(Boolean);

  // Check for more specific sidebar data first (like /deploy/early-access/)
  if (urlSegments.length > 1) {
    const specificPath = `/${urlSegments[0]}/${urlSegments[1]}/`;
    const specificSidebar = data.search.data(specificPath)?.sidebar;

    if (specificSidebar) {
      return specificSidebar;
    }
  }

  // Fall back to the default behavior using just the first segment
  const dataPath = urlSegments[0];
  return data.search.data(`/${dataPath}/`)?.sidebar;
}
