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
      <data.comp.Hamburger />
      <div className="nav" data-section={currentSection} id="nav">
        <data.comp.MainNav currentSection={currentSection} />
        <data.comp.SecondaryNav
          sectionData={sectionData}
          currentUrl={currentUrl}
        />
      </div>
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

  const dataPath = currentUrl?.split("/")[1];
  return data.search.data(`/${dataPath}/`)?.sidebar;
}

export const css = "@import './_components/Navigation.css';";
