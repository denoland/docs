export default function CTA(
  { href, children, type }: { href: string; children: string; type: string },
) {
  return (
    <a href={href} className={`docs-cta ${type}-cta`}>
      {children}
    </a>
  );
}

export const css = "@import './_components/CTA.css';";
