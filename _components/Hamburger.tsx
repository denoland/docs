export default function () {
  return (
    <>
      <label htmlFor="hamburger" className="hamburger-label">
        <span class="hamburger-bar hamburger-bar--top"></span>
        <span class="hamburger-bar hamburger-bar--middle"></span>
        <span class="hamburger-bar hamburger-bar--bottom"></span>
      </label>
      <input type="checkbox" id="hamburger" className="hamburger-checkbox" />
    </>
  );
}

export const css = "@import './_components/Hamburger.css';";
