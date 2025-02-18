import type { ExampleCtx } from "@deno/doc";

export default function (
  { comp, example }: { comp: any; example: ExampleCtx },
) {
  return (
    <div class="anchorable">
      <comp.anchor anchor={example.anchor} />

      {/*markdown rendering; usually not markdown but just a string, but some cases might be markdown (ie the title contains inline-code)*/}
      <h3
        class="example-header"
        dangerouslySetInnerHTML={{ __html: example.markdown_title }}
      />

      {/*markdown rendering*/}
      <div dangerouslySetInnerHTML={{ __html: example.markdown_body }} />
    </div>
  );
}
