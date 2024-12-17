export const title = "Lint rules";

export const toc = [];

const JsrIcon = () => (
  <img src="/img/jsr.svg" className="lintRuleLogo" alt="jsr" />
);

const JsxIcon = () => (
  <img src="/img/jsx.svg" className="lintRuleLogo" alt="jsx" />
);

const ReactIcon = () => (
  <img src="/img/react.svg" className="lintRuleLogo" alt="react" />
);

const FreshIcon = () => (
  <img src="/img/fresh.svg" className="lintRuleLogo" alt="fresh" />
);

const RecommendedIcon = () => (
  <img src="/img/checkmark.svg" className="lintRuleLogo" alt="recommended" />
);

function getTag(tag: string) {
  switch (tag) {
    case "jsr":
      return <JsrIcon />;
    case "react":
      return <ReactIcon />;
    case "jsx":
      return <JsxIcon />;
    case "recommended":
      return <RecommendedIcon />;
    case "fresh":
      return <FreshIcon />;
    default:
      break;
  }
}

export default function (data: Lume.Data, _helpers: Lume.Helpers) {
  return (
    <div>
      <div class="lintRuleLogosGroup">
        <div>
          <RecommendedIcon /> = recommended
        </div>
        <div>
          <FreshIcon /> = fresh
        </div>
        <div>
          <JsxIcon /> = jsx
        </div>
        <div>
          <ReactIcon /> = react
        </div>
        <div>
          <JsrIcon /> = jsr
        </div>
      </div>

      {data.lintRulePages.map((lintRule) => (
        <div>
          <a href={lintRule.href}>{lintRule.label}</a>{" "}
          {lintRule.tags.map((tag) => getTag(tag))}
        </div>
      ))}
    </div>
  );
}
