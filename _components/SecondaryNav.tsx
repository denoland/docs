export default function (data: Lume.Data) {
  return (
    <nav aria-labelledby="section-navigation">
      <h2 className="sub-nav-heading">
        <a href="#" className="sub-nav-heading-link">Heading</a>
      </h2>
      <ul className="sub-nav">
        <li>
          <a href="#" className="sub-nav-link blocklink">Item</a>
        </li>
        <li>
          <a href="#" className="sub-nav-link blocklink">Item</a>
        </li>
        <li>
          <a href="#" className="sub-nav-link blocklink">Item</a>
        </li>
      </ul>
    </nav>
  );
}

export const css = "@import './_components/SecondaryNav.css';";
