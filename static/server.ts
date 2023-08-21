import { Application, Router } from "https://deno.land/x/oak@v10.2.0/mod.ts";

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: Deno.cwd(),
      index: "index.html",
    });
  } catch {
    next();
  }
});

const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
