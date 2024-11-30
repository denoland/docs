/**
 * @title Spy functions
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/testing/doc/mock#spying} Spy docs on JSR
 * @resource {https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html} Typescript docs for `using` keyword
 * @group Testing
 *
 * A function spy allow us to assert that a function was called with the correct arguments and a specific number of times.
 * This snippet demonstrates how to spy on a function using a mock function.
 */

import { assertSpyCall, assertSpyCalls, spy } from "jsr:@std/testing/mock";

function log(message: string) {
    console.log(message);
}

const logger = { log };

Deno.test("logger uses the log function", () => {
    // Create a spy on the `logger.log` method.
    const logSpy = spy(logger, "log");

    // Call the `logger.log` method.
    logger.log("Hello, world!");

    try {
        // Assert that the `log` function was called just once.
        assertSpyCalls(logSpy, 1);

        // Assert that the `log` function was called with the correct arguments.
        assertSpyCall(logSpy, 0, { args: ["Hello, world!"] });
    } finally {
        // Restore the logger.log function to stop spying it.
        logSpy.restore();
    }
});

Deno.test("Creating a spy with the using keyword", () => {
    // method spies are disposable, so we can create them with the keyword `using`
    using logSpy = spy(logger, "log");

    logger.log("Disposable spy");

    // Spies created with the `using` keyword are automatically restored at the end of the test
    assertSpyCalls(logSpy, 1);
});
