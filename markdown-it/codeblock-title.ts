// deno-lint-ignore-file no-explicit-any

export default function codeblockTitlePlugin(md: any) {
  const defaultRender = md.renderer.rules.fence;

  md.renderer.rules.fence = function (
    tokens: any[],
    idx: number,
    options,
    env,
    self,
  ) {
    const render = defaultRender(tokens, idx, options, env, self);

    const info = tokens[idx].info ?? "";
    let maybeTitle = info.match(/title="(.+?)"/)?.[1];

    if (!maybeTitle) {
      const lang = info.split(/\s+/)[0];
      if (lang === "sh" || lang === "bash") {
        maybeTitle = ">_";
      }
    }

    if (maybeTitle) {
      const titleHtml = maybeTitle === ">_"
        ? `<span aria-label="Terminal" role="img">&gt;_</span>`
        : maybeTitle;
      return `<div><div class="markdownBlockTitle">${titleHtml}</div>${render}</div>`;
    }

    return render;
  };
}
