/**
 * @title Sign in with GitHub (OAuth)
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps} GitHub OAuth web flow
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URL} MDN: URL
 * @group Network
 *
 * The OAuth authorization code flow lets users sign in with an existing
 * account. This server redirects to GitHub, exchanges the returned code for an
 * access token, and reads the user's profile. Register an OAuth app at
 * github.com/settings/developers with callback http://localhost:8000/callback,
 * then set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.
 */

const clientId = Deno.env.get("GITHUB_CLIENT_ID")!;
const clientSecret = Deno.env.get("GITHUB_CLIENT_SECRET")!;
const redirectUri = "http://localhost:8000/callback";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Step 1: send the user to GitHub to authorize the app.
  if (url.pathname === "/") {
    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", clientId);
    authorize.searchParams.set("redirect_uri", redirectUri);
    authorize.searchParams.set("scope", "read:user");
    return Response.redirect(authorize, 302);
  }

  // Step 2: GitHub redirects back here with a short-lived code.
  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    // Step 3: exchange the code for an access token.
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      },
    );
    const { access_token } = await tokenRes.json();

    // Step 4: call the API as the user with their token.
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${access_token}`,
        "user-agent": "deno-oauth-example",
      },
    });
    const user = await userRes.json();
    return new Response(`Signed in as ${user.login}`);
  }

  return new Response("Not found", { status: 404 });
}

Deno.serve(handler);
