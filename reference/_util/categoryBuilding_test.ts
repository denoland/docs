import { parseCategories } from "./categoryBuilding.ts";
import { assertEquals } from "@std/assert/equals";
import { classFor } from "./testData.ts";

Deno.test("parseCategories, no category description metadata available, still surfaces categories from tags", () => {
    const categoryMap = parseCategories([
        classFor("cat-1"),
        classFor("cat-2"),
    ], {});

    assertEquals(categoryMap.size, 2);
    assertEquals(categoryMap.get("cat-1"), "");
    assertEquals(categoryMap.get("cat-2"), "");
});

Deno.test("parseCategories, category description metadata available, doesn't return items with no symbols", () => {
    const categoryMap = parseCategories([
    ], {
        "cat-1": "Category 1",
        "cat-2": "Category 2",
    });

    assertEquals(categoryMap.size, 0);
});

Deno.test("parseCategories, tagged symbols and matching metadata available, returns both", () => {
    const categoryMap = parseCategories([
        classFor("cat-1")
    ], {
        "cat-1": "Category 1",
    });

    assertEquals(categoryMap.size, 1);
    assertEquals(categoryMap.get("cat-1"), "Category 1");
});


;