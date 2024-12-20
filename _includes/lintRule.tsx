import { getLintIcon } from "../lint/index.tsx";

export const layout = "doc.tsx";

const generateConfigFileForTag = (tag: string) => {
  return `{
  "lint": {
    "tags": ["${tag}"]
  }
}`;
};

const generateConfigFileForTags = (tags: string[]) => {
  return `{
  "lint": {
    "tags": ["${tags[0]}"] // ...or ${
    tags.slice(1).map((tag) => `"${tag}"`).join(", ")
  }
  }
}`;
};

const generateCliForTag = (tag: string) => {
  return `deno lint --tags=${tag}`;
};

const generateCliForTags = (tags: string[]) => {
  return tags.map((tag) => `deno lint --tags=${tag}`).join("\n# or ...\n");
};

function LintRuleTags(props: { tags: string[] }) {
  const tags = props.tags;
  if (tags.length === 0) {
    return null;
  }

  return (
    <div class="border-t md:border md:rounded-md pt-8 pb-4 md:p-4">
      {tags.map((tag) => getLintIcon(tag))} <br />
      {tags.length === 1
        ? (
          <>
            <span>
              This rule can be enabled using <code>{tags[0]}</code> tag.
            </span>
            <br />
            <span>In the config file:</span>
            <pre>{generateConfigFileForTag(tags[0])}</pre>
            <span>Using CLI:</span>
            <pre>{generateCliForTag(tags[0])}</pre>
          </>
        )
        : (
          <>
            <span>
              This rule can be enabled using one of{" "}
              <code>{tags.join(", ")}</code> tags.
            </span>
            <br />
            <span>In the config file:</span>
            <pre>{generateConfigFileForTags(tags)}</pre>
            <span>Using CLI:</span>
            <pre>{generateCliForTags(tags)}</pre>
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
