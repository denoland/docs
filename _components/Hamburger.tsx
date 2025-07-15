export default function () {
  return (
    <>
      <label htmlFor="hamburger" className="hamburger-label">
        <span className="hamburger-bar hamburger-bar--top"></span>
        <span className="hamburger-bar hamburger-bar--middle"></span>
        <span className="hamburger-bar hamburger-bar--bottom"></span>
        <span class="sr-only">Toggle navigation menu</span>
        <input
          type="checkbox"
          id="hamburger"
          className="hamburger-checkbox sr-only"
        />
      </label>
    </>
  );
}

export const css = "@import './_components/Hamburger.css';";
