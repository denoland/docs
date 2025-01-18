import { DocNodeBase } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";

export default function* getPages(
  _: DocNodeBase,
  __: ReferenceContext,
): IterableIterator<LumeDocument> {
}
