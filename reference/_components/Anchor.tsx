import type { AnchorCtx } from "@deno/doc";

export default function ({ comp, anchor }: { comp: any; anchor: AnchorCtx }) {
  return (
    <a
      href={`#${anchor.id.replace(" ", "-").toLowerCase()}`}
      class="header-anchor"
      aria-label="Anchor"
      tabIndex="-1"
    >
      <span class="sr-only">Jump to heading</span>
      <span aria-hidden="true" class="anchor-end">#</span>
    </a>
  );
}
