export default function HeaderItem({
  url,
  active,
  href,
  name,
  hideOnMobile,
  firstItem,
}: {
  url: string;
  active: boolean;
  href: string;
  name: string;
  hideOnMobile?: boolean;
  firstItem?: boolean;
}) {
  return (
    <a
      className={`relative block py-1.5 px-1.5 text-base text-foreground-primary leading-snug rounded ring-1 ring-transparent hover:ring-background-tertiary hover:bg-background-secondary transition-colors duration-200 ease-in-out select-none current:bg-background-tertiary font-normal 
      ${hideOnMobile ? "max-xl:!hidden" : ""}
      ${active ? "current:text-blue-500 current:font-semibold" : ""}`}
      href={href}
    >
      {name}
    </a>
  );
}
