export default function Header({ currentUrl }: { currentUrl: string }) {
  const reference = currentUrl.startsWith("/api");
  return (
    <>
      {reference &&
        (
          <nav className="refheader">
            <ul className="flex">
              <li>
                <a
                  className="blocklink refheader-link"
                  data-active={currentUrl.includes("/api/deno")}
                  href="/api/deno"
                >
                  Deno APIs
                </a>
              </li>
              <li>
                <a
                  className="blocklink refheader-link"
                  data-active={currentUrl.includes("/api/web")}
                  href="/api/web"
                >
                  Web APIs
                </a>
              </li>
              <li>
                <a
                  className="blocklink refheader-link"
                  data-active={currentUrl.includes("/api/node")}
                  href="/api/node"
                >
                  Node APIs
                </a>
              </li>
            </ul>
          </nav>
        )}
    </>
  );
}

export const css = "@import './_components/RefHeader.css';";
