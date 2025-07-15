export default function (
  { data, currentUrl, currentSection }: {
    data: Lume.Data;
    currentUrl: string;
    currentSection: string;
  },
) {
  const sectionData = getSectionData(data, currentUrl);

  if (!sectionData || sectionData.length === 0) {
    return null;
  }

  return (
    <>
      <aside className="nav" data-section={currentSection} id="nav">
        <data.comp.MainNav currentSection={currentSection} />
        <data.comp.SecondaryNav
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
      name: `View all ${categoryPanel.total_symbols} symbols`,
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

export const css = "@import './_components/Navigation.css';";
