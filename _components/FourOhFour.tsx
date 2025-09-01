export default function () {
  return (
    <div className="">
      <h1 class="text-2xl font-semibold sm:text-3xl md:text-4xl">
        <div class="text-[400%] font-semibold text-runtime-300 opacity-50 dark:opacity-15 relative -z-10">
          404
        </div>
        Sorry, couldn’t find that page.
      </h1>
      <p class="md:text-lg mt-4">
        Maybe one of these links has what you're looking for?
      </p>
      <ul class="mt-8 list-disc space-y-1">
        <li>
          <a href="https://docs.deno.com" class="underline">
            Deno Docs homepage
          </a>
        </li>
        <li>
          <a href="https://docs.deno.com/examples" class="underline">
            Deno examples
          </a>
        </li>
        <li>
          <a href="https://docs.deno.com/services" class="underline">
            Deno Services docs
          </a>
        </li>
        <li>
          <a href="https://deno.com" class="underline">Deno website</a>
        </li>
      </ul>
    </div>
  );
}
