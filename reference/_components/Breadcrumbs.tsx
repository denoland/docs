import type { BreadcrumbCtx } from "@deno/doc";

export default function (
  // deno-lint-ignore no-explicit-any
  { comp, parts, hasSubNav }: {
    comp: any;
    parts: BreadcrumbCtx[];
    hasSubNav?: boolean;
  },
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

  const topClass = hasSubNav ? "top-header-plus-subnav" : "top-header";

  return (
    <ul
      className={`breadcrumbs sticky ${topClass} w-full p-4 !pl-0 m-0 bg-background-raw z-10`}
    >
      {pathParts.map((part, i) => {
        const isLast =
          !(i !== (pathParts.length - 1) || symbolParts.length > 0);

        return (
          <>
            {renderPart(part, isLast)}
            {!isLast && (
              <span className="text-[#0F172A]">
                <comp.Arrow />
              </span>
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
    <li>
      {isLast
        ? part.name
        : <a href={part.href} className="contextLink">{part.name}</a>}
    </li>
  );
}
