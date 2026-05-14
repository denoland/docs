import loader from "lume/core/loaders/text.ts";
import { merge } from "lume/core/utils/object.ts";
import { compile, remarkGfm } from "lume/deps/mdx.ts";
import { join, toFileUrl } from "lume/deps/path.ts";
import { renderComponent } from "lume/deps/ssx.ts";

import type Site from "lume/core/site.ts";
import type { Engine } from "lume/core/renderer.ts";
import type { PluggableList, RehypeOptions } from "lume/deps/remark.ts";

export interface Options {
  extensions?: string[];
  recmaPlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  rehypeOptions?: RehypeOptions;
  rehypePlugins?: PluggableList;
  useDefaultPlugins?: boolean;
  components?: Record<string, unknown>;
  includes?: string;
}

export const defaults: Options = {
  extensions: [".mdx"],
  useDefaultPlugins: true,
};

const remarkDefaultPlugins = [
  remarkGfm,
];

export class MDXEngine implements Engine<string | { toString(): string }> {
  baseUrl: string;
  options: Required<Options>;
  includes: string;

  constructor(baseUrl: string, options: Required<Options>) {
    this.baseUrl = baseUrl;
    this.options = options;
    this.includes = options.includes;
  }

  deleteCache() {}

  async render(
    content: string,
    data?: Record<string, unknown>,
    filename?: string,
  ) {
    const baseUrl = toFileUrl(join(this.baseUrl, filename || "/")).href;
    const result = await compile(content, {
      baseUrl,
      jsx: false,
      format: "mdx",
      outputFormat: "program",
      recmaPlugins: this.options.recmaPlugins,
      remarkPlugins: this.options.remarkPlugins,
      rehypePlugins: this.options.rehypePlugins,
      remarkRehypeOptions: this.options.rehypeOptions,
      stylePropertyNameCase: "css",
    });

    const jsxRuntime =
      "https://cdn.jsdelivr.net/gh/oscarotero/ssx@0.1.14/jsx-runtime.ts";
    const code = result.toString()
      .replaceAll('"react/jsx-runtime"', `"${jsxRuntime}"`);

    const url = URL.createObjectURL(new Blob([code], { type: "text/jsx" }));
    const mdxContent = (await import(url)).default;
    URL.revokeObjectURL(url);

    const body = mdxContent({
      ...data,
      components: { comp: data?.comp, ...this.options.components },
    });

    return renderComponent(body);
  }

  addHelper() {}
}

export function mdx(userOptions?: Options) {
  return function (site: Site) {
    const options = merge(
      { ...defaults, includes: site.options.includes },
      userOptions,
    );

    if (options.useDefaultPlugins) {
      options.remarkPlugins ||= [];
      options.remarkPlugins.unshift(...remarkDefaultPlugins);
    }

    const engine = new MDXEngine(site.src(), options);

    if (options.includes) {
      site.ignore(options.includes);
    }

    site.loadPages(options.extensions, {
      loader,
      engine,
    });

    const filter = async (
      content: string,
      data?: Record<string, unknown>,
    ): Promise<string> =>
      (await engine.render(content, data)).toString().trim();

    site.filter("mdx", filter, true);
  };
}

export default mdx;

declare global {
  namespace Lume {
    export interface Helpers {
      mdx: (content: string, data?: Record<string, unknown>) => Promise<string>;
    }
  }
}
