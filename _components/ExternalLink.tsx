export const css = `
.external {
    display: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    border: 1px solid transparent;
    transition: all 200ms ease-in-out;
    color: var(--foreground-secondary);
    &:hover {
        text-decoration: none;
        background-color: var(--background-secondary);
        border-color: var(--background-tertiary);
    }
}
@media (min-width: 650px) {
    .external {
        display: block;
    }
}
`;

export default function ExternalLink({ href, children }) {
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
