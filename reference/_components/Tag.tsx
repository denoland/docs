import type { Tag } from "@deno/doc";

export default function ({ tag, large }: { tag: Tag; large: boolean }) {
  return (
    <div
      className={`text-${tag.kind} border border-${tag.kind}/50 bg-${tag.kind}/5 inline-flex items-center gap-0.5 flex-none rounded-md leading-none ${
        large ? "font-bold py-2 px-3" : "text-sm py-1 px-2"
      }`}
    >
      {large
        ? (
          tag.value
            ? (
              tag.kind === "permissions"
                ? (
                  <span className="space-x-2">
                    {tag.value.map((item, index) => (
                      <>
                        <span>{item}</span>
                        {index < tag.value.length - 1 && (
                          <div className="inline border-l-2 border-stone-300" />
                        )}
                      </>
                    ))}
                  </span>
                )
                : (
                  tag.value
                )
            )
            : (
              tag.kind
            )
        )
        : (
          tag.value || tag.kind
        )}
    </div>
  );
}
