// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const findReplace = require("./src/remark/find_replace");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Deno Docs",
  tagline:
    "Build and deploy applications with the easiest, most secure JavaScript runtime.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.deno.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          id: "runtime",
          path: "runtime",
          routeBasePath: "runtime",
          sidebarPath: require.resolve("./sidebars/runtime.js"),
          remarkPlugins: [
            findReplace,
          ],
        },
        /*
        blog: {
          blogTitle: "Deno Blog",
          blogDescription: "Latest news and tutorials from Deno Land",
          postsPerPage: 50,
          feedOptions: {
            type: "all",
            copyright: `Copyright © ${
              new Date().getFullYear()
            } the Deno authors.`,
            createFeedItems: (params) => {
              const { blogPosts, defaultCreateFeedItems, ...rest } = params;
              return defaultCreateFeedItems({
                // keep only the 10 most recent blog posts in the feed
                blogPosts: blogPosts.filter((item, index) => index < 10),
                ...rest,
              });
            },
          },
        },
        */
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    /*
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
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "kv",
        path: "kv",
        routeBasePath: "/kv",
        sidebarPath: require.resolve("./sidebars/kv.js"),
      },
    ],
    async function tailwindPlugin(context, options) {
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
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/social.png",
      colorMode: {
        defaultMode: "light",
      },
      navbar: {
        title: "Deno Docs",
        logo: {
          alt: "Deno",
          src: "img/logo.svg",
          srcDark: "img/logo-dark.svg",
          href: "/runtime/manual",
        },
        items: [
          {
            to: "/runtime/manual",
            position: "left",
            label: "Runtime",
            activeBaseRegex: `^/runtime`,
          },
          {
            to: "/deploy/manual",
            position: "left",
            label: "Deploy",
            activeBaseRegex: `^/deploy`,
          },
          {
            to: "/kv/manual",
            position: "left",
            label: "KV",
            activeBaseRegex: `^/kv`,
          },
          {
            href: "https://www.deno.land/std",
            label: "Std. Library",
          },
          /*
          {
            to: '/stdlib',
            position: 'left',
            label: 'Standard Library',
            activeBaseRegex: `^/stdlib`,
          },
          */
          /*
          {
            to: 'blog',
            label: 'Blog',
            position: 'left',
            activeBaseRegex: `/blog`,
          },
          */
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
                to: "/runtime",
              },
              /*
              {
                label: 'Standard Library',
                to: '/stdlib',
              },
              */
              {
                label: "Deno Deploy",
                to: "/deploy",
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

module.exports = config;
