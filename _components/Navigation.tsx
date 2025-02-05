export default function (data: Lume.Data) {
  return (
    <>
      <data.comp.Hamburger />
      <nav className="nav">
        <a href="#">
          <h2>Getting Started</h2>
        </a>
        <a href="#">Installation</a>
      </nav>
    </>
  );
}

export const css = "@import './_components/Navigation.css';";
