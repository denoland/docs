export const layout = "raw.tsx";
export const url = "/404";
import { sidebar } from "../runtime/_data.ts";

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

#content nav :where(li, a, h2, button) {
  padding-inline-start: 0;
  text-wrap: balance;
}`;

export default function Page(props: Lume.Data, helpers: Lume.Helpers) {
  return (
    <main
      id="content"
      class="max-w-screen-xl px-4 md:px-12 md:mx-auto pt-6 mb-20"
    >
      <style>{styles}</style>
      <div class="space-y-2 mt-8 mb-16">
        <h1 class="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Sorry, couldn't find that page
        </h1>
        <p class="md:text-xl">
          Maybe one of these links is what you're looking for?
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
