/**
 * @title Stub functions
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/testing/doc/mock#stubbing} Stub docs on JSR
 * @resource {https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html} Typescript docs for `using` keyword
 * @group Testing
 *
 * Test stubs are an extension of spys that also allows you to replace the method's internal behavior for testing purposes.
 * In this example, we will demonstrate how we can use stubs to only test the desired behaviour.
 */

import { assertSpyCalls, returnsNext, stub } from "jsr:@std/testing/mock";
import { assertThrows } from "jsr:@std/assert";

type User = {
  id: number;
  name: string;
};

function getUserById(id: number): User | undefined {
  // Actual database call would be here
  return { id, name: "Ada Lovelace" };
}

const database = { getUserById };

class UserRepository {
  static findOrThrow(id: number): User {
    const user = database.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

// As we want to test the `findOrThrow` method, we don't actually want to access the database
Deno.test("findOrThrow method throws when the user was not found", () => {
  // Stub the `getUserById` function to return `undefined` when called.
  using dbStub = stub(database, "getUserById", returnsNext([undefined]));

  // We expect this function call to throw an error
  assertThrows(() => UserRepository.findOrThrow(1), Error, "User not found");
  assertSpyCalls(dbStub, 1);
});
