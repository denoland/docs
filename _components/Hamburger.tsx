export default function () {
  const commonClasses =
    `block w-6 h-[2px] bg-foreground-primary duration-200 ease-[cubic-bezier(0.77,0,0.175,1)]`;
  return (
    <>
      <button
        type="button"
        id="hamburger-button"
        class="h-8 w-auto py-2 px-0 flex flex-col justify-between rounded md:hidden"
        aria-pressed="false"
      >
        <div
          className={`${commonClasses} transition-transform hamburger-bar--top`}
        />
        <div
          className={`${commonClasses} transition-opacity hamburger-bar--middle`}
        />
        <div
          className={`${commonClasses} transition-transform hamburger-bar--bottom`}
        />
        <span class="sr-only">Toggle navigation menu</span>
      </button>
    </>
  );
}
