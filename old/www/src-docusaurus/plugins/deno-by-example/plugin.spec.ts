import * as vitest from "vitest";
import denoByExamplePlugin from "./plugin";

vitest.describe("plugin", () => {
  let sut;
  let context;
  let options;
  vitest.beforeEach(async () => {
    context = {
      siteDir: "./",
    };
    options = {
      id: "by-example",
      path: "by-example",
      routeBasePath: "/by-example",
    };
  });

  vitest.it("doesn't crash parsing the filesystem on execution", async () => {
    sut = await denoByExamplePlugin(context, options);
    vitest.expect(sut.examples.length).toBeGreaterThan(0);
  });

  vitest.it(
    "adds items to the sidebar for every example generated",
    async () => {
      sut = await denoByExamplePlugin(context, options);

      vitest.expect(sut.examples.length).toBeGreaterThan(0);
      vitest.expect(sut.examplesList.length).toEqual(sut.examples.length);
    },
  );
});
