// Collapse every `@apply ...;` block onto a single line so a follow-up
// `deno fmt` re-wraps it greedily at the full line width (the fmt:css task
// runs both). deno fmt alone won't do this: it preserves existing line breaks
// inside declaration values and only wraps lines that are too long, so
// half-full rows stay half-full forever.
const files = Deno.args.length > 0 ? Deno.args : ["style.css"];

for (const file of files) {
  const source = await Deno.readTextFile(file);
  const collapsed = source.replace(
    /@apply\s[^;{}]*;/g,
    (block) => block.replace(/\s+/g, " "),
  );
  if (collapsed !== source) {
    await Deno.writeTextFile(file, collapsed);
    console.log(`Collapsed @apply blocks in ${file}`);
  }
}
