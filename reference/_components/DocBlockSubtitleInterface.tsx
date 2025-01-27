import type { DocBlockSubtitleInterfaceValueCtx } from "@deno/doc";

export default function (
  { subtitle }: { subtitle: DocBlockSubtitleInterfaceValueCtx },
) {
  return (
    <div>
      <span className="type">extends</span>
      {subtitle.extends.map((item, i) => (
        <>
          <span dangerouslySetInnerHTML={{ __html: item }} />{" "}
          {/*typedef rendering*/}
          {i !== (subtitle.length - 1) && <span>,</span>}
        </>
      ))}
    </div>
  );
}
