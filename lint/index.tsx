export const title = "Lint rules";

export const toc = [];

const JsrLogo = () => (
  <img src="/img/jsr.svg" className="lintRuleLogo" alt="jsr" />
);

const JsxLogo = () => (
  <img src="/img/jsx.svg" className="lintRuleLogo" alt="jsx" />
);

const ReactLogo = () => (
  <img src="/img/react.svg" className="lintRuleLogo" alt="react" />
);

const FreshLogo = () => (
  <img src="/img/fresh.svg" className="lintRuleLogo" alt="fresh" />
);

const RecommendedLogo = () => <>✅</>;

function getTag(tag: string) {
  switch (tag) {
    case "jsr":
      return <JsrLogo />;
    case "react":
      return <ReactLogo />;
    case "jsx":
      return <JsxLogo />;
    case "recommended":
      return <RecommendedLogo />;
    case "fresh":
      return <FreshLogo />;
    default:
      break;
  }
}

export default function (data: Lume.Data, _helpers: Lume.Helpers) {
  return (
    <div>
      <div class="lintRuleLogosGroup">
        <div>
          <RecommendedLogo /> = recommended
        </div>
        <div>
          <FreshLogo /> = fresh
        </div>
        <div>
          <JsxLogo /> = jsx
        </div>
        <div>
          <ReactLogo /> = react
        </div>
        <div>
          <JsrLogo /> = jsr
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
