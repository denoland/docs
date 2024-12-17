export const title = "Lint rules";


export const toc = [];

export default function(data: Lume.Data, _helpers: Lume.Helpers) {
  console.log(data);
  return (
    <div>
      <div class="lintRuleLogosGroup">
        <div>
          ✅ = recommended
        </div>
        <div>
          <img src="/img/fresh.svg" className="lintRuleLogo" alt="fresh" />{" "}
          = fresh
        </div>
        <div>
          <img src="/img/react.svg" className="lintRuleLogo" alt="react" />{" "}
          = react
        </div>
        <div>
          <img src="/img/jsr.svg" className="lintRuleLogo" alt="jsr" />{" "}
          = jsr
        </div>
      </div>


      {data.lintRulePages.map((lintRule) => (
        <div>
          <a href={lintRule.href}>{lintRule.label}</a>{" "}
          {lintRule.tags.map((tag) => (
            <span className={`lint-tag-${tag}`}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
