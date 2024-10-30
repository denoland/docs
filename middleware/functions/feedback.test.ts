import { loadSync } from "@std/dotenv";
loadSync({ export: true });

import { assertEquals } from "@std/assert";
import feedbackRequestHandler from "./feedback.ts";

Deno.test("integration: can insert record into feedback google sheet", async () => {
  const request = new Request("http://localhost:8000/_api/send-feedback");

  const result = await feedbackRequestHandler(request);

  assertEquals(result.status, 200);
});
