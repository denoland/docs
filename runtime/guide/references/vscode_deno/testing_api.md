# Testing API

The `vscode_deno` extension implements a client for the vscode
[Testing API](https://code.visualstudio.com/api/extension-guides/testing) and
when using a version of Deno that supports the testing API, tests in your
project will be displayed within your IDE for Deno enabled projects.

## Test display

When both the editor and the version of Deno support the testing API, the _Test
Explorer_ view will activate represented by a beaker icon, which will provide
you with a side panel of tests that have been discovered in your project.

Also, next to tests identified in the code, there will be decorations which
allow you to run and see the status of each test, as well as there will be
entries in the command pallette for tests.

## Discovering tests

Currently, Deno will only discover tests that are part of the "known" modules
inside a workspace. A module becomes "known" when it is opened in the editor, or
another module which imports that module is "known" inside the editor.

In the future, tests will be discovered in a similar fashion to the way the
`deno test` subcommand discovers tests as part of the root of the workspace.

## Running tests

You can run tests from the Test Explorer view, from the decorations next to the
tests when viewing the test code, or via the command pallette. You can also use
the filter function in the Text Explorer view to exclude certain tests from a
test run.

Currently, Deno only supports the "run" test capability. We will be adding a
debug run mode as well as a coverage run mode in the future. We will also be
integrating the benchmarking tests as a _tag_, so they can be run (or excluded)
from your test runs.

The Deno language server does not spin up a new CLI subprocess. It instead
spawns a new thread and JavaScript runtime per test module to execute the tests.

## Test output

Any `console.log()` that occurs in your tests will be sent to the test output
window within vscode.

When a test fails, the failure message, including the stack trace, will be
available when inspecting the test results in vscode.

## How tests are structured

Test will be displayed in the Test Explorer at the top level with the module
that contains the test. Inside the module will be all the tests that have been
discovered, and if you are using test steps, they will be included under the
test.

In most cases, the Deno language server will be able to statically identify
tests, but if you are generating tests dynamically, Deno may not be aware of
them until runtime. In these cases it may not be possible to filter these tests
out of a run, but they will be added to the explorer view as they are
encountered.

## Configuration

By default, tests are executed in a similar fashion to if you were to use
`deno test --allow-all` on the command line. These default arguments can be
changed by setting the _Deno > Testing: Args_ option in your user or workspace
settings (or `deno.testing.args` if you are configuring manually). Add
individual arguments here which you would have used with the `deno test`
subcommand.

Based on other settings that you have, those options will be automatically
merged into the "command line" used when running tests unless explicitly
provided in the _Deno > Testing: Args_ setting. For example if you have a _Deno:
Import Map_ (`deno.importMap`) set, the value of that will be used unless you
have provided an explicit `--import-map` value in the testing args setting.

## Known limitations and caveats

Because of the way the Deno test runner runs, it is not possible to exclude (or
explicitly include) a test step. While the vscode UI will allow you to do this,
by for example, choosing to run a specific test step, all test steps in that
test will be run (but vscode will not update the results for them). So if there
are other side effects in the test case, they may occur.
