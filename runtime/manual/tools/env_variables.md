---
title: "Configuring Deno behavior"
---

There are several environment variables which can impact the behavior of Deno:

### DENO_AUTH_TOKENS

A list of authorization tokens which can be used to allow Deno to access remote
private code. See the
[Private modules and repositories](../advanced/private_repositories.md) section
for more details.

### DENO_TLS_CA_STORE

A list of certificate stores which will be used when establishing TLS
connections. The available stores are `mozilla` and `system`. You can specify
one, both or none. Certificate chains attempt to resolve in the same order in
which you specify them. The default value is `mozilla`. The `mozilla` store will
use the bundled Mozilla certs provided by
[`webpki-roots`](https://crates.io/crates/webpki-roots). The `system` store will
use your platform's
[native certificate store](https://crates.io/crates/rustls-native-certs). The
exact set of Mozilla certs will depend on the version of Deno you are using. If
you specify no certificate stores, then no trust will be given to any TLS
connection without also specifying `DENO_CERT` or `--cert` or specifying a
specific certificate per TLS connection.

### DENO_CERT

Load a certificate authority from a PEM encoded file. This "overrides" the
`--cert` option. See the [Proxies](../basics/modules/proxies.md) section for
more information.

### DENO_DIR

this will set the directory where cached information from the CLI is stored.
This includes items like cached remote modules, cached transpiled modules,
language server cache information and persisted data from local storage. This
defaults to the operating system's default cache location and then under the
`deno` path.

### DENO_INSTALL_ROOT

When using `deno install` where the installed scripts are stored. This defaults
to `$HOME/.deno/bin`.

### DENO_NO_PACKAGE_JSON

Set to disable auto-resolution of package.json files.

### DENO_NO_PROMPT

Set to disable permission prompts on access (alternative to passing
`--no-prompt` on invocation).

### DENO_NO_UPDATE_CHECK

Set to disable checking if a newer Deno version is available.

### DENO_WEBGPU_TRACE

The directory to use for WebGPU traces.

### HTTP_PROXY

The proxy address to use for HTTP requests. See the
[Proxies](../basics/modules/proxies.md) section for more information.

### HTTPS_PROXY

The proxy address to use for HTTPS requests. See the
[Proxies](../basics/modules/proxies.md) section for more information.

### NO_COLOR

If set, this will prevent the Deno CLI from sending ANSI color codes when
writing to stdout and stderr. See the website
[https://no-color.org](https://no-color.org/) for more information on this _de
facto_ standard. The value of this flag can be accessed at runtime without
permission to read the environment variables by checking the value of
`Deno.noColor`.

### NO_PROXY

Indicates hosts which should bypass the proxy set in the other environment
variables. See the [Proxies](../basics/modules/proxies.md) section for more
information.

### NPM_CONFIG_REGISTRY

The npm registry to use when loading modules via
[npm specifiers](../node/npm_specifiers.md)
