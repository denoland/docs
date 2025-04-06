---
title: "Behavior-Driven Development with Deno"
description: "Learn how to implement Behavior-Driven Development with Deno using the Standard Library's BDD module. This tutorial covers creating readable test specifications, organizing test suites, and writing effective assertions."
url: /examples/bdd_tutorial/
---

Behavior-Driven Development (BDD) is an approach to software development that
encourages collaboration between developers, QA, and non-technical stakeholders.
BDD focuses on defining the behavior of an application through examples written
in a natural, ubiquitous language that all stakeholders can understand.

Deno's Standard Library provides a BDD-style testing module that allows you to
structure tests in a way that's both readable for non-technical stakeholders and
practical for implementation. In this tutorial, we'll explore how to use the BDD
module to create descriptive test suites for your applications.

## Introduction to BDD

BDD extends Test-Driven Development (TDD) by writing tests in a natural language
that non-programmers can read. Rather than thinking about "tests," BDD
encourages you to think about "specifications" or "specs" that describe how your
software should behave from a user's perspective.

The basic elements of BDD include:

- **Describe** blocks that group related specifications
- **It** statements that express a single behavior
- **Before/After** hooks for setup and teardown operations

This approach makes tests more:

- **Readable**: Stakeholders can understand test expectations
- **Maintainable**: Test organization maps to feature organization
- **Focused on behavior**: Tests describe what the code should do, not how it's
  implemented

## Using Deno's BDD Module

To get started with BDD testing in Deno, we'll use the `@std/testing/bdd` module
from the [Deno Standard Library](https://jsr.io/@std/testing/doc/bdd).

First, let's import the necessary functions:

```ts
import { 
  afterAll, 
  afterEach, 
  beforeAll, gi
  beforeEach, 
  describe, 
  it 
} from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";
```

These imports provide the core BDD functions:

- `describe` - Creates a block that groups related tests
- `it` - Declares a test case that verifies a specific behavior
- `beforeEach`/`afterEach` - Runs before/after each test case
- `beforeAll`/`afterAll` - Runs once before/after all tests in a describe block

We'll also use assertion functions from `@std/assert` to verify our
expectations.

## Writing Your First BDD Test

Let's create a simple calculator module and test it using BDD:

```ts title="calculator.ts"
export class Calculator {
  private value: number = 0;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  add(number: number): Calculator {
    this.value += number;
    return this;
  }

  subtract(number: number): Calculator {
    this.value -= number;
    return this;
  }

  multiply(number: number): Calculator {
    this.value *= number;
    return this;
  }

  divide(number: number): Calculator {
    if (number === 0) {
      throw new Error("Cannot divide by zero");
    }
    this.value /= number;
    return this;
  }

  get result(): number {
    return this.value;
  }
}
```

Now, let's test this calculator using the BDD style:

```ts title="calculator_test.ts"
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { Calculator } from "./calculator.ts";

describe("Calculator", () => {
  let calculator: Calculator;

  // Before each test, create a new Calculator instance
  beforeEach(() => {
    calculator = new Calculator();
  });

  it("should initialize with zero", () => {
    assertEquals(calculator.result, 0);
  });

  it("should initialize with a provided value", () => {
    const initializedCalculator = new Calculator(10);
    assertEquals(initializedCalculator.result, 10);
  });

  describe("add method", () => {
    it("should add a positive number correctly", () => {
      calculator.add(5);
      assertEquals(calculator.result, 5);
    });

    it("should handle negative numbers", () => {
      calculator.add(-5);
      assertEquals(calculator.result, -5);
    });

    it("should be chainable", () => {
      calculator.add(5).add(10);
      assertEquals(calculator.result, 15);
    });
  });

  describe("subtract method", () => {
    it("should subtract a number correctly", () => {
      calculator.subtract(5);
      assertEquals(calculator.result, -5);
    });

    it("should be chainable", () => {
      calculator.subtract(5).subtract(10);
      assertEquals(calculator.result, -15);
    });
  });

  describe("multiply method", () => {
    beforeEach(() => {
      // For multiplication tests, start with value 10
      calculator = new Calculator(10);
    });

    it("should multiply by a number correctly", () => {
      calculator.multiply(5);
      assertEquals(calculator.result, 50);
    });

    it("should be chainable", () => {
      calculator.multiply(2).multiply(3);
      assertEquals(calculator.result, 60);
    });
  });

  describe("divide method", () => {
    beforeEach(() => {
      // For division tests, start with value 10
      calculator = new Calculator(10);
    });

    it("should divide by a number correctly", () => {
      calculator.divide(2);
      assertEquals(calculator.result, 5);
    });

    it("should throw when dividing by zero", () => {
      assertThrows(
        () => calculator.divide(0),
        Error,
        "Cannot divide by zero",
      );
    });
  });
});
```

To run this test, use the `deno test` command:

```sh
deno test calculator_test.ts
```

You'll see output similar to this:
