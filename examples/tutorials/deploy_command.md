---
title: "Deploy an app with the deno deploy command"
description: "Step-by-step tutorial for using the deno deploy CLI command to create and deploy your first application to Deno Deploy Early Access."
url: /examples/deploy_command_tutorial/
---

The `deno deploy` command provides a powerful CLI for deploying and managing
applications on [Deno Deploy<sup>EA</sup>](https://deno.com/deploy).

If you already have an app to deploy you can skip to
[Deploying your application](#deploying-your-application), or read on to make
and then deploy a simple app.

## Prerequisites

Before using the deploy command, you will need access to Deno
Deploy<sup>EA</sup>, and you will need a Deno Deploy<sup>EA</sup> organization.

1. Visit the
   [Deno Deploy account settings](https://dash.deno.com/account#early-access)
2. Turn on the "Enable Early Access" toggle
3. Create a Deno Deploy<sup>EA</sup> organization in the
   [Deno Deploy<sup>EA</sup> dashboard](https://app.deno.com/).

## Create a simple web application

First, let's create a basic HTTP server that will serve as our application.

Create a new directory for your project and navigate into it:

```bash
mkdir my-deploy-app
cd my-deploy-app
```

Initialize a new Deno project:

```bash
deno init
```

Replace the contents of `main.ts` with a simple HTTP server:

```ts title="main.ts"
Deno.serve({ port: 8000 }, (req) => {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  // Log every request
  console.log(
    `[${timestamp}] ${req.method} ${url.pathname} - User-Agent: ${userAgent}`,
  );

  // Simple routing
  if (url.pathname === "/") {
    console.log("Serving home page");
    return new Response(
      `
      <html>
        <head><title>My Deploy App</title></head>
        <body>
          <h1>Welcome to My Deploy App!</h1>
          <p>This app was deployed using the deno deploy command.</p>
          <nav>
            <a href="/about">About</a> | 
            <a href="/api/status">API Status</a> |
            <a href="/api/error">Test Error</a>
          </nav>
        </body>
      </html>
    `,
      {
        headers: { "content-type": "text/html" },
      },
    );
  }

  if (url.pathname === "/about") {
    console.log("Serving about page");
    return new Response(
      `
      <html>
        <head><title>About - My Deploy App</title></head>
        <body>
          <h1>About This App</h1>
          <p>This is a simple demonstration of deploying with the deno deploy CLI.</p>
          <p>Check the logs to see request information!</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `,
      {
        headers: { "content-type": "text/html" },
      },
    );
  }

  if (url.pathname === "/api/status") {
    const responseData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "API is running successfully",
      requestCount: Math.floor(Math.random() * 1000) + 1, // Simulate request counter
    };

    console.log("API status check - all systems operational");
    console.log(`Response data:`, responseData);

    return Response.json(responseData);
  }

  if (url.pathname === "/api/error") {
    // This endpoint demonstrates error logging
    console.error("Error endpoint accessed - demonstrating error logging");
    console.warn("This is a warning message that will appear in logs");

    return Response.json({
      error: "This is a test error for demonstration",
      timestamp: new Date().toISOString(),
      tip: "Check the logs with: deno deploy logs",
    }, { status: 500 });
  }

  // 404 for all other routes
  console.warn(`404 - Route not found: ${url.pathname}`);
  return new Response("Not Found", { status: 404 });
});
```

### Test your application locally

Update the `dev` task in the `deno.json` file in the root, to allow network
access:

```json
"dev": "deno run -N --watch main.ts"
```

Then run the dev command:

```sh
deno run dev
```

Visit `http://localhost:8000` to see your application running. Try navigating to
the different routes (`/about`, `/api/status`, and `/api/error`) to verify
everything works. You'll notice that each request is logged to the console -
these are the same logs you'll be able to see when the app is deployed!

## Authentication

The `deno deploy` command handles authentication automatically. When you first
run a deploy command, it will prompt you to authenticate. Run the deploy command
with the `--help` flag to see all available options:

```bash
deno deploy --help
```

:::note Deno Deploy<sup>EA</sup> organization requirement

If you don't already have a Deno Deploy<sup>EA</sup> organization set up, you
can create one through the
[Deno Deploy<sup>EA</sup> web app](https://app.deno.com).

:::

## Create and deploy your application

Now let's use the `deno deploy` command to deploy your application:

```bash
deno deploy create
```

If you have multiple organizations, you can specify which one to use with the
`--org` flag:

```bash
deno deploy create --org your-org-name
```

Replace `your-org-name` with your actual organization name.

The deployment process will:

1. Make a tarball of your application code
2. Upload the tarball to Deno Deploy
3. Unpack the tarball
4. Build and deploy to the edge network
5. Provide you with a live URL

## Managing environment variables

Your application might need environment variables for configuration. The
`deno deploy` command provides comprehensive environment variable management.

## List environment variables

You can view all environment variables for your application:

```bash
deno deploy env list
```

### Add and update environment variables

To add individual environment variables, use the `deno deploy env add` command,
for example:

```bash
deno deploy env add API_KEY "your-secret-key"
deno deploy env add DATABASE_URL "postgresql://..."
```

Then to update them, use the `deno deploy env update-value` command, for
example:

```bash
deno deploy env update-value API_KEY "new-secret-key"
deno deploy env update-value DATABASE_URL "postgresql://new-user:new-pass@localhost/new-db"
```

### Delete environment variables

To delete an environment variable, use the `deno deploy env delete` command, for
example:

```bash
deno deploy env delete API_KEY
deno deploy env delete DATABASE_URL
```

### Load environment variables from a .env file

You can also use an `.env` file to load your environment variables to your
deployed app:

```bash
deno deploy env load .env
```

## Monitoring your application

### View application logs

After deploying your application, you can stream live logs to see exactly what's
happening:

```bash
deno deploy logs
```

Once your app is deployed, visit your application URL and navigate to different
pages. You'll see logs like:

- Request logs showing HTTP method, path, and user agent
- Info logs from `console.log()` calls
- Warning logs from `console.warn()` calls
- Error logs from `console.error()` calls

Open your app url in the browser and try visiting the `/api/error` endpoint to
see error logs in action, after running `deno deploy logs`.

### View logs for a specific time range

To view logs for a specific time range, you can use the `--start` and `--end`
flags:

```bash
deno deploy logs \
  --start "2024-01-01T00:00:00Z" \
  --end "2024-01-01T23:59:59Z"
```

🦕 You've successfully deployed your first application with the `deno deploy`
command! Check out the [`deno deploy` docs](/runtime/reference/cli/deploy/) for
more commands and options.

For more information on Deno Deploy<sup>EA</sup>, check the
[Deno Deploy EA documentation](/deploy/early-access/).
