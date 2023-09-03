// Include main doc categories on most pages
const mainMenu = [
  // https://docusaurus.io/docs/sidebar/items
  {
    type: "link",
    href: "/kv/manual",
    label: "Manual",
    className: "icon-menu-option icon-menu-user-guide",
  },
  {
    type: "link",
    label: "Tutorials & Examples",
    href: "/kv/tutorials",
    className: "icon-menu-option icon-menu-tutorials",
  },
  {
    type: "link",
    label: "API Reference",
    href: "https://deno.land/api?unstable=true&s=Deno.Kv",
    className: "icon-menu-option icon-menu-api __no-external",
  },
];

const sidebars = {
  kv: mainMenu,

  kvGuideHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>Deno KV Manual</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Quick Start",
      id: "manual/index",
    },
    "manual/key_space",
    "manual/operations",
    "manual/secondary_indexes",
    "manual/transactions",
    "manual/on_deploy",
  ]),

  kvTutorialsHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>Tutorials &amp; Examples</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Overview",
      id: "tutorials/index",
    },
    {
      type: "link",
      label: "TODO List",
      href: "https://github.com/denoland/showcase_todo",
    },
    {
      type: "link",
      label: "Multiplayer Tic-Tac-Toe",
      href: "https://github.com/denoland/tic-tac-toe",
    },
    {
      type: "link",
      label: "Real-time Pixel Canvas",
      href: "https://github.com/denoland/pixelpage",
    },
    {
      type: "link",
      label: "KV-powered oAuth2",
      href: "https://github.com/denoland/deno_kv_oauth",
    },
    {
      type: "link",
      label: "SaaSKit",
      href: "https://github.com/denoland/saaskit",
    },
    {
      type: "link",
      label: "More on Deno by Example",
      href: "https://examples.deno.land",
    },
    {
      type: "html",
      value: '<div style="height: 30px;"></div>',
    },
  ]),
};

module.exports = sidebars;
