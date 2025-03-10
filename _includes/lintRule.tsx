export const layout = "doc.tsx";

const generateConfigFileForTag = (tag: string) => {
  return `{
  "lint": {
    "rules": {
      "tags": ["${tag}"]
    }
  }
}`;
};

const generateConfigFileForTags = (tags: string[]) => {
  return `{
  "lint": {
    "rules": {
      "tags": ["${tags[0]}"] // ...or ${
    tags.slice(1).map((tag) => `"${tag}"`).join(", ")
  }
    }
  }
}`;
};

const generateCliForTag = (tag: string) => {
  return `deno lint --rules-tags=${tag}`;
};

const generateCliForTags = (tags: string[]) => {
  return tags.map(generateCliForTag).join("\n# or ...\n");
};

function LintRuleTags(props: { tags: string[] }) {
  const tags = props.tags;
  if (tags.length === 0) {
    return null;
  }

  return (
    <div class="rounded-md p-4 bg-background-secondary text-sm mb-8 flex flex-col gap-1">
      {tags.length === 1
        ? (
          <>
            <div class="mb-4">
              <b>NOTE:</b> this rule is part of the <code>{tags[0]}</code>{" "}
              rule set.
            </div>
            <div>
              Enable full set in <code>deno.json</code>:
            </div>
            <pre>{generateConfigFileForTag(tags[0])}</pre>
            <div>Enable full set using the Deno CLI:</div>
            <pre class="!mb-0">{generateCliForTag(tags[0])}</pre>
          </>
        )
        : (
          <>
            <div class="mb-4">
              <span class="flex flex-wrap items-center gap-2">
                <b>NOTE:</b> this rule is included the following rule sets:
                {tags.map((tag) => <code>{tag}</code>)}
              </span>
            </div>
            <div>
              Enable full set in <code>deno.json</code>:
            </div>
            <pre>{generateConfigFileForTags(tags)}</pre>
            <div>Enable full set using the Deno CLI:</div>
            <pre class="!mb-0">{generateCliForTags(tags)}</pre>
          </>
        )}
    </div>
  );
}

export default function LintRule(props: Lume.Data, _helpers: Lume.Helpers) {
  const tags = props.data.tags;

  return (
    <>
      <LintRuleTags tags={tags} />
      {props.children}
    </>
  );
}
