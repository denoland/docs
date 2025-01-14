import { assertEquals } from "@std/assert/equals";
import { mergeSymbolsWithCollidingNames } from "./symbolMerging.ts";
import { DocNodeClass } from "@deno/doc/types";
import { assert } from "@std/assert/assert";

Deno.test("mergeSymbolsWithCollidingNames, names match, returns one item", () => {
  const symbol1 = {
    name: "Test",
    kind: "class",
    namespace: "",
    fullName: "Test",
  };
  const symbol2 = {
    name: "Test",
    kind: "class",
    namespace: "",
    fullName: "Test",
  };

  // deno-lint-ignore no-explicit-any
  const items = new Map<string, any[]>();
  items.set("Test", [symbol1, symbol2]);

  const merged = mergeSymbolsWithCollidingNames(items);

  assertEquals(merged.length, 1);
});

Deno.test("mergeSymbolsWithCollidingNames, merges elements in classDef", () => {
  const symbol1 = {
    name: "Test",
    kind: "class",
    namespace: "",
    fullName: "Test",
    classDef: {
      constructors: [
        { name: "bar" },
      ],
    },
  };
  const symbol2 = {
    name: "Test",
    kind: "class",
    namespace: "",
    fullName: "Test",
    classDef: {
      constructors: [
        { name: "baz" },
      ],
    },
  };

  // deno-lint-ignore no-explicit-any
  const items = new Map<string, any[]>();
  items.set("Test", [symbol1, symbol2]);

  const merged = mergeSymbolsWithCollidingNames(items)[0] as DocNodeClass;

  assertEquals(merged.classDef.constructors.length, 2);
  assert(merged.classDef.constructors.some((x) => x.name === "bar"));
  assert(merged.classDef.constructors.some((x) => x.name === "baz"));
});
