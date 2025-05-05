import type { UsagesCtx } from "@deno/doc";

export default function ({ usages }: { usages: UsagesCtx | null }) {
  if (!usages?.usages?.[0]) {
    return null;
  }

  return (
    <div class="usageContent mb-4 px-4 pt-4 pb-5 bg-stone-100 rounded border border-gray-300">
      <h3>Usage in Deno</h3>

      {/*markdown rendering*/}
      <div dangerouslySetInnerHTML={{ __html: usages.usages[0].content }} />
    </div>
  );
}
