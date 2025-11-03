FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu
COPY --from=denoland/deno:bin-2.4.5 /deno /usr/local/bin/deno

EXPOSE 3000
EXPOSE 8000

WORKDIR /app

COPY . .
