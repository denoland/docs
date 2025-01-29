import type { DocNodeKindCtx } from "@deno/doc";

export default function ({ kinds }: { kinds: DocNodeKindCtx[] }) {
  return (
    <div className="docNodeKindIcon">
      {kinds.map((item, index) => (
        <div
          key={index}
          className={`text-${item.kind} bg-${item.kind}/15`}
          title={item.title}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
}
