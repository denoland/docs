export default function (
  { data, currentUrl, currentSection }: {
    data: Lume.Data;
    currentUrl: string;
    currentSection: string;
  },
) {
  const dataPath = currentUrl?.split("/")[1];
  let sectionData = data.search.data(`/${dataPath}/`)?.sidebar;

  if (data.page?.data?.data?.categories_panel) {
    sectionData = data.page.data.data.categories_panel.categories;
    //console.log(sectionData);
  }

  if (!sectionData || sectionData.length === 0) {
    return null;
  }

  return (
    <>
      <data.comp.Hamburger />
      <div className="nav">
        <data.comp.MainNav currentSection={currentSection} />
        <data.comp.SecondaryNav
          sectionData={sectionData}
          currentUrl={currentUrl}
        />
      </div>
    </>
  );
}

export const css = "@import './_components/Navigation.css';";
