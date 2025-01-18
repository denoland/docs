import { assertEquals } from "@std/assert/equals";
import { insertLinkCodes } from "./LinkCode.tsx";
import { markdownRenderer } from "../../../_config.markdown.ts";

Deno.test("insertLinkcode, given LinkCode with URL and title, renders", () => {
    const input = "{@linkcode https://jsr.io/@std/io/doc/types/~/Writer | Writer}";
    const expected = "<a href=\"https://jsr.io/@std/io/doc/types/~/Writer\"><code>Writer</code></a>";

    const result = insertLinkCodes(input);

    assertEquals(result, expected);
});

Deno.test("insertLinkcode, given LinkCode with URL only, renders", () => {
    const input = "{@linkcode MyFoo}";
    const expected = "<a href=\"~/MyFoo\"><code>MyFoo</code></a>";

    const result = insertLinkCodes(input);

    assertEquals(result, expected);
});

Deno.test("insertLinkcode, given linkcode post markdown processing, renders without breaking links", () => {
    const input = "{@linkcode https://jsr.io/@std/io/doc/types/~/Writer | Writer}";
    const expected = "<p><a href=\"https://jsr.io/@std/io/doc/types/~/Writer\"><code>Writer</code></a></p>";

    const asHtml = markdownRenderer.render(input);
    const result = insertLinkCodes(asHtml);

    assertEquals(result, expected);
});