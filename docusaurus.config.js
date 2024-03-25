const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const findReplace = require("./src/remark/find_replace");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const config = {
  title: "Deno Docs",
  tagline: "Deno is the next generation runtime for JavaScript and TypeScript.",
  favicon: "img/favicon.ico",
  url: "https://docs.deno.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          id: "runtime",
          path: "runtime",
          routeBasePath: "runtime",
          sidebarPath: require.resolve("./sidebars/runtime.js"),
          remarkPlugins: [
            findReplace,
          ],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        googleTagManager: {
          containerId: "GTM-5B5TH8ZJ",
        },
      },
    ],
  ],

  plugins: [
    /*
    // Eventually, we want to move standard library docs here as well rather
    // than another external link
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "stdlib",
        path: "stdlib",
        routeBasePath: "stdlib",
        sidebarPath: require.resolve("./sidebars/runtime.js"),
      },
    ],
    */
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "deploy",
        path: "deploy",
        routeBasePath: "/deploy",
        sidebarPath: require.resolve("./sidebars/deploy.js"),
        remarkPlugins: [
          findReplace,
        ],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "subhosting",
        path: "subhosting",
        routeBasePath: "/subhosting",
        sidebarPath: require.resolve("./sidebars/subhosting.js"),
        remarkPlugins: [
          findReplace,
        ],
      },
    ],
    // Enables our custom pages in "src" to use Tailwind classes
    async function tailwindPlugin(_context, _options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    // Set up a node.js polyfill for webpack builds
    function nodePolyfill(_context, _options) {
      return {
        name: "node-polyfill",
        configureWebpack(_config, _isServer) {
          return {
            plugins: [
              new NodePolyfillPlugin(),
            ],
          };
        },
      };
    },
  ],

  themeConfig: ({
    // Social card
    image: "img/social.png",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Docs",
      logo: {
        alt: "Deno Docs",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
        href: "/",
      },
      items: [
        {
          to: "/runtime/manual",
          position: "left",
          label: "Deno Runtime",
          activeBaseRegex: `^/runtime`,
        },
        {
          to: "/deploy/manual",
          position: "left",
          label: "Deno Deploy",
          activeBaseRegex: `^/deploy`,
        },
        {
          to: "/subhosting/manual",
          position: "left",
          label: "Subhosting",
          activeBaseRegex: `^/subhosting`,
        },
        {
          href: "https://www.deno.com",
          label: "deno.com",
          position: "right",
        },
      ],
    },
    sidebar: {
      hideable: true,
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: true,
      },
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Deno Docs",
          items: [
            {
              label: "Deno Runtime",
              to: "/runtime/manual",
            },
            {
              label: "Deno Deploy",
              to: "/deploy/manual",
            },
            {
              label: "Standard Library",
              href: "https://jsr.io/@std",
            },
            {
              label: "Deno by Example",
              href: "https://examples.deno.land",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/deno",
            },
            {
              label: "GitHub",
              href: "https://github.com/denoland",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/deno_land",
            },
            {
              label: "YouTube",
              href: "https://youtube.com/@deno_land",
            },
            {
              label: "Newsletter",
              href: "https://deno.news/",
            },
          ],
        },
        {
          title: "Help & Feedback",
          items: [
            {
              label: "Community Support",
              href: "https://discord.gg/deno",
            },
            {
              label: "Deploy System Status",
              href: "https://www.denostatus.com",
            },
            {
              label: "Deploy Feedback",
              href: "https://github.com/denoland/deploy_feedback",
            },
            {
              label: "Report a Problem",
              href: "mailto:support@deno.com",
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "Blog",
              href: "https://www.deno.com/blog",
            },
            {
              label: "Careers",
              href: "https://deno.com/jobs",
            },
            {
              label: "Merch",
              href: "https://merch.deno.com/",
            },
            {
              label: "Privacy Policy",
              href: "/deploy/manual/privacy-policy",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} the Deno authors.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["powershell", "diff"],
    },
    algolia: {
      // The application ID provided by Algolia
      appId: "KAQ4QIALEB",

      // Public API key: it is safe to commit it
      apiKey: "0795dfc12048ff344a54bb4c04c9000b",

      indexName: "deno",

      insights: true,

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through
      // window.location instead on history.push. Useful when our Algolia
      // config crawls multiple documentation sites and we want to navigate
      // with window.location.href to them.
      // externalUrlRegex: "external\\.com|domain\\.com",

      // Optional: Replace parts of the item URLs from Algolia. Useful when
      // using the same search index for multiple deployments using a
      // different baseUrl. You can use regexp or string in the `from` param.
      // For example: localhost:3000 vs myCompany.com/docs
      /*
        replaceSearchResultPathname: {
          from: "/docs/", // or as RegExp: /\/docs\//
          to: "/",
        },
        */

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false`
      // to disable it)
      searchPagePath: "search",
    },
  }),
};

export default config;
