import RefUsageLarge from "../reference/_components/UsageLarge.tsx";
import type { UsagesCtx } from "@deno/doc";

// Adapter to accept either `usages` or `usage` prop
export default function UsageLarge(
  props: { usages?: UsagesCtx | null; usage?: UsagesCtx | null },
) {
  const usages = props.usages ?? props.usage ?? null;
  // Note: RefUsageLarge expects a `usages` prop
  // @ts-ignore props shape is compatible
  return <RefUsageLarge usages={usages} />;
}
