import type { AnchorCtx } from "@deno/doc";

export default function ({ anchor }: { anchor: AnchorCtx }) {
  return (
    <a href={`#${anchor.id}`} class="anchor-link" aria-label="Anchor" tabIndex={-1}>
      #
    </a>
  );
}
