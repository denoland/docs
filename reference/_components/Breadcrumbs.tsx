import type { BreadcrumbCtx } from "@deno/doc";

export default function (
  { parts }: { comp: any; parts: BreadcrumbCtx[] },
) {
  const pathParts: BreadcrumbCtx[] = [];
  const symbolParts: BreadcrumbCtx[] = [];

  for (const part of parts) {
    if (part.is_symbol) {
      symbolParts.push(part);
    } else {
      pathParts.push(part);
    }
  }

  return (
    <ul class="flex flex-wrap text-foreground-secondary items-center -ml-3">
      {pathParts.map((part, i) => {
        const isLast =
          !(i !== (pathParts.length - 1) || symbolParts.length > 0);

        return (
          <>
            {renderPart(part, isLast)}
            {!isLast && (
              <li>
                <svg
                  class="size-4 text-foreground-secondary rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
                  >
                  </path>
                </svg>
              </li>
            )}
          </>
        );
      })}

      {symbolParts.length > 0 && (
        <span>
          {symbolParts.map((part, i) => {
            const isLast = i === (symbolParts.length - 1);

            return (
              <>
                {renderPart(part, isLast)}
                {!isLast && <span>.</span>}
              </>
            );
          })}
        </span>
      )}
    </ul>
  );
}

function renderPart(part: BreadcrumbCtx, isLast: boolean) {
  return (
    <li className="block px-3 py-1.5 text-sm">
      {isLast ? part.name : (
        <a
          href={part.href}
          className="py-1.5 underline underline-offset-4 decoration-foreground-tertiary hover:text-foreground-secondary hover:underline-medium hover:bg-foreground-tertiary dark:hover:bg-background-secondary dark:hover:text-foreground-primary rounded transition duration-100 text-sm"
        >
          {part.name}
        </a>
      )}
    </li>
  );
}
