---
title: "Building a SvelteKit app with sv and Deno"
url: /examples/sveltekit_tutorial/
---

SvelteKit has been a stable popular vote since its launch and with Svelte
version 5 releasing recently, as of time of writing, there isn't a better time
to show off running it with Deno!

Through this tutorial we will walk through setting up a SvelteKit project, made
easier with the sv cli release and look at loading patterns.

You can see the finished app at
[GitHub](https://github.com/s-petey/deno-sveltekit)

## Getting started

We can scaffold an application easily with `npx sv create`. This is
[SvelteKit's CLI](https://github.com/sveltejs/cli) which has a lot of utility.

https://github.com/user-attachments/assets/8357d46b-b535-44e3-9191-1496e0632bd1

If you have followed the video above great! If not, here are the selections:

- Template
  - SvelteKit minimal
- Type Checking
  - Typescript
- Additions to project
  - prettier
  - eslint
  - tailwindcss
- Tailwind plugins
  - typography
  - forms
- Package manager
  - Deno

For the remainder of this, you should have `deno task dev` running in the
background so you can see your changes and the application running locally.

### Walkthrough

There are a few different folders to be mindful of.

`src` this is the root of your application code and where most of your time and
effort will go.

`src/lib` this is a SvelteKit aliased directory for fast import and where many
of your helpers or library code will live.

`src/routes` this is the rendered pages for your application with SvelteKit,
there is folder routing.

#### Good info

There are a few conventions which we will use in our SvelteKit application.
(Although there are more available, I am only covering the ones used).

- Files or folders with `server` in the name are meant to **only** be run on the
  server and may cause errors if you try to run them in the client.
- Within `src/routes` files have a naming conventions:
  - `+page.svelte` -- this is the rendered file in the browser
  - `+page.server.ts` -- This file will run on the server and sends, and can
    receive, data directly and type safely to the `+page.svelte` it is directly
    next to.
  - `+layout.svelte` -- a file which defines a layout with an outlet to be added
    to any `+page.svelte` on the same directory or any child directories.
  - `+error.svelte` -- A custom error page you can add to make error pages nicer
    to come across.

Additional note later you will see we put the dinosaurs (aka dinos) `dino.ts`
file within a `lib/server` directory. This will mean as stated above that this
file is meant to **only** be accessed by other server files.

### Setup our "database"

We will be using a ts file with a `Map` to access and find our items for
simplicity. Create a file and folder:

```
src/lib/server/dino.ts
```

Within this file we will set up a type for our `Dino`s and store the array of
data to be exported as a map.

```ts
export type Dino = { name: string; description: string };

const dinos = new Map<string, Dino>();

const allDinos: Dino[] = [
  // Paste all your dino information here
];

for (const dino of allDinos) {
  dinos.set(dino.name.toLowerCase(), dino);
}

export { dinos };
```

With this setup we have our "database"! Next to access it on a page.

### Loading data to be rendered

We now need to create a `+page.server.ts` file which will be at the root of our
routes directory. There should already be a `+page.svlete` there.

```
src/routes/+page.server.ts
```

With this file created, we need to initialize the function to load our dinos!

```ts
/// src/routes/+page.server.ts
import { dinos } from '$lib/server/dino.js';

export const load = async ({ url }) => {
  return { dinos: Array.from(dinos) };
});
```

All we are doing here is converting our map to an array so we can see them
rendered on the `+page.svelte`. Within this page you can remove anything you'd
like or just add the following.

```html
<script lang="ts">
  /// src/routes/+page.svelte
  let { data } = $props();
</script>

<section class="mb-4 grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
  {#each data.dinos as item}
  <a class="rounded border p-4" href="/{item.name}">{item.name}</a>
  {/each}
</section>
```

Notice while you are working with `data` we have type safety to know that
`data.dinos` exists and the types that are available!

### Adding an individual Dino page

Now that we are rendering each dino and have links on each of them setup, we can
add a route to handle rendering this data.

```
src/routes/[name]/+page.server.ts
src/routes/[name]/+page.svelte
```

There is something neat and unique about this route. I am sure you noticed the
`[name]` inserted as a folder name. This allows us to have a named route
parameter. We could have used anything as the `name`, however we want to be able
to route to `localhost:5173/Ingenia` and see our dinosaur and since that is the
name I've used the parameter `name`.

With that explained now we can access this without our server loader to get our
dino and send it to the page!

```ts
/// src/routes/[name]/+page.server.ts
import { dinos } from "$lib/server/dino.js";
import { error } from "@sveltejs/kit";

export const load = async ({ params: { name } }) => {
  const dino = dinos.get(name.toLowerCase());

  if (!dino) {
    throw error(404, { message: "Dino not found" });
  }

  return { name: dino.name, description: dino.description };
};
```

Notice we are throwing an error here. We don't have an `+error.svelte` page set
up yet, so any errors will currently bubble to the default SvelteKit error page.
Lets add one at the root level to handle any errors.

```
src/routes/+error.svelte
```

This is a very simple page, feel free to spruce up the styles here or add your
own flair!

```html
<script lang="ts">
  import { page } from "$app/state";
</script>

<h1>{page.status}: {page.error?.message}</h1>
```

We simply want to show that something went wrong and with the `page` exposed by
SvelteKit, we can show the status code thrown and if there was a message
attached to the error.

Now with that pesky error distraction handled, pun intended, we can get back to
showing our individual dinosaur!

```html
<script lang="ts">
  /// src/routes/[name]/+page.svelte
  let { data } = $props();
</script>

<h1>{data.name}</h1>

<p>{data.description}</p>
```

Starting to work on this page you can see we still get the type safety knowing a
`name` and `description` will exist on our data and we can render it!

However, there is another problem if you navigate to this page, either by
clicking on one of the links on the main page or by manually adding the dinosaur
name to the URL we have no way of getting back!

### Layouts

We want to have a standard layout so that our pages can share different
information or links. This can be achieved through `+layout.svelte` pages. Lets
go ahead and update the one up at the root of the `routes` directory.

Here are a few things we want to achieve:

1. Allow users to navigate to the home page
2. Show the awesome docs for Deno and SvelteKit
3. Show a cute Dino on the page!

```html
<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<header class="flex flex-row place-content-between items-center p-4">
  <h1 class="text-2xl"><a href="/">Deno Sveltekit</a></h1>
  <img id="deno" class="w-32" src="/vite-deno.svg" alt="Vite with Deno" />
</header>

<main class="container mx-auto p-4">
  {@render children()}
</main>

<footer class="my-4 flex flex-row justify-center gap-4">
  <p class="font-bold">
    <a href="https://svelte.dev/docs/kit">Sveltekit docs</a>
  </p>
  <p class="font-bold">
    <a href="https://docs.deno.com/">Deno docs</a>
  </p>
</footer>
```

As you see, we are seeing `{@render children()}` for the first time. This just
works as an "outlet" if you are coming from the React world to render whatever
other child page may need to be output.

Going back to your application you can see our heading `h1` has a link to go
back to the home page.

### Advanced routing, search parameters, and styling

We don't want to render all of the dinosaurs at a single time; as that is too
much to scroll through. We want our users to be able to search and click through
pages of dinosaurs, which will also showcase another awesome Svelte 5 feature,
snippets!

Lets open our main page and its server page to make a few changes.

Previously we were returning an array version of our dinos, lets allow users to
search them and add some pagination logic.

```ts
import { dinos } from "$lib/server/dino.js";

export const load = async ({ url }) => {
  //  We can access the search params by using the `url` provided
  // by SvelteKit
  const queryParams = url.searchParams;

  // We will use `q` as our search string
  const q = queryParams.get("q");
  // We will use `page` to know which page we are on
  const pageParam = queryParams.get("page");
  let page = 1;
  // We should verify there is a page param, if there is verify it is a number
  // otherwise use our default of 1
  if (pageParam) {
    const parsedPage = parseInt(pageParam);
    if (!isNaN(parsedPage)) {
      page = parsedPage;
    }
  }
  const limitParam = queryParams.get("limit");
  let limit = 25;
  // We should verify there is a limit param, if there is verify it is a number
  // otherwise use our default of 1
  if (limitParam) {
    const parsedLimit = parseInt(limitParam);
    if (!isNaN(parsedLimit)) {
      limit = parsedLimit;
    }
  }

  // We want to allow searching and if there is no `q` to search against
  // allow all dinos, otherwise compare the names in lowercase against one
  // another.
  const filteredDinos = Array.from(dinos.values()).filter((d) => {
    if (!q) {
      return true;
    }

    return d.name.toLowerCase().includes(q.toLowerCase());
  });

  // Here we calculate how we need to slice the array of filtered dinos to return to the user
  const offset = Math.abs((page - 1) * limit);
  const paginatedDinos = Array.from(filteredDinos).slice(
    offset,
    offset + limit,
  );
  const totalDinos = filteredDinos.length;
  const totalPages = Math.ceil(totalDinos / limit);

  // Last we are returning a lot more data so it is easier to render
  // our pagination and dinos on the page.
  return {
    dinos: paginatedDinos,
    q,
    page,
    limit,
    totalPages,
    totalDinos,
  };
};
```

Wuuf, that was a lot of work, and with it out of the way lets get some
pagination and search inputs added to the UI!

```html
<script lang="ts">
	import { goto, invalidate, replaceState } from '$app/navigation';
	import { page as sveltePage } from '$app/state';

	let { data } = $props();

	// We have added a function to change the page number
	// based on the search params and the value passed in.
	function handlePageChange(page: number) {
		const params = new URLSearchParams(sveltePage.url.searchParams);

		params.set('page', page.toString());
		goto(`?${params.toString()}`, { keepFocus: true });
	}

	// This function checks if there is a q in the form below
	// and if so search by it or remove the search params
	// and either way reset the current page.
	function handleQueryChange(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		event.preventDefault();
		const q = event.currentTarget.q.value;
		const params = new URLSearchParams(sveltePage.url.searchParams);

		if (q) {
			params.set('q', q);
			params.set('page', '1');
			goto(`?${params.toString()}`, { keepFocus: true });
		} else {
			params.delete('q');
			params.delete('page');
			goto(`?${params.toString()}`, { keepFocus: true });
		}
	}
</script>

<form onsubmit={handleQueryChange} class="mb-4">
	<label class="mb-2 block text-sm font-bold" for="q">Search</label>
	<input
		class="focus:shadow-outline w-ful form-input appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		type="text"
		id="q"
		name="q"
		placeholder="Search"
		defaultValue={data.q ?? ''}
	/>
</form>

<section class="mb-4 grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
	{#each data.dinos as item}
		<a class="rounded border p-4" href="/{item.name}">{item.name}</a>
	{/each}

	{#if data.dinos.length === 0}
		<p>No dinos found</p>
	{/if}
</section>

<!-- pagination -->
{#if data.totalPages > 0}
	<div class="mb-4 flex justify-center">
		<div class="grid w-1/2 grid-flow-col gap-2">
			{@render pageButton(data.page - 1, data.page === 1, false, '←')}

			{#each { length: data.totalPages }, page}
				{#if page >= data.page - 2 && page <= data.page + 2}
					{@render pageButton(page + 1, data.page === page + 1, data.page === page + 1, page + 1)}
				{:else if (page === 0 || page === 1) && page !== data.page - 1}
					{@render pageButton(page + 1, data.page === page + 1, data.page === page + 1, page + 1)}
				{:else if page >= data.totalPages - 2 && page !== data.page - 1}
					{@render pageButton(page + 1, data.page === page + 1, data.page === page + 1, page + 1)}
				{/if}
			{/each}

			{@render pageButton(data.page + 1, data.page === data.totalPages, false, '→')}
		</div>
	</div>
{/if}

{#snippet pageButton(page: number, disabled: boolean, active: boolean, child: string | number)}
	<button
		class="rounded border p-4"
		class:disabled
		{disabled}
		class:active
		type="button"
		onclick={() => handlePageChange(page)}
	>
		{child}
	</button>
{/snippet}

<style lang="postcss">
	.active {
		@apply bg-emerald-400 text-white;
	}

	.disabled {
		@apply cursor-not-allowed opacity-50;
	}
</style>
```

Notice for the input we use `defaultValue={data.q ?? ''}` so that when it is
rendered in the UI we don't get `undefined` or `null` showing.

With snippets you can create re-useable parts of Svelte code for easier
rendering. `{#snippet pageButton(...)}` allows us to define the section to be
rendered. We can then use it and pass the required type safe parameters using
`{@render pageButton(...)}`. You can see this for all of the pagination buttons.

Another neat Svelte trick is whenever `<style>` is defined on the page, it is
scoped only to the file it is used in. So we are able to add these classes
knowing that it will not affect any of our other files if they also used that
styling.

I have updated some of the styling to make it more pleasant to look at, but I
know you have great taste and are free to make it look however you'd like!
