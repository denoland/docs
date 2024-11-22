export const layout = "raw.tsx";
export const url = "/404";
import { sidebar } from "./runtime/_data.ts";

const styles = /*css*/ `
#content nav {
  padding-inline: 0;
}
#content nav > ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: 1.5rem;
}

#content nav h2 {
  width: 100%;
  margin-inline: 0;
  margin-block-start: 0;
}

#content nav :where(li, h2) {
  padding-inline-start: 0;
  margin-inline: 0;
  text-wrap: balance;
}`;

export default function Page(props: Lume.Data, _helpers: Lume.Helpers) {
  return (
    <main
      id="content"
      class="max-w-screen-xl px-4 md:px-12 md:mx-auto pt-6 mb-20"
    >
      <style>{styles}</style>
      <div class="mt-8 mb-16 lg:mb-24">
        <h1 class="text-2xl font-semibold sm:text-3xl md:text-4xl">
          <div class="text-[400%] font-semibold text-runtime-300 opacity-50 relative -z-10">
            404
          </div>
          Sorry, couldn’t find that page.
        </h1>
        <p class="md:text-lg mt-4">
          Maybe one of these links has what you're looking for?
        </p>
      </div>

      <props.comp.Sidebar
        sidebar={sidebar}
        search={props.search}
        url={props.url}
        headerPath={props.headerPath!}
      />
    </main>
  );
}
