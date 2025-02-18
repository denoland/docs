export default function HeaderItem({
  url,
  activeOn,
  href,
  name,
  external,
  hideOnMobile,
  firstItem,
}: {
  url: string;
  activeOn?: string;
  href: string;
  name: string;
  external?: boolean;
  hideOnMobile?: boolean;
  firstItem?: boolean;
}) {
  return (
    <a
      class={`${
        firstItem ? "ml-0" : ""
      } mx-1 px-2 text-md hover:bg-background-secondary ring-1 ring-transparent hover:ring-background-tertiary hover:rounded transition-colors duration-200 ease-in-out text-nowrap flex items-center ${
        activeOn
          ? "text-primary underline font-semibold underline-offset-[6px] decoration-primary/20"
          : "[letter-spacing:0.2px]"
      } ${hideOnMobile ? "max-xl:!hidden" : ""}`}
      href={href}
    >
      {name}
      {external &&
        (
          <svg
            width="10"
            height="10"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="inline  ml-2"
          >
            <path
              fill="currentColor"
              d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
            >
            </path>
          </svg>
        )}
    </a>
  );
}
