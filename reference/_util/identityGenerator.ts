// deno-lint-ignore-file no-unused-vars
import { DocNodeBase } from "@deno/doc/types";

export function generateSymbolIdentity(
  data: DocNodeBase,
  packageName: string,
  namespace: string,
): string {
  return namespace ? `${namespace}.${data.name}` : data.name;
}
