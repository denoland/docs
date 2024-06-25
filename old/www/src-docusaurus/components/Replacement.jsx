const React = require("react");

export const replacements = require("../../replacements.json");

export default function Replacement(props) {
  return <span>{replacements[props.for] || ""}</span>;
}
