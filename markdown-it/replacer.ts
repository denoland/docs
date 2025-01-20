// deno-lint-ignore-file no-explicit-any
import REPLACEMENTS from "../replacements.json" with { type: "json" };

export default function replacerPlugin(md: any) {
  md.core.ruler.before(
    "inline",
    "replacer",
    (state: { tokens: { content: string }[] }) => {
      state.tokens.forEach((token: { content: string }) => {
        Object.entries(REPLACEMENTS).forEach(([key, value]) => {
          token.content = token.content.replace(
            new RegExp(`\\$${key}`, "g"),
            value,
          );
        });
      });
    },
  );
}
