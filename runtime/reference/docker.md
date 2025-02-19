---
title: Deno and Docker
---

## Using Deno with Docker

Deno provides [official Docker files](https://github.com/denoland/deno_docker)
and [images](https://hub.docker.com/r/denoland/deno).

To use the official image, create a `Dockerfile` in your project directory:

````dockerfile
Dockerfile:

```dockerfile
FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Cache dependencies
COPY deno.json .
COPY deno.lock* .
RUN deno cache deps.ts

# Copy source
COPY . .

# Compile the main app
RUN deno cache main.ts

# Run the app
CMD ["deno", "run", "--allow-net", "main.ts"]
````

### Best Practices

#### 1. Cache Dependencies

Cache your dependencies in a separate layer to leverage Docker's layer caching:

```dockerfile
FROM denoland/deno:latest
WORKDIR /app

# Cache deps first
COPY deno.json deno.lock* ./
RUN deno cache deps.ts

# Then copy and cache source
COPY . .
RUN deno cache main.ts
```

#### 2. Use Multi-stage Builds

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

#### 3. Permission Flags

Specify required permissions explicitly:

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/data", "main.ts"]
```

#### 4. Development Container

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
