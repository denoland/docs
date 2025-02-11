export default function (data: Lume.Data) {
  const dataPath = data.currentUrl?.split("/")[1];
  const sectionData = data.search.data(`/${dataPath}/`)?.sidebar;

  if (!sectionData || sectionData.length === 0) {
    return null;
  }

  return (
    <>
      <data.comp.Hamburger />
      <div className="nav">
        <data.comp.MainNav currentSection={data.currentSection} />
        <data.comp.SecondaryNav
          sectionData={sectionData}
          currentUrl={data.currentUrl}
        />
      </div>
    </>
  );
}

export const css = "@import './_components/Navigation.css';";
