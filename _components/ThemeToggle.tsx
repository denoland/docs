export default function () {
  return (
    <button
      type="button"
      aria-label="toggle theme"
      className="shrink-0 h-9 aspect-square p-1 cursor-pointer rounded border border-transparent transition-colors duration-200 ease-in-out text-foreground-secondary hover:decoration-none hover:bg-background-secondary hover:border-background-tertiary flex flex-col items-center justify-start overflow-hidden"
      id="theme-toggle"
    >
      <img
        src="/img/light.svg"
        class="w-full block -translate-y-full dark:translate-y-0 transition-transform duration-200 easing-[0.86,0,0.07,1]"
      />
      <img
        src="/img/dark.svg"
        class="w-full block -translate-y-full dark:translate-y-0 transition-transform duration-200 easing-[0.86,0,0.07,1]"
      />
      <span class="sr-only">Toggle Theme</span>
    </button>
  );
}

export const js = `
import "/js/darkmode.client.js";
import "/js/darkmode-toggle.client.js";
`;
