export default function () {
  return (
    <>
      <h1 class="text-2xl font-semibold sm:text-3xl md:text-4xl">
        <div class="text-[400%] font-semibold text-runtime-300 opacity-50 dark:opacity-15 relative -z-10">
          404
        </div>
        Sorry, couldn’t find that page.
      </h1>
      <p class="md:text-lg mt-4 px-4">
        Maybe one of these links has what you're looking for?
      </p>
    </>
  );
}

export const css = "@import './_components/FourOhFour.css';";
