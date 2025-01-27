import type { DocBlockSubtitleClassValueCtx } from "@deno/doc";

export default function (
  { subtitle }: { subtitle: DocBlockSubtitleClassValueCtx },
) {
  return (
    <>
      {subtitle.implements && (
        <div>
          <span className="type">implements</span>
          {subtitle.implements.map((impl, i) => (
            <>
              {/*typedef rendering*/}
              <span dangerouslySetInnerHTML={{ __html: impl }} />
              {i !== (subtitle.implements.length - 1) && <span>,</span>}
            </>
          ))}
        </div>
      )}

      {subtitle.extends && (
        <div>
          <span class="type">extends</span>
          {subtitle.extends.href
            ? (
              <a class="link" href={subtitle.extends.href}>
                {subtitle.extends.symbol}
              </a>
            )
            : subtitle.extends.symbol}
          <span
            dangerouslySetInnerHTML={{ __html: subtitle.extends.type_args }}
          />{" "}
          {/*typedef rendering*/}
        </div>
      )}
    </>
  );
}
