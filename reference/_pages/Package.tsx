import ReferencePage from "../_layouts/ReferencePage.tsx";
import { ReferenceContext } from "../types.ts";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { insertLinkCodes } from "./primatives/LinkCode.tsx";

type Props = {
  data: Record<string, string | undefined>;
  context: ReferenceContext;
};

export function Package({ data, context }: Props) {
  const categoryListItems = Object.entries(data).map(([key, value]) => {
    return (
      <CategoryListSection
        title={key}
        href={`${context.root}/${context.packageName.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`}
        summary={value || ""}
      />
    );
  });

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
          {categoryListItems}
        </div>
      </main>
    </ReferencePage>
  );
}

function CategoryListSection(
  { title, href, summary }: { title: string; href: string; summary: string },
) {
  const anchorId = title.replace(" ", "-").toLocaleLowerCase();

  const parts = summary.split("\n\n");
  const examplePart = parts[parts.length - 1];
  const partsExceptLast = parts.slice(0, parts.length - 1);
  const summaryBody = partsExceptLast.join("\n\n");

  const exampleBody = insertLinkCodes(examplePart);
  const summaryBodyParas = summaryBody.split("\n\n").map((paragraph) => (
    <p>{paragraph}</p>
  ));

  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>
        <a href={href}>{title}</a>
      </AnchorableHeading>
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        {summaryBodyParas}
        <p>
          {exampleBody}
        </p>
      </div>
    </section>
  );
}
