---
title: Deno and Docker
description: "Complete guide to using Deno with Docker containers. Learn about official Deno images, writing Dockerfiles, multi-stage builds, workspace containerization, and Docker best practices for Deno applications."
---

## Using Deno with Docker

Deno provides [official Docker files](https://github.com/denoland/deno_docker)
and [images](https://hub.docker.com/r/denoland/deno).

To use the official image, create a `Dockerfile` in your project directory:

```dockerfile
FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Compile the main app
RUN deno cache main.ts

# Run the app
CMD ["deno", "run", "--allow-net", "main.ts"]
```

### Best Practices

#### Use Multi-stage Builds

For smaller production images:

```dockerfile
# Build stage
FROM denoland/deno:latest as builder
WORKDIR /app
COPY . .
RUN deno cache main.ts

# Production stage
FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-net", "main.ts"]
```

#### Permission Flags

Specify required permissions explicitly:

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/data", "main.ts"]
```

#### Development Container

For development with hot-reload:

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

CMD ["deno", "run", "--watch", "--allow-net", "main.ts"]
```

### Common Issues and Solutions

1. **Permission Denied Errors**
   - Use `--allow-*` flags appropriately
   - Consider using `deno.json` permissions

2. **Large Image Sizes**
   - Use multi-stage builds
   - Include only necessary files
   - Add proper `.dockerignore`

3. **Cache Invalidation**
   - Separate dependency caching
   - Use proper layer ordering

### Example .dockerignore

```text
.git
.gitignore
Dockerfile
README.md
*.log
_build/
node_modules/
```

### Available Docker Tags

Deno provides several official tags:

- `denoland/deno:latest` - Latest stable release
- `denoland/deno:alpine` - Alpine-based smaller image
- `denoland/deno:distroless` - Google's distroless-based image
- `denoland/deno:ubuntu` - Ubuntu-based image
- `denoland/deno:1.x` - Specific version tags

### Environment Variables

Common environment variables for Deno in Docker:

```dockerfile
ENV DENO_DIR=/deno-dir/
ENV DENO_INSTALL_ROOT=/usr/local
ENV PATH=${DENO_INSTALL_ROOT}/bin:${PATH}

# Optional environment variables
ENV DENO_NO_UPDATE_CHECK=1
ENV DENO_NO_PROMPT=1
```

### Running Tests in Docker

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

# Run tests
CMD ["deno", "test", "--allow-none"]
```

### Using Docker Compose

```yaml
// filepath: docker-compose.yml
version: "3.8"
services:
  deno-app:
    build: .
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DENO_ENV=development
    command: ["deno", "run", "--watch", "--allow-net", "main.ts"]
```

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD deno eval "try { await fetch('http://localhost:8000/health'); } catch { exit(1); }"
```

### Common Development Workflow

For local development:

1. Build the image: `docker build -t my-deno-app .`
2. Run with volume mount:

```bash
docker run -it --rm \
  -v ${PWD}:/app \
  -p 8000:8000 \
  my-deno-app
```

### Security Considerations

- Run as non-root user:

```dockerfile
# Create deno user
RUN addgroup --system deno && \
    adduser --system --ingroup deno deno

# Switch to deno user
USER deno

# Continue with rest of Dockerfile
```

- Use minimal permissions:

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/app", "main.ts"]
```

- Consider using `--deny-*` flags for additional security

## Working with Workspaces in Docker

When working with Deno workspaces (monorepos) in Docker, there are two main
approaches:

### 1. Full Workspace Containerization

Include the entire workspace when you need all dependencies:

```dockerfile
FROM denoland/deno:latest

WORKDIR /app

# Copy entire workspace
COPY deno.json .
COPY project-a/ ./project-a/
COPY project-b/ ./project-b/

WORKDIR /app/project-a
CMD ["deno", "run", "-A", "mod.ts"]
```

### 2. Minimal Workspace Containerization

For smaller images, include only required workspace members:

1. Create a build context structure:

```sh
project-root/
├── docker/
│   └── project-a/
│       ├── Dockerfile
│       ├── .dockerignore
│       └── build-context.sh
├── deno.json
├── project-a/
└── project-b/
```

2. Create a `.dockerignore`:

```text
// filepath: docker/project-a/.dockerignore
*
!deno.json
!project-a/**
!project-b/**  # Only if needed
```

3. Create a build context script:

```bash
// filepath: docker/project-a/build-context.sh
#!/bin/bash

# Create temporary build context
BUILD_DIR="./tmp-build-context"
mkdir -p $BUILD_DIR

# Copy workspace configuration
cp ../../deno.json $BUILD_DIR/

# Copy main project
cp -r ../../project-a $BUILD_DIR/

# Copy only required dependencies
if grep -q "\"@scope/project-b\"" "../../project-a/mod.ts"; then
    cp -r ../../project-b $BUILD_DIR/
fi
```

4. Create a minimal Dockerfile:

```dockerfile
// filepath: docker/project-a/Dockerfile
FROM denoland/deno:latest

WORKDIR /app

# Copy only necessary files
COPY deno.json .
COPY project-a/ ./project-a/
# Copy dependencies only if required
COPY project-b/ ./project-b/

WORKDIR /app/project-a

CMD ["deno", "run", "-A", "mod.ts"]
```

5. Build the container:

```bash
cd docker/project-a
./build-context.sh
docker build -t project-a -f Dockerfile tmp-build-context
rm -rf tmp-build-context
```

### Best Practices

- Always include the root `deno.json` file
- Maintain the same directory structure as development
- Document workspace dependencies clearly
- Use build scripts to manage context
- Include only required workspace members
- Update `.dockerignore` when dependencies change
