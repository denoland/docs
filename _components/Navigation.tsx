export default function (data: Lume.Data) {
  return (
    <>
      <data.comp.Hamburger />
      <div className="nav">
        <data.comp.MainNav currentUrl={data.currentUrl} />
        <data.comp.SecondaryNav />
        <data.comp.SecondaryNav />
      </div>
    </>
  );
}

export const css = "@import './_components/Navigation.css';";
