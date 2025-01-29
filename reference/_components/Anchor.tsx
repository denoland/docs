import type { AnchorCtx } from "@deno/doc";

export default function ({ comp, anchor }: { comp: any; anchor: AnchorCtx }) {
  return (
    <a href={`#${anchor.id}`} class="anchor" aria-label="Anchor" tabIndex="-1">
      <comp.link />
    </a>
  );
}
