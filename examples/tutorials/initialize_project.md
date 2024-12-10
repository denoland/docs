---
title: "Initialize a project"
url: /examples/initialize_project_tutorial/
oldUrl:
---

While it is possible to run scripts directly with `deno run`, for larger
projects it is recommended to create a sensible directory structure. This way
you can organize your code, manage dependencies, script tasks and run tests more
easily.

Initialize a new project by running the following command:

```sh
deno init my_project
```

Where `my_project` is the name of your project. You can
[read more about the project structure](/runtime/getting_started/first_project/).

### Run your project

Navigate to the project directory:

```sh
cd my_project
```

Then you can run the project directly using the `deno task` command:

```sh
deno run dev
```

Take a look in the `deno.json` file in your new project. You should see a `dev`
task in the "tasks" field.

```json title="deno.json"
"tasks": {
  "dev": "deno run --watch main.ts"
},
```

The `dev` task is a common task that runs the project in development mode. As
you can see, it runs the `main.ts` file with the `--watch` flag, which will
automatically reload the script when changes are made. You can see this in
action if you open the `main.ts` file and make a change.

### Run the tests

In the project directory run:

```sh
deno test
```

This will execute all the tests in the project. You can read more about
[testing in Deno](/runtime/fundamentals/testing/) and we'll cover tests in a
little more depth in a later tutorial. At the moment you have one test file,
`main_test.ts`, which tests the `add` function in `main.ts`.

### Adding to your project

The `main.ts` file serves as the entry point for your application. It’s where
you’ll write your main program logic. When developing your project you will
start by removing the default addition program and replace it with your own
code. For example, if you’re building a web server, this is where you’d set up
your routes and handle requests.

Beyond the initial files, you’ll likely create additional modules (files) to
organize your code. Consider grouping related functionality into separate files.
Remember that Deno [supports ES modules](/runtime/fundamentals/modules/), so you
can use import and export statements to structure your code.

Example folder structure for a deno project:

```sh
my_project/
├── deno.json
├── main.ts
├── main_test.ts
├── routes/
│   ├── home.ts
│   ├── about.ts
├── services/
│   ├── user.ts
│   ├── post.ts
└──utils/
    ├── logger.ts
    ├── logger_test.ts
    ├── validator_test.ts
    └── validator.ts
```

This kind of structure keeps your project clean and makes it easier to find and
manage files.

🦕 Congratulations! Now you know how to create a brand new project with
`deno init`. Remember that Deno encourages simplicity and avoids complex build
tools. Keep your project modular, testable, and organized. As your project
grows, adapt the structure to fit your needs. And most importantly, have fun
exploring Deno’s capabilities!
