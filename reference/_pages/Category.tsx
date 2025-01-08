import { LumeDocument, ReferenceContext } from "../types.ts";

type Props = {
  data: Record<string, string | undefined>;
  context: ReferenceContext;
};

export default function* getPages(
  item: Record<string, string | undefined>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: context.section,
    url: `${context.root}/${context.section.toLocaleLowerCase()}/`,
    content: <Category data={item} context={context} />,
  };

  for (const [key, value] of Object.entries(item)) {
    if (value) {
      yield {
        title: key,
        url:
          `${context.root}/${context.section.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`,
        content: <CategoryListing data={item} context={context} />,
      };
    }
  }
}

export function Category({ data, context }: Props) {
  return (
    <div>
      <h1>I am a category: {data.name}</h1>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            {value
              ? (
                <>
                  <a
                    href={`${context.root}/${context.section.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`}
                  >
                    {key}
                  </a>
                  <p>
                    {value}
                  </p>
                </>
              )
              : key}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryListing({ data, context }: Props) {
  // const itemsInThisCategory = context.dataCollection.filter((item) => item.jsDoc?.tag === data.name);

  return (
    <div>
      <h1>I am a category listing page {data.name}</h1>
      <ul>
        <li>This is a list of all the APIs in this category</li>
      </ul>
    </div>
  );
}
