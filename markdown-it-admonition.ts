// deno-lint-ignore-file no-explicit-any

export default function admonitionPlugin(md: any) {
  md.core.ruler.push("admonition", function (state: any) {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i].type === "inline" &&
        tokens[i].content.match(/^:::(note|info|tip|caution)(\s+(.*))?/)
      ) {
        const match = tokens[i].content.match(
          /^:::(note|info|tip|caution)(\s+(.*))?/,
        );
        const type = match[1];
        const title = match[3] || type.charAt(0).toUpperCase() + type.slice(1);

        // Render the title as inline markdown
        const titleTokens = state.md.parseInline(title, state.env);
        const renderedTitle = state.md.renderer.render(
          titleTokens[0].children,
          state.md.options,
          state.env,
        );

        // Opening token
        let token = new state.Token("html_block", "", 0);
        token.content = '<div class="admonition ' + md.utils.escapeHtml(type) +
          '">\n' +
          '  <div class="title">' + renderedTitle + "</div>\n\n";
        tokens.splice(i, 1, token);

        // Move to the end of the admonition block
        for (let j = i + 1; j < tokens.length; j++) {
          if (
            tokens[j].type === "inline" && tokens[j].content.trim() === ":::"
          ) {
            // Closing token
            token = new state.Token("html_block", "", 0);
            token.content = "</div>\n";
            tokens.splice(j, 1, token);
            break;
          }
        }
      }
    }
  });
}
