export const layout = "doc.tsx";

export default function LintRule(props: Lume.Data, helpers: Lume.Helpers) {
  // Strip /lint/rules/ and trailing slash
  const lintRuleName = props.url.substring(12).slice(0, -1);

  return (
    <>
      <h1>{lintRuleName}</h1>
      {props.children}
    </>
  );
}
