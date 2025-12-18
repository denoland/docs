---
title: OIDC
description: The Deno Deploy runtime environment acts as an OpenID Connect (OIDC) provider, enabling you to integrate with third-party services that support OIDC authentication.
---

Deno Deploy is an OIDC provider. Every running application of Deno Deploy can be
issued short-lived JWT tokens that are signed by Deno Deploy. These tokens
contain information about the application, such as the organization and
application ids and slugs, the context in which an application is executing, and
the running revision ID.

The tokens can be used to authenticate with third-party services that support
OIDC authentication, such as major cloud providers, but also HashiCorp Vault,
NPM, and others.

:::tip

Do you want to use OIDC tokens to authenticate with AWS or Google Cloud? Use the
[Cloud Connections](/deploy/reference/cloud_connections) feature instead of
manually configuring OIDC authentication. Cloud Connections handle the entire
configuration for you, including setting up trust relationships and permissions.
OIDC is used under the hood.

:::

## Issuing Tokens

To issue a token for the currently running application, use the `getIdToken()`
function from the [`@deno/oidc` module on JSR](http://jsr.io/@deno/oidc).

First, install `@deno/oidc` as a dependency of your application:

```sh
deno add jsr:@deno/oidc
```

Then, import the `getIdToken()` function and call it with the desired audience:

```ts
import { getIdToken } from "jsr:@deno/oidc";

const token = await getIdToken("https://example.com/");
console.log(token);
```

The `audience` parameter is a string that identifies the intended recipient of
the token. It is typically a URL or an identifier that represents the service or
application that will consume the token. The audience value must match the value
configured in the third-party service that you want to authenticate with. It
will be placed into the `aud` claim of the issued JWT token.

The `getIdToken()` function returns a promise that resolves to a JWT token as a
string.

To check whether your current environment supports OIDC (i.e. whether your
application is running on Deno Deploy), you can use the
`supportsIssuingIdTokens` namespaced property:

```ts
import { supportsIssuingIdTokens } from "jsr:@deno/oidc";

if (supportsIssuingIdTokens) {
  // OIDC is supported
} else {
  // OIDC is not supported
}
```

## Token Structure

The issued tokens are JWT tokens that are signed using the RS256 algorithm. The
tokens contain the following claims:

| Claim Name      | Example Value                          | Description                                                                                                    |
| --------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `iss`           | `https://oidc.deno.com`                | The issuer of the token, which is always `https://oidc.deno.com`.                                              |
| `aud`           | `https://example.com/`                 | The audience of the token, which is the value passed to the `getIdToken()` function.                           |
| `iat`           | `1757924011`                           | The issued-at time of the token, which is a Unix timestamp indicating when the token was issued.               |
| `exp`           | `1757924311`                           | The expiration time of the token, which is a Unix timestamp indicating when the token will expire.             |
| `nbf`           | `1757923951`                           | The not-before time of the token, which is a Unix timestamp indicating when the token becomes valid.           |
| `sub`           | `deployment:deno/astro-app/production` | The subject of the token, which is a string concatenation of `deployment:<org>/<app>/<context>`                |
| `org_id`        | `729adb8f-20d6-4b09-bb14-fac14cb260d1` | The unique identifier of the organization that owns the application.                                           |
| `org_slug`      | `deno`                                 | The slug of the organization that owns the application.                                                        |
| `app_id`        | `16ad21d8-7aeb-4155-8aa3-9f58df87cd3e` | The unique identifier of the application.                                                                      |
| `app_slug`      | `astro-app`                            | The slug of the application.                                                                                   |
| `context_id`    | `1d685676-92d7-418d-b103-75b46f1a58b4` | The unique identifier of the context in which the application is running.                                      |
| `context_name`  | `production`                           | The context in which the application is running.                                                               |
| `revision_id`   | `rh2r15rgy802`                         | The unique identifier of the revision of the application that is currently running.                            |
| `deployment_id` | <random string>                        | A unique hash containing the entire deployment metadata, including the application, revision, and context IDs. |

Tokens expire 5 minutes after they are issued. To account for clock skew, the
tokens `nbf` claim is set to 1 minute before the `iat` claim.

## Verifying Tokens

To verify the tokens issued by Deno Deploy, you need to fetch the public keys
from the OIDC provider's JWKS endpoint. The JWKS endpoint for Deno Deploy is:

```
https://oidc.deno.com/.well-known/jwks.json
```

Use the `kid` (key ID) from the JWT token header to select the correct key from
the JWKS response.

Deno Deploy also provides a standard OIDC discovery document at:

```
https://oidc.deno.com/.well-known/openid-configuration
```

Deno Deploy rotates its signing keys periodically. Therefore, it is important to
fetch the JWKS keys dynamically from the JWKS endpoint rather than hardcoding
them.

Currently, Deno Deploy signing keys use the `ES256` algorithm. This may change
in the future, depending on security requirements, best practices, and support
in third-party services.

To verify the tokens, you can use a JWT library that supports OIDC and JWKS. In
TypeScript, you can use the [`jose`](https://jsr.io/@panva/jose) library.
