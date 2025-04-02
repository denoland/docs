---
title: "Testing web apps"
description: "A comprehensive guide to testing web applications with Deno"
url: "/examples/tweb_testing_tutorial"
---

Deno is a JavaScript runtime that operates outside of the browser, as such, you
cannot directly manipulate the Document Object Model in Deno as you would in a
browser. However you can use a library like
[deno-dom](https://jsr.io/@b-fuze/deno-dom),
[JSDom](https://github.com/jsdom/jsdom) or
[LinkeDOM](https://www.npmjs.com/package/linkedom) to work with the DOM. This
tutorial will guide you through how to effectively test your web applications
using Deno.

## Testing UI components and DOM manipulation

Let's say you have a website that shows a uers's profile, you can set up a test
function to verify that the DOM element creation works correctly. This code sets
up a basic card element then tests whether the created DOM structure matches
what was expected.

```ts
import { assertEquals } from "jsr:@std/assert";
import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

// Component or function that manipulates the DOM
function createUserCard(user: { name: string; email: string }): Element {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const card = doc.createElement("div");
  card.className = "user-card";

  const name = doc.createElement("h2");
  name.textContent = user.name;
  card.appendChild(name);

  const email = doc.createElement("p");
  email.textContent = user.email;
  email.className = "email";
  card.appendChild(email);

  return card;
}

Deno.test("DOM manipulation test", () => {
  // Create a test user
  const testUser = { name: "Test User", email: "test@example.com" };

  // Call the function
  const card = createUserCard(testUser);

  // Assert the DOM structure is correct
  assertEquals(card.className, "user-card");
  assertEquals(card.children.length, 2);
  assertEquals(card.querySelector("h2")?.textContent, "Test User");
  assertEquals(card.querySelector(".email")?.textContent, "test@example.com");
});
```

## Testing Event Handling

Web applications often handle user interactions through events. Here's how to
test event handlers. This code sets up a button that tracks its active/inactive
state and updates its appearance when clicked. The accompanying test verifies
the toggle functionality by creating a button, checking its initial state,
simulating clicks, and asserting that the button correctly updates its state
after each interaction:

```ts
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { assertEquals } from "jsr:@std/assert";

// Component with event handling
function createToggleButton(text: string) {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const button = doc.createElement("button");

  button.textContent = text;
  button.dataset.active = "false";

  button.addEventListener("click", () => {
    const isActive = button.dataset.active === "true";
    button.dataset.active = isActive ? "false" : "true";
    button.classList.toggle("active", !isActive);
  });

  return button;
}

Deno.test("event handling test", () => {
  // Create button
  const button = createToggleButton("Toggle Me");

  // Initial state
  assertEquals(button.dataset.active, "false");
  assertEquals(button.classList.contains("active"), false);

  // Simulate click event
  button.dispatchEvent(new Event("click"));

  // Test after first click
  assertEquals(button.dataset.active, "true");
  assertEquals(button.classList.contains("active"), true);

  // Simulate another click
  button.dispatchEvent(new Event("click"));

  // Test after second click
  assertEquals(button.dataset.active, "false");
  assertEquals(button.classList.contains("active"), false);
});
```

## Testing Fetch Requests

Testing components that make network requests requires mocking the fetch API.

In the below example we will [mock](/examples/mocking_tutorial/) the `fetch` API
to test a function that retrieves user data from an external API. The test
creates a spy function that returns predefined responses based on the requested
URL, allowing you to test both successful requests and error handling without
making actual network calls:

```ts
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertEquals } from "jsr:@std/assert";

// Component that fetches data
async function fetchUserData(
  userId: string,
): Promise<{ name: string; email: string }> {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

Deno.test("fetch request test", async () => {
  // Mock fetch response
  const originalFetch = globalThis.fetch;

  const mockFetch = spy(async (input: RequestInfo | URL): Promise<Response> => {
    const url = input.toString();
    if (url === "https://api.example.com/users/123") {
      return new Response(
        JSON.stringify({ name: "John Doe", email: "john@example.com" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response("Not found", { status: 404 });
  });

  // Replace global fetch with mock
  globalThis.fetch = mockFetch;

  try {
    // Call the function with a valid ID
    const userData = await fetchUserData("123");

    // Assert the results
    assertEquals(userData, { name: "John Doe", email: "john@example.com" });
    assertSpyCalls(mockFetch, 1);

    // Test error handling (optional)
    try {
      await fetchUserData("invalid");
      throw new Error("Should have thrown an error for invalid ID");
    } catch (error) {
      assertEquals((error as Error).message, "Failed to fetch user: 404");
    }

    assertSpyCalls(mockFetch, 2);
  } finally {
    // Restore the original fetch
    globalThis.fetch = originalFetch;
  }
});
```

## Using Testing Steps to set up and teardown

For complex tests, you can use steps to organize test logic into discrete
sections, making tests more readable and maintainable. Steps also enable better
isolation between different parts of your test. Using step naming you can
implement a setup and teardown of the test conditions.

```ts
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { assertEquals, assertExists } from "jsr:@std/assert";

Deno.test("complex web component test", async (t) => {
  const doc = new DOMParser().parseFromString(
    "<!DOCTYPE html><html></html>",
    "text/html",
  );
  const body = doc.createElement("body");
  const container = doc.createElement("div");
  body.appendChild(container);

  await t.step("initial rendering", () => {
    container.innerHTML = `<div id="app"></div>`;
    const app = container.querySelector("#app");
    assertExists(app);
    assertEquals(app.children.length, 0);
  });

  await t.step("adding content", () => {
    const app = container.querySelector("#app");
    assertExists(app);

    const header = doc.createElement("header");
    header.textContent = "My App";
    app.appendChild(header);

    assertEquals(app.children.length, 1);
    assertEquals(app.firstElementChild?.tagName.toLowerCase(), "header");
  });

  await t.step("responding to user input", () => {
    const app = container.querySelector("#app");
    assertExists(app);

    const button = doc.createElement("button");
    button.textContent = "Click me";
    button.id = "test-button";
    app.appendChild(button);

    let clickCount = 0;
    button.addEventListener("click", () => clickCount++);

    button.dispatchEvent(new Event("click"));
    button.dispatchEvent(new Event("click"));

    assertEquals(clickCount, 2);
  });

  await t.step("removing content", () => {
    const app = container.querySelector("#app");
    assertExists(app);

    const header = app.querySelector("header");
    assertExists(header);

    header.remove();
    assertEquals(app.children.length, 1); // Only the button should remain
  });
});
```

## Best Practices for Web Testing in Deno

1. Maintain isolation - Each test should be self-contained and not depend on
   other tests.

2. Use names to show intent - descriptive names for tests make it clear what is
   being tested and give more readable output in the console

3. Clean up after your tests - remove any DOM elements created during tests to
   prevent test pollution.

4. Mock external services (such as APIs) to make tests faster and more reliable.

5. Organize tests into logical steps using `t.step()` for complex components.

## Running Your Tests

Execute your tests with the Deno test command:

```bash
deno test
```

For web tests, you might need additional permissions:

```bash
deno test --allow-net --allow-read --allow-env
```

🦕 By following the patterns in this tutorial, you can write comprehensive tests
for your web applications that verify both functionality and user experience.

Remember that effective testing leads to more robust applications and helps
catch issues before they reach your users.
