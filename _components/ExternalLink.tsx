export default function ExternalLink(
  { href, children }: { href: string; children: string },
) {
  return (
    <a
      href={href}
      className="external"
      target="_blank"
    >
      {children}
    </a>
  );
}

export const css = "@import './_components/ExternalLink.css';";
