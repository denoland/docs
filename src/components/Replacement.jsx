const React = require("react");
const replacements = require("../../replacements.json");

export default function Replacement(props) {
  return <span>{replacements[props.for] || ""}</span>;
}
