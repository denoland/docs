export default function () {
  return (
    <>
      <button
        type="button"
        id="hamburger-button"
        class="h-8 w-auto py-2 px-0 flex flex-col justify-between rounded md:hidden"
        aria-pressed="false"
      >
        <span className="hamburger-bar hamburger-bar--top"></span>
        <span className="hamburger-bar hamburger-bar--middle"></span>
        <span className="hamburger-bar hamburger-bar--bottom"></span>
        <span class="sr-only">Toggle navigation menu</span>
      </button>
    </>
  );
}

export const css = "@import './_components/Hamburger.css';";
