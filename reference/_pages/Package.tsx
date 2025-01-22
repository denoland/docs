import ReferencePage from "../_layouts/ReferencePage.tsx";
import { ReferenceContext, WebCategoryDetails } from "../types.ts";
import { AnchorableHeading } from "./partials/AnchorableHeading.tsx";
import { MarkdownContent } from "./primitives/MarkdownContent.tsx";

type Props = {
  data: Map<string, WebCategoryDetails>;
  context: ReferenceContext;
};

export function Package({ data, context }: Props) {
  const categoryElements = data.entries().map(
    ([_, details]) => {
      return (
        <CategorySummary
          details={details}
          context={context}
          summary={details.description || ""}
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
  { details, context, summary }: {
    details: WebCategoryDetails;
    context: ReferenceContext;
    summary: string;
  },
) {
  const href =
    `${context.root}/${context.packageName.toLocaleLowerCase()}/${details.urlStub}`;
  const anchorId = details.urlStub;

  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>
        <a href={href}>{details.title}</a>
      </AnchorableHeading>
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        <MarkdownContent text={summary || ""} />
      </div>
    </section>
  );
}
