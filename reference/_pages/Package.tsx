import ReferencePage from "../_layouts/ReferencePage.tsx";
import { ReferenceContext, WebCategoryDetails } from "../types.ts";
import { AnchorableHeading } from "./partials/AnchorableHeading.tsx";
import { linkCodeAndParagraph } from "./primitives/LinkCode.tsx";

type Props = {
  data: Map<string, WebCategoryDetails>;
  context: ReferenceContext;
};

export function Package({ data, context }: Props) {
  const categoryElements = data.entries().map(
    ([key, value]) => {
      return (
        <CategorySummary
          identifier={key}
          context={context}
          summary={value.description || ""}
        />
      );
    },
  ).toArray();

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: "",
      }}
    >
      <main>
        <section>
          <div class="space-y-2 flex-1 ">
            <div class="space-y-7" id="module_doc"></div>
          </div>
        </section>
        <div className={"space-y-7"}>
          {categoryElements}
        </div>
      </main>
    </ReferencePage>
  );
}

export function CategorySummary(
  { identifier, context, summary }: {
    identifier: string;
    context: ReferenceContext;
    summary: string;
  },
) {
  const href =
    `${context.root}/${context.packageName.toLocaleLowerCase()}/${identifier.toLocaleLowerCase()}`;
  const anchorId = identifier.replace(" ", "-").toLocaleLowerCase();
  const processedDescription = linkCodeAndParagraph(summary);

  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>
        <a href={href}>{identifier}</a>
      </AnchorableHeading>
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        {processedDescription}
      </div>
    </section>
  );
}
