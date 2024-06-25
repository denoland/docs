const visit = require("unist-util-visit");
const replacements = require("../../replacements.json");
const KEYS = Object.keys(replacements);

const plugin = (options) => {
  const transformer = async (ast) => {
    visit(ast, "code", (node) => {
      KEYS.forEach((key) => {
        node.value = node.value.replace(
          new RegExp(`\\$${key}`, "g"),
          replacements[key],
        );
      });
    });
  };
  return transformer;
};

module.exports = plugin;
