import tw from "tailwindcss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import Site from "lume/core/site.ts";

export interface TailwindOptions {
  autoprefixer?: autoprefixer.Options;
  options: tw.Config;
}

export default function (options: TailwindOptions) {
  const extensions = [".css"];

  return (site: Site) => {
    // Setup PostCSS process pipeline with TailwindCSS + autoprefixer
    const processor = postcss([
      tw(options.options),
      // deno-lint-ignore no-explicit-any
      autoprefixer(options.autoprefixer) as any,
    ]);

    site.loadAssets(extensions);

    site.process(extensions, async (pages) => {
      // Process all CSS files which tends to be fast enough
      await Promise.all(pages.map(async (page) => {
        const result = await processor.process(page.content!, {
          from: page.src.entry?.src,
        });

        page.content = result.content;
      }));
    });
  };
}
